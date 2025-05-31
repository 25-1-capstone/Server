import {WebSocketServer, WebSocket} from 'ws';

export interface State {
  focusTargetId: string;
}

const wss = new WebSocketServer({port: 8080}); // 포트에서 WebSocket Server 시작
const clients = new Set<WebSocket>(); // 연결된 모든 client를 Set으로 관리 (중복 연결 방지 및 빠른 삭제를 위함)

wss.on('connection', socket => {
  // client 연결 시
  console.log('Client 연결 성공');
  clients.add(socket); // clients Set에 추가
  socket.on('message', message => {
    console.log('받은 메시지: ', message.toString());
  });
  socket.on('close', () => {
    // 연결이 끊기면(close) Set에서 삭제
    console.log('Client 연결 종료');
    clients.delete(socket);
  });
});

export function sendStateToClients(state: State) {
  const data = JSON.stringify({type: 'NEW_STATE', payload: state});
  for (const client of clients) {
    // 모든 연결된 client에게 전송
    if (client.readyState === WebSocket.OPEN) {
      // client socket이 열려 있을 때만 전송
      client.send(data);
    }
  }
}
