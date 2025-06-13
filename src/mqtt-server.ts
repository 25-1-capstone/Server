import {mqttClient} from './mqtt-client.js';
// import {saveFocusTargetState} from './repositories/focus-target.repository.js';
// import {sendStateToClients} from './websocket-server.js';

mqttClient.on('message', async (topic, message) => {
  // MQTT 브로커로부터 메시지 수신 시 콜백 실행
  try {
    console.log('topic:', topic);
    console.log('message:', message);
    const payload = JSON.parse(message.toString()); // message - 실제 데이터 메시지 (buffer 형태)
    const state = {
      targetId: payload.targetId,
      userId: payload.userId,
      timestamp: payload.timestamp,
      isInitial: payload.isInitial,
    };
    console.log('수신 데이터:', state);
    // await saveFocusTargetState(state); // DB에 저장
    // sendStateToClients(state); // WebSocket을 통해 연결된 모든 client에게 해당 상태를 브로드캐스트
  } catch (err) {
    console.error('메시지 처리 실패', err);
  }
});
