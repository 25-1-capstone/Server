import mqtt from 'mqtt';
import {saveFocusTargetState} from './repositories/focus-target.repository.js';
import {prisma} from './db.config.js';

type TimerInfo = {
  startedAt: Date;
  interval: NodeJS.Timeout;
};
const timers = new Map<string, TimerInfo>(); // userId → 타이머 ID

console.log('MQTT 연결 시도 중...');
export const mqttClient = mqtt.connect('mqtt://localhost:1883', {
  // localhost:1883
  // MOTT 브로커에 연결
  username: '',
  password: '',
  clientId: `client_${Math.random().toString(16).substr(2, 8)}`,
});

// MQTT 연결
mqttClient.on('connect', () => {
  // 연결 성공 시
  console.log('mqtt 연결 성공');
  mqttClient.subscribe('state/user+', err => {
    // topic 구독
    if (err) console.error('mqtt 구독 실패', err);
    else console.log('그룹 topic 구독 완료');
  });

  // MQTT 브로커로부터 메시지 수신 시
  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString()); // message - 실제 데이터 메시지 (buffer 형태)
      console.log('수신 데이터:', payload);
      const userId = topic.match(/^state\/user(\d+)$/);
      if (userId === null) {
        throw new Error('userId 파싱 실패');
      }

      console.log('payload:', payload);

      const prev = timers.get(userId[1]);

      if (!prev) {
        // 타이머가 아직 없는 경우 → 최초 메시지
        timers.set(userId[1], {
          startedAt: payload.timestamp,
          interval: setInterval(() => {}, 1000), // 향후 확장 가능
        });
        console.log(
          `타이머 시작: [user${userId}] ${payload.timestamp.toISOString()}`,
        );
        return;
      }

      let state = {
        ...payload,
      };
      const startedAt = timers.get(userId[1]);
      if (payload.isInitial !== null && startedAt) {
        state = {
          ...payload,
          isInitial: startedAt,
        };
      } else {
        state = {
          ...payload,
          isInitial: startedAt,
        };
      }
      console.log(`[user${userId}] 상태 저장 완료: ${state}`);

      await saveFocusTargetState(BigInt(userId[1]), state); // DB에 저장
      // sendStateToClients(state); // WebSocket을 통해 연결된 모든 client에게 해당 상태를 브로드캐스트
      timers.set(userId[1], {
        startedAt: payload.timestamp,
        interval: prev.interval,
      });
    } catch (err) {
      console.error('메시지 처리 실패', err);
    }
  });
});

export async function publishGroupIdList(userId: bigint) {
  const groupIdList = await prisma.userGroup.findMany({
    where: {userId: userId},
    select: {groupId: true},
  });
  const payload = {
    groupIdList: groupIdList.map(groupId => groupId.toString()),
  };
  console.log('groupIdList in mqtt:', payload);
  if (mqttClient.connected) {
    mqttClient.publish('init/caps1', JSON.stringify(payload), err => {
      if (err) {
        console.error('MQTT publish 실패:', err);
      } else {
        console.log('MQTT groupIdList 전송 완료:', payload);
      }
    });
  } else {
    mqttClient.once('connect', () => {
      mqttClient.publish('user/connect', JSON.stringify(payload), err => {
        if (err) {
          console.error('MQTT publish 실패:', err);
        } else {
          console.log('MQTT groupIdList 전송 완료:', payload);
        }
      });
    });
  }
}

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
