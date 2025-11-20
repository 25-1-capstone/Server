import mqtt from 'mqtt';
import {saveFocusTargetState} from './repositories/focus-target.repository.js';
import {prisma} from './db.config.js';
import {sendStateToClients, sendTimerToClient, sendTimerToGroup} from './websocket-server.js';
// import {Request as ExpressRequest} from 'express';

type TimerInfo = {
  lastTimestamp: Date;
  interval: NodeJS.Timeout;
  isRunning: boolean;
};

export const mqttClient = mqtt.connect('mqtt://164.92.96.240:1883', {
  username: '',
  password: '',
  clientId: `client_${Math.random().toString(16).substr(2, 8)}`,
});

export const timers = new Map<string, TimerInfo>(); // userId → 타이머 정보
console.log('MQTT 연결 시도 중...');

// 타이머 시작 함수
function startTimer(userId: string, groupId: string, timestamp: Date) {
  if (timers.has(userId)) {
    const timerInfo = timers.get(userId)!;
    if (timerInfo.isRunning) return; // 이미 실행 중이면 리턴
    
    timerInfo.isRunning = true;
    timerInfo.lastTimestamp = timestamp;
  } else {
    timers.set(userId, {
      lastTimestamp: timestamp,
      interval: setInterval(async () => {
        const timerInfo = timers.get(userId);
        if (!timerInfo || !timerInfo.isRunning) return;

        const currentTime = new Date();
        const elapsedTime = currentTime.getTime() - timerInfo.lastTimestamp.getTime();
        
        // 개인 타이머 상태 전송
        sendTimerToClient(userId, {
          isRunning: true,
          elapsedTime: elapsedTime,
          startTime: timerInfo.lastTimestamp,
          userId: userId
        });

        // 그룹 타이머 상태 전송
        sendTimerToGroup(groupId, userId, {
          isRunning: true,
          elapsedTime: elapsedTime,
          startTime: timerInfo.lastTimestamp,
          userId: userId
        });
        
        timerInfo.lastTimestamp = currentTime;
      }, 1000), // 1초마다 체크
      isRunning: true
    });
  }
}

// 타이머 중지 함수
function stopTimer(userId: string, groupId: string) {
  const timerInfo = timers.get(userId);
  if (timerInfo) {
    timerInfo.isRunning = false;
    
    // 개인 타이머 중지 상태 전송
    sendTimerToClient(userId, {
      isRunning: false,
      elapsedTime: 0,
      startTime: null,
      userId: userId
    });

    // 그룹 타이머 중지 상태 전송
    sendTimerToGroup(groupId, userId, {
      isRunning: false,
      elapsedTime: 0,
      startTime: null,
      userId: userId
    });
  }
}

// MQTT 연결
mqttClient.on('connect', () => {
  console.log('mqtt 연결 성공');
  
  // 라즈베리파이로부터의 상태 데이터 구독
  mqttClient.subscribe('state/group/+', err => {
    if (err) console.error('mqtt 구독 실패', err);
    else console.log('라즈베리파이 상태 데이터 구독 완료');
  });

  // MQTT 브로커로부터 메시지 수신 시
  mqttClient.on('message', async (topic, message) => {
    try {
      // 라즈베리파이로부터의 상태 데이터 처리
      if (topic.startsWith('state/group/')) {
        const payload = JSON.parse(message.toString());
        if(payload.targetId !== '77' && payload.targetId !== '84' && payload.targetId !== '73' && payload.targetId !== '-1') {
          payload.targetId = '4'
        }
        console.log('라즈베리파이로부터 수신한 데이터:', payload);
        const parseGroup = topic.match(/^state\/group\/(\d+)$/);
        if (parseGroup === null) {
          throw new Error('userId 파싱 실패');
        }
        const groupId = parseGroup[1];

        console.log('파싱한 groupId:', groupId);
        // 초기 데이터 처리
        if (payload.isInitial) {
          console.log('초기 데이터');
          const focusTarget = await prisma.focusTarget.findFirst({
            where: {
              userId: BigInt(payload.userId)
            }
          });
          
          if (focusTarget) {
            console.log('초기 focusTarget:', focusTarget);
            startTimer(payload.userId.toString(), groupId, new Date(payload.timestamp));
          }
        } 
        // 일반 상태 업데이트 처리
        else {
          console.log('이후 데이터');

          // 이전 상태 데이터 처리
          const prevTarget = await prisma.statusTimeTable.findFirst({
            where: {
              userId: BigInt(payload.userId)
            },
            orderBy: {
              timestamp: 'desc'
            }
          });
          console.log('prevTarget:', prevTarget);
          // 빈 자리 혹은 오프라인이 아닐 경우
          if (prevTarget?.targetId !== BigInt(4) && prevTarget?.targetId !== BigInt(-1)) {
            const prevEnabled = await prisma.enabledFocusTargetTimeTable.findFirst({
              where: {
                focusTarget: {userId: BigInt(payload.userId)}
              },
              orderBy: {
                measurementStartAt: 'desc'
              }
            });
            const prevDisabled = await prisma.disabledFocusTargetTimeTable.findFirst({
              where: {
                focusTarget: {userId: BigInt(payload.userId)}
              },
              orderBy: {
                measurementStartAt: 'desc'
              }
            });

            console.log('prevEnabled:', prevEnabled);
            console.log('prevDisabled:', prevDisabled);
            // 비허용 동작 데이터 종료 시간 업데이트
            if ((prevEnabled === null && prevDisabled !== null) || (prevEnabled!.measurementStartAt < prevDisabled!.measurementStartAt)) {
              await prisma.disabledFocusTargetTimeTable.update({
                where: {
                  id: prevDisabled!.id,
                },
                data: {
                  measurementEndAt: new Date(payload.timestamp)
                }
              });
            } 
            // 허용 동작 데이터 종료 시간 업데이트
            else {
              await prisma.enabledFocusTargetTimeTable.update({
                where: {
                  id: prevEnabled!.id,
                },
                data: {
                  measurementEndAt: new Date(payload.timestamp)
                }
              });
            }
          }
          // 사용자 ID, 최근 (시작)타임스탬프로 최근 빈 자리 데이터 조회해 종료 시간 업데이트 
          else if (prevTarget?.targetId === BigInt(-1)) {
            const emptyData = await prisma.emptyTimeTable.findFirst({
              where: {
                userId: BigInt(payload.userId),
                measurementStartAt: prevTarget.timestamp
              }
            });
            await prisma.emptyTimeTable.update({
              where: {
                id: emptyData!.id
              },
              data: {
                measurementEndAt: new Date(payload.timestamp)
              }
            });
          } else {
            // 사용자 ID, 최근 (시작)타임스탬프로 최근 오프라인 데이터 조회해 종료 시간 업데이트
            const offlineData = await prisma.offlineTimeTable.findFirst({
              where: {
                userId: BigInt(payload.userId),
                measurementStartAt: new Date(prevTarget.timestamp)
              }
            });
            // 
            await prisma.offlineTimeTable.update({
              where: {
                id: offlineData!.id
              },
              data: {
                measurementEndAt: new Date(payload.timestamp)
              }
            });
          }
        }
        
        const targetMap: Record<string, string> = {
          '77': '핸드폰',
          '84': '책 읽기',
          '73': 'PC 보기',
          '4': '기타',
          '-1': '자리 비움',
        };

        const focusTarget = await prisma.focusTarget.findFirst({
          where: {
            userId: BigInt(payload.userId),
            target: targetMap[payload.targetId]
          }
        })

        //console.log('이후 focusTarget:', focusTarget);
        if (payload.targetId === 4 || payload.targetId === -1 || focusTarget?.status === 0) { // 허용 동작 X
          stopTimer(payload.userId.toString(), groupId);
        } else { // 허용 동작 O
          startTimer(payload.userId.toString(), groupId, new Date(payload.timestamp));
        }

        // 현재 상태 저장
        await prisma.statusTimeTable.create({
          data: {
            userId: payload.userId,
            timestamp: new Date(payload.timestamp),
            targetId: BigInt(payload.targetId)
          }
        });

        await saveFocusTargetState(payload);
        sendStateToClients(groupId, payload);
      }
    } catch (err) {
      console.error('메시지 처리 실패', err);
    }
  });
});

mqttClient.on('error', error => {
  console.error('mqtt 에러', error);
});

mqttClient.on('close', () => {
  console.error('MQTT 연결이 닫혔습니다');
});

mqttClient.on('offline', () => {
  console.error('MQTT 브로커가 오프라인입니다');
});

mqttClient.on('reconnect', () => {
  console.log('MQTT 재연결 시도 중...');
});


// 로그인 시 한 번만 실행되는 함수
export async function publishGroupIdList(userId: bigint) {
  const groupIdList = await prisma.userGroup.findMany({
    where: {userId: userId},
    select: {groupId: true},
  });

  const payload = 
    groupIdList.map(group => group.groupId.toString());
  console.log('로그인 시 그룹 ID 목록 전송:', payload);
  if (mqttClient.connected) {
    mqttClient.publish(`init/${userId}`, JSON.stringify(payload), err => {
      if (err) {
        console.error('MQTT publish 실패:', err);
      } else {
        console.log('MQTT groupIdList 전송 완료:', payload);
      }
    });
  } else {
    mqttClient.once('connect', () => {
      mqttClient.publish(`init/${userId}`, JSON.stringify(payload), err => {
        if (err) {
          console.error('MQTT publish 실패:', err);
        } else {
          console.log('MQTT groupIdList 전송 완료:', payload);
        }
      });
    });
  }
}
