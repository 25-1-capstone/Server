import {WebSocketServer, WebSocket} from 'ws';
import { FocusTargetState } from './models/focus-target.model.js';
import { prisma } from './db.config.js';
import { timers } from './mqtt-client.js';

const wss = new WebSocketServer({port: 8080}); // 포트에서 WebSocket Server 시작
// const clients = new Set<WebSocket>(); // 연결된 모든 client를 Set으로 관리 (중복 연결 방지 및 빠른 삭제를 위함)

interface ClientInfo {
  socket: WebSocket;
  userId: string;
}

interface TimerState {
  isRunning: boolean;
  elapsedTime: number;
  startTime: Date | null;
  userId: string;
}

const clients: ClientInfo[] = [];

// 그룹의 모든 타이머 상태를 조회하는 함수
async function getGroupTimers(groupId: string): Promise<TimerState[]> {
  const groupMembers = await prisma.userGroup.findMany({
    where: {
      groupId: BigInt(groupId)
    },
    select: { userId: true }
  });

  const timerStates: TimerState[] = [];
  
  for (const member of groupMembers) {
    const userId = member.userId.toString();
    const timerInfo = timers.get(userId);
    
    if (timerInfo) {
      const currentTime = new Date();
      const elapsedTime = timerInfo.isRunning 
        ? currentTime.getTime() - timerInfo.lastTimestamp.getTime()
        : 0;

      timerStates.push({
        isRunning: timerInfo.isRunning,
        elapsedTime: elapsedTime,
        startTime: timerInfo.isRunning ? timerInfo.lastTimestamp : null,
        userId: userId
      });
    }
  }

  return timerStates;
}

// 그룹 참여 시 기존 타이머 상태 전송
async function sendExistingTimersToNewMember(userId: string, groupId: string) {
  const timerStates = await getGroupTimers(groupId);
  
  const message = JSON.stringify({
    type: 'GROUP_TIMERS_INIT',
    payload: timerStates
  });

  const client = clients.find(c => c.userId === userId);
  if (client && client.socket.readyState === WebSocket.OPEN) {
    client.socket.send(message);
  }
}

wss.on('connection', socket => {
  socket.on('message', async message => {
    const data = JSON.parse(message.toString());
    if (data.type === 'REGISTER' && data.userId) {
      const userId = data.userId.toString();
      clients.push({ socket, userId });
      console.log(`등록된 유저: ${userId}`);

      // 사용자가 속한 모든 그룹의 타이머 상태 전송
      const userGroups = await prisma.userGroup.findMany({
        where: { userId: BigInt(userId) },
        select: { groupId: true }
      });

      for (const group of userGroups) {
        await sendExistingTimersToNewMember(userId, group.groupId.toString());
      }
    }
  });

  socket.on('close', () => {
    const idx = clients.findIndex(c => c.socket === socket);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

// 같은 그룹원들의 status를 그룹원들에게 보내기기 
export async function sendStateToClients(groupId: string, payload: FocusTargetState,
) {

  // 그룹원들의 데이터 추출
  const groupUserDatas = await prisma.userGroup.findMany({
    where: {
      groupId: BigInt(groupId)
    },
    select: { userId: true }
  });

  // 그룹원들의 유저 ID 추출 (데이터를 보낼 클라이언트)
  const groupUsers = groupUserDatas.map((m) => m.userId);

  // 그룹원들의 이름 추출 
  const groupUserStates = await prisma.statusTimeTable.findMany({
    where: {
      userId: {
        in: groupUsers,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  // 그룹원들에게 보낼 데이터 포맷
  const formattedGroupUserStates = groupUserStates.map(userState => ({
    status: userState.targetId,
    userId: userState.userId,
    userName: userState.user?.name
  }));

  // 'GROUP_USER_STATES'라는 식별자로 데이터 전송 
  const message = JSON.stringify({
    type: 'GROUP_USER_STATES',
    payload: formattedGroupUserStates,
  });
  for (const client of clients) {
    // 모든 연결된 클라이언트에게 전송
    if (
      // groupUsers에 포함된 클라이언트에게만 전송
      groupUsers.includes(BigInt(client.userId)) &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(message);
    }
  }

  // 내 상태 메시지를 나에게 보내기
  const selfState = formattedGroupUserStates.find(
    s => s.userId.toString() === payload.userId.toString()
  );
  
  if (selfState) {
    const selfMessage = JSON.stringify({
      type: 'SELF_STATE',
      payload: selfState,
    });
  
    for (const client of clients) {
      if (
        client.userId === payload.userId.toString() &&
        client.socket.readyState === WebSocket.OPEN
      ) {
        client.socket.send(selfMessage);
        break; // 본인한테만 보내면 되니까 break
      }
    }
  }
}

// 타이머 상태를 그룹의 모든 클라이언트에게 전송
export async function sendTimerToGroup(groupId: string, userId: string, timerState: TimerState) {
  // 그룹 멤버 조회
  const groupMembers = await prisma.userGroup.findMany({
    where: {
      groupId: BigInt(groupId)
    },
    select: { userId: true }
  });

  const message = JSON.stringify({
    type: 'GROUP_TIMER_STATE',
    payload: {
      ...timerState,
      userId: userId
    }
  });

  // 그룹의 모든 멤버에게 타이머 상태 전송
  for (const client of clients) {
    if (
      groupMembers.some(member => member.userId.toString() === client.userId) &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(message);
    }
  }
}

// 개인 타이머 상태 전송
export function sendTimerToClient(userId: string, timerState: TimerState) {
  const message = JSON.stringify({
    type: 'TIMER_STATE',
    payload: {
      ...timerState,
      userId: userId
    }
  });

  for (const client of clients) {
    if (
      client.userId === userId &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(message);
      break;
    }
  }
}
