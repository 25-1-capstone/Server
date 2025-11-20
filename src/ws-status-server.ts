import express, {Express} from 'express';
import {createServer} from 'http';
import {Server as SocketIOServer, Socket} from 'socket.io';

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {origin: '*'},
});

let timer = 0;
const status = '게임중';

// 1초마다 타이머 값 증가 및 브로드캐스트
setInterval(() => {
  timer += 1;
  io.emit('timer', {status, timer});
}, 1000);

io.on('connection', (socket: Socket) => {
  // 클라이언트가 새로 접속하면 현재 상태 전송
  socket.emit('timer', {status, timer});
});

const PORT = 3000; // REST와 웹소켓 모두 3000번 포트에서 운영
httpServer.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 REST와 WebSocket을 함께 운영 중`);
});