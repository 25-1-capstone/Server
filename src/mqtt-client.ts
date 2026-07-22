import mqtt from 'mqtt';
import {saveFocusTargetState} from './repositories/focus-target.repository.js';
import {prisma} from './db.config.js';
import {sendStateToClients, sendTimerToClient, sendTimerToGroup} from './websocket-server.js';
// sendStateToClients: 그룹 사용자들에게 현재 상태 전송
// sendTimerToClient: 특정 사용자에게 개인 타이머 전송
// sendTimerToGroup: 그룹원들에게 해당 사용자의 타이머 전송

type TimerInfo = { // 타이머 정보의 구조
  lastTimestamp: Date; // 타이머 기준 시간 (현재 시간과 이 값의 차로 경과 시간 계산)
  groupId: string; // 해당 사용자가 속한 그룹 ID
  isRunning: boolean; // 타이머가 현재 실행 중인지
};

type StatePayload = { // MQTT로 들어오는 상태 메시지의 구조
  userId: string | number; // 사용자 ID
  targetId: string; // 사용자가 상태(응시하는 대상)의 ID
  timestamp: string; // 응시 대상이 감지되는 시각
  isInitial?: boolean; // 초기 데이터인지
};

const TIMER_INTERVAL_MS = 1000; // 타이머 갱신 주기 (1초마다 실행)

const VALID_TARGET_IDS = new Set(['77', '84', '73', '-1']); // 허용된 targetId 리스트
// 이 리스트에 있는 값이면 그대로 사용, 아니면 '4'(기타)로 처리

const TARGET_MAP: Record<string, string> = { // targetId를 실제 DB의 target 이름과 매핑
  '77': '핸드폰',
  '84': '책 읽기',
  '73': 'PC 보기',
  '4': '기타',
  '-1': '자리 비움',
};

// 사용자별 타이머 정보를 저장하는 Map
export const timers = new Map<string, TimerInfo>(); // 'userId → 타이머 정보' 구조로 저장됨
// ex. 
//   "1" -> {
//     lastTimestamp: timestamp,
//     groupId: "3",
//     isRunning: true
//   }
// 특정 사용자의 타이머를 가져올 경우: timers.get(userId)

const focusTargetStatusCache = new Map<string, number | null> ();
// focusTaget의 status 값을 캐싱하는 Map
// ex. key 
//   "1:77" -> 1번 사용자의 77번 target 상태
//   DB를 매번 조회하지 않기 위해 캐시를 둠

// MQTT 브로커에 접속
export const mqttClient = mqtt.connect('mqtt://164.92.96.240:1883', {
  username: '',
  password: '',
  clientId: `client_${Math.random().toString(16).slice(2, 10)}`, 
  // 'client_ + {랜덤 문자열}' 형태로 생성 -> 실행될 때마다 MQTT 클라이언트 ID를 랜덤하게 생성
  // 서버 재실행 시 MQTT 브로커가 같은 클라이언트로 오해하지 않게 하기 위함
});

console.log('MQTT 연결 시도 중...');

// 1초마다 반복 실행되는 전역 타이머 스케쥴러
// 기존: 사용자마다 setInertval 생성
// 개선: setInterval 1개로 실행 중인 사용자만 순회
setInterval(() => {
  const currentTime = new Date(); // 현재 시간
  
  for (const [userId, timerInfo] of timers) { 
    if (!timerInfo.isRunning) continue; // 타이머가 실행 중이 아니면 건너뜀 (중지된 사용자는 타이머 전송 X)
    
    const elapsedTime = currentTime.getTime() - timerInfo.lastTimestamp.getTime(); // 경과 시간 계산
    // getTime(): Date를 밀리초 숫자로 변환

    const timerPayload = { // WebSocket으로 보낼 타이머 데이터
      isRunning: true, // 타이머 실행 중
      elapsedTime,
      startTime: timerInfo.lastTimestamp, // 타이머 기준 시작 시간
      userId,
    };

    sendTimerToClient(userId, timerPayload); // 해당 사용자 본인에게 타이머 정보 전송
    sendTimerToGroup(timerInfo.groupId, userId, timerPayload); // 같은 그룹 사용자들에게 사용자의 타이버 정보 전송
    
    timerInfo.lastTimestamp = currentTime; 
    // 마지막 기준 시간을 현재 시간으로 갱신 (다음 1초 뒤에는 이 시점부터 다시 경과 시간 계산)
  }
}, TIMER_INTERVAL_MS); // 1초마다 반복 실행

// 타이머 시작 함수 (사용자의 집중 타이머 시작)
function startTimer(userId: string, groupId: string, timestamp: Date) {
  const timerInfo = timers.get(userId); // 해당 사용자의 정보가 이미 있는지 확인

  if (timerInfo) { // 타이머 정보가 있다면
    const timerInfo = timers.get(userId)!;
    // 중간에 stopTimer()가 호출되어서 isRunning 값이 바뀔 수 있으므로 현재 사용자의 타이머 정보를 다시 가져옴
    if (timerInfo.isRunning) return; // 이미 타이머가 있고 실행 중이면 바로 종료 (중복 시작을 막음) 
    
    // 타이머가 없으면 새로 setInterval을 만듦
    timerInfo.isRunning = true; // 정지 -> 실행 변경
    timerInfo.lastTimestamp = timestamp; // 기준 시간 갱신
    timerInfo.groupId = groupId;
    
    return;
  }

  timers.set(userId, { // 기존 타이머가 없으면 새로 Map에 등록
    lastTimestamp: timestamp,
    groupId,
    isRunning: true, // 실행 중
  });
}

// 타이머 중지 함수
function stopTimer(userId: string, groupId: string) { 
  const timerInfo = timers.get(userId); // 사용자의 타이머 정보
  if (timerInfo) {
    timerInfo.isRunning = false; // 타이머 정보가 있으면 실행 상태 중지로 바꿈
  }

  const timerPayload = { // 중지 상태를 알리기 위한 payload
    isRunning: false,
    elapsedTime: 0, 
    startTime: null,
    userId,
  };
  
  // 사용자 본인에게 타이머 중지 상태 전송
  sendTimerToClient(userId, timerPayload);

  // 그룹원들에게 해당 사용자의 타이머 중지 상태 전송
  sendTimerToGroup(groupId, userId, timerPayload);
}

// payload 정규화 함수
function normalizePayload(rawPayload: any): StatePayload{ // MQTT로 들어온 원본 payload를 서버에서 쓰기 ㅗㅎ은 형태로 정리
  const userId = String(rawPayload.userId);
  const targetId = String(rawPayload.targetId);
  
  return { // 정규화된 payload 반환
    userId,
    targetId: VALID_TARGET_IDS.has(targetId)? targetId: '4', // 허용된 값이면 그대로, 아니면 '4'(기타)
    timestamp: rawPayload.timestamp,
    isInitial: rawPayload.isInitial,
  };
}

// topic에서 groupId을 추출하는 함수
function parseGroupId(topic: string){
  const parsed = topic.match(/^state\/group\/(\d+)$/); // 정규식으로 topic 검사
  // state/group/3 <- 3 추출

  if (!parsed) { // 정규식 매칭 실패 시
    throw new Error('groupId 파싱 실패'); 
  } 
  
  return parsed[1];
  /**
   *  [
   *    "state/group/3", // parsed[0]
   *    "3"              // parsed[1] <- ✅
   *  ]
   */
}

// focusTarget 캐시에 사용할 key를 생성하는 함수
function getFocusTargetCacheKey(userId: string, targetId: string) {
  return `${userId}:${targetId}`;
}

// 특정 사용자의 특정 target이 허용 상태인지 조회(+ 캐싱)하는 함수
async function getFocusTargetStatus(userId: string, targetId: string) {
  const cacheKey = getFocusTargetCacheKey(userId, targetId); // 캐시에 사용할 key

  if (focusTargetStatusCache.has(cacheKey)) { // 이미 캐시에 값이 있으면
    return focusTargetStatusCache.get(cacheKey); // DB 조회하지 않고 캐시 값 바로 반환
  }

  const focusTarget = await prisma.focusTarget.findFirst({ // 캐시에 없으면 DB에서 focusTarget 조회
    where: {
      userId: BigInt(userId),
      target: TARGET_MAP[targetId], // target 이름이 일치하는 row 찾음 ex. '77' -> '핸드폰' 조회
    },
    select: {
      status: true,
    },
  });

  const status = focusTarget?.status ?? null; // focusTarget이 있으면 status 사용, 아니면 null 처리

  focusTargetStatusCache.set(cacheKey, status); // 조회 결과를 캐시에 저장

  return status; 
}

// 허용/비허용 측정 종료 처리 함수
// - 이전 상태가 focusTarget 관련 상태였을 때 enabled 혹은 disabled측정 기록의 종료 시간을 업데이트
async function closeEnabledOrDisabledMeasurement(
  userId: bigint,
  currentTimestamp: Date,
) {
  const [prevEnabled, prevDisabled] = await Promise.all([ // enabled 기록과 disabled 기록 동시에(Promise) 조회
    prisma.enabledFocusTargetTimeTable.findFirst({
      where: {
        focusTarget: {userId},
      },
      orderBy: {
        measurementStartAt: 'desc',
      },
    }),
    prisma.disabledFocusTargetTimeTable.findFirst({ // 가장 최근 enabled 기록 조회
      where: {
        focusTarget: {userId},
      },
      orderBy: {
        measurementStartAt: 'desc',
      },
    }),
  ]);

  if (
    prevDisabled &&
    (!prevEnabled ||
      prevEnabled.measurementStartAt < prevDisabled.measurementStartAt)
  ) { // 최근 기록이 disabled인지 (disabled 기록 O & enabled 기록 X & enabled보다 disabled가 더 최근에 시작했다면)
    await prisma.disabledFocusTargetTimeTable.update({ // disabled 기록 업데이트
      where: {
        id: prevDisabled.id,
      },
      data: {
        measurementEndAt: currentTimestamp, // 종료 시간을 현재 timestamp로 설정
      },
    });
    return;
  }

  if (prevEnabled) { // enabled 기록이 있으면
    await prisma.enabledFocusTargetTimeTable.update({ // enabled 기록 업데이트
      where: {
        id: prevEnabled.id,
      },
      data: {
        measurementEndAt: currentTimestamp,
      },
    });
  }
}

// 자리 비움 기록 종료 함수
// - 이전 상태가 자리 비움일 때, 해당 empty 기록의 종료 시간을 업데이트
async function closeEmptyMeasurement(
  userId: bigint,
  prevTimestamp: Date, 
  currentTimestamp: Date,
) {
  const emptyData = await prisma.emptyTimeTable.findFirst({
    where: {
      userId,
      measurementStartAt: prevTimestamp,
    },
  });

  if (!emptyData) return; // 기록이 없으면 종료

  await prisma.emptyTimeTable.update({ // empty 기록 업데이트
    where: {
      id: emptyData.id,
    },
    data: {
      measurementEndAt: currentTimestamp,
    },
  });
}

// 오프라인 기록 종료 함수
// - 이전 상태가 오프라인/기타 처리 대상일 때 offline 기록을 종료
async function closeOfflineMeasurement(
  userId: bigint,
  prevTimestamp: Date,
  currentTimestamp: Date,
) {
  const offlineData = await prisma.offlineTimeTable.findFirst({
    where: {
      userId,
      measurementStartAt: prevTimestamp,
    },
  });

  if (!offlineData) return; // offline 기록이 없으면 종료

  await prisma.offlineTimeTable.update({
    where: {
      id: offlineData.id,
    },
    data: {
      measurementEndAt: currentTimestamp,
    },
  });
}

// 이전 측정 기록 종료 메인 함수
// - 새 상태가 들어왔을 때, 이전 상태의 측정 종료 시간을 닫아줌
async function closePreviousMeasurement(payload: StatePayload) {
  const userId = BigInt(payload.userId);
  const currentTimestamp = new Date(payload.timestamp);

  const prevTarget = await prisma.statusTimeTable.findFirst({ // 가장 최근 상태 기록 조회
    where: {
      userId,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  if (!prevTarget) return; // 이전 상태가 없으면(닫을 기록이 없음) 종료

  // 이전 target이 4(기타), -1(자리 비움) 둘 다 아니면(책, 핸드폰, PC 같은 focusTarget 상태라면)
  if (prevTarget.targetId !== BigInt(4) && prevTarget.targetId !== BigInt(-1)) {
    await closeEnabledOrDisabledMeasurement(userId, currentTimestamp); 
    // enabled 혹은 disabled 기록 중 최근 것 종료
    return;
  }

  if (prevTarget.targetId === BigInt(-1)) { // 이전 상태가 자리 비움이면
    await closeEmptyMeasurement(userId, prevTarget.timestamp, currentTimestamp);
    // 해당 기록 종료 시간 업데이트
    return;
  }

  // 위 조건들에 해당되지 않으면 offlineTimeTable 기록 종료 (targetId === 4)
  await closeOfflineMeasurement(userId, prevTarget.timestamp, currentTimestamp);
}

// 초기 payload 처리 함수
async function handleInitialPayload(payload: StatePayload, groupId: string) {
  const focusTarget = await prisma.focusTarget.findFirst({
    where: {
      userId: BigInt(payload.userId),
    },
    select: {
      id: true,
    },
  });

  if (focusTarget) { // focusTarget이 없으면
    startTimer(String(payload.userId), groupId, new Date(payload.timestamp)); // 타이머 시작
  }
}

// 현재 target에 따라 타이머 시작/정지 함수
// - targetId가 허용 동작인지 판단해서 타이머를 시작 혹은 정지함
async function updateTimerByCurrentTarget(
  payload: StatePayload,
  groupId: string,
) {
  if (payload.targetId === '4' || payload.targetId === '-1') { // 현재 target이 기타 또는 자리 비움이면
    stopTimer(String(payload.userId), groupId); // 타이머 정지
    return;
  }

  // 현재 target이 허용된 집중 대상인지 status 조회 (캐시가 있으면 DB를 안 보고 캐시 사용)
  const focusTargetStatus = await getFocusTargetStatus(
    String(payload.userId),
    payload.targetId,
  );

  // status가 0이거나 focusTarget 자체가 없으면 비허용으로 판단
  if (focusTargetStatus === 0 || focusTargetStatus === null) {
    stopTimer(String(payload.userId), groupId); // 타이머 정지
    return;
  }

  // 허용 동작이면 타이머 시작
  startTimer(String(payload.userId), groupId, new Date(payload.timestamp));
}

type FocusTargetState = {
  userId: string;
  targetId: string;
  timestamp: Date;
  // groupId: string[];  
  isInitial: boolean;
};

// 현재 상태 저장 함수
async function saveCurrentState(payload: StatePayload) {
  const timestamp = new Date(payload.timestamp);
  
  await prisma.statusTimeTable.create({ // statusTimeTable에 새 상태 기록 생성
    data: {
      userId: BigInt(payload.userId),
      timestamp,
      targetId: BigInt(payload.targetId),
    },
  });

  await saveFocusTargetState({
    userId: String(payload.userId),
    targetId: String(payload.targetId),
    timestamp,
    isInitial: payload.isInitial ?? false,
  }); 
  // 현재 focusTarget 상태를 별도 repository 함수를 통해 저장/갱신
}

// MQTT 상태 메시지 처리 메인 함수
// - MQTT로 메시지가 들어오면 실제 비지니스 로직을 처리
async function handleStateMessage(topic: string, message: Buffer) {
  // state/group/으로 시작하는 topic이 아니면 무시
  if (!topic.startsWith('state/group/')) return;

  const payload = normalizePayload(JSON.parse(message.toString())); // MQTT를 형태 변환 후 userId/targetId 타입 정리
  const groupId = parseGroupId(topic); // topic에서 groupId 추출

  console.log('라즈베리파이로부터 수신한 데이터:', payload);
  console.log('파싱한 groupId:', groupId);

  if (payload.isInitial) { // 초기 데이터라면
    console.log('초기 데이터');
    await handleInitialPayload(payload, groupId); // 초기 데이터 처리
  } else {
    console.log('이후 데이터');
    await closePreviousMeasurement(payload); // 이전 상태 기록의 종료 시간 업데이트
  }

  await updateTimerByCurrentTarget(payload, groupId); // 현재 상태에 따라 타이머 시작 혹은 중지
  await saveCurrentState(payload); // 현재 상태를 DB에 저장

  sendStateToClients(groupId, payload); // 그룹 클라이언트들에게 현재 상태를 웹소켓으로 전송
}

// MQTT 연결
mqttClient.on('connect', () => { // MQTT 브로커 연결 성공 시 실행
  console.log('mqtt 연결 성공');
  
  // 라즈베리파이로부터의 상태 데이터 구독
  mqttClient.subscribe('state/group/+', err => { // 그룹 토픽 구독
    if (err) console.error('mqtt 구독 실패', err);
    else console.log('라즈베리파이 상태 데이터 구독 완료');
  });
});

// MQTT 브로커로부터 메시지 수신 시
mqttClient.on('message', async (topic, message) => { // MQTT 메시지가 도착할 때마다 실행
  try {
    await handleStateMessage(topic, message); // 실제 메시지 처리
  } catch(err) {
    console.error('메시지 처리 실패', err);
  }
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
// - 사용자가 로그인했을 때 해당 사용자가 속한 그룹 ID 목록을 MQTT로 publish
export async function publishGroupIdList(userId: bigint) {
  const groupIdList = await prisma.userGroup.findMany({ // 해당 사용자가 속한 그룹 목록 조회
    where: {userId: userId},
    select: {groupId: true},
  });

  const payload = 
    groupIdList.map(group => group.groupId.toString());
    // 조회된 groupId들을 문자열 배열로 변환

  console.log('로그인 시 그룹 ID 목록 전송:', payload);
  
  const publish = () => { // MQTT publish 로직을 함수로 분리 (재사용성을 높이기 위해)
    mqttClient.publish(`init/${userId}`, JSON.stringify(payload), err => { // 그룹 ID 목록을 publish
      if (err) {
        console.error('MQTT publish 실패:', err);
      } else {
        console.log('MQTT groupIdList 전송 완료:', payload);
      }
    });
  }

  if (mqttClient.connected) { // MQTT가 이미 연결된 상태라면
    publish(); // publish 실행
  } else {
    mqttClient.once('connect', publish); // 연결이 되는 순간 딱 한 번 publish 실행
    // once - 이벤트 한 번 실행 후 자동으로 제거
  }
}
