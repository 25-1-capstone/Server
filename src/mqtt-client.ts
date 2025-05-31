import mqtt from 'mqtt';

export const mqttClient = mqtt.connect('mqtt://localhost:1883', {
  // MOTT 브로커에 연결
  username: '',
  password: '',
  clientId: `client_${Math.random().toString(16).substr(2, 8)}`,
});

mqttClient.on('connect', () => {
  // 연결 성공 시
  console.log('mqtt 연결 성공');
  mqttClient.subscribe('state/+', err => {
    // topic 구독
    if (err) console.error('mqtt 구독 실패', err);
    else console.log('그룹 topic 구독 완료');
  });
});

mqttClient.on('error', error => {
  console.error('mqtt 에러', error);
});
