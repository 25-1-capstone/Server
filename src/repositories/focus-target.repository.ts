import {prisma} from 'src/db.config.js';
import {
  FocusTargetListResponse,
  FocusTargetResponse,
  FocusTargetState,
} from 'src/models/focus-target.model.js';
//import {State} from 'src/websocket-server.js';

export const allowFocusTarget = async (
  focusTargetId: bigint,
): Promise<FocusTargetResponse | null> => {
  const enableFocustTarget = await prisma.focusTarget.update({
    where: {
      id: focusTargetId,
    },
    data: {
      status: 1,
    },
  });

  const formattedUserFocustTarget = {
    id: enableFocustTarget.id.toString(),
    target: enableFocustTarget.target,
    userId: enableFocustTarget.userId.toString(),
    status: enableFocustTarget.status,
  };

  return formattedUserFocustTarget;
};

export const getFocusTargetStatus = async (
  focusTargetId: bigint,
): Promise<FocusTargetResponse | null> => {
  const userFocusTarget = await prisma.focusTarget.findFirst({
    where: {
      id: focusTargetId,
    },
  });

  if (userFocusTarget === null) {
    return null;
  }

  const formattedUserFocustTarget = {
    id: userFocusTarget.id.toString(),
    target: userFocusTarget.target,
    userId: userFocusTarget.userId.toString(),
    status: userFocusTarget.status,
  };

  return formattedUserFocustTarget;
};

export const notAllowFocusTarget = async (
  focusTargetId: bigint,
): Promise<FocusTargetResponse | null> => {
  const enableFocusTarget = await prisma.focusTarget.update({
    where: {
      id: focusTargetId,
    },
    data: {
      status: 0,
    },
  });

  const formattedUserFocustTarget = {
    id: enableFocusTarget.id.toString(),
    target: enableFocusTarget.target,
    userId: enableFocusTarget.userId.toString(),
    status: enableFocusTarget.status,
  };

  return formattedUserFocustTarget;
};

export const getFocusTargetList = async (
  userId: bigint,
): Promise<FocusTargetListResponse> => {
  const focusTargetList = await prisma.focusTarget.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      target: true,
      userId: true,
      status: true,
    },
  });
  const formattedFocusTargetList = focusTargetList.map(focusTarget => ({
    id: focusTarget.id.toString(),
    target: focusTarget.target,
    userId: focusTarget.userId.toString(),
    status: focusTarget.status,
  }));

  const focusTargetResponse = {
    targets: formattedFocusTargetList,
  };

  return focusTargetResponse;
};

export async function saveFocusTargetState(
  data: FocusTargetState,
): Promise<void | null> {
  const targetMap: Record<string, string> = {
    '1': '핸드폰',
    '2': '책 읽기',
    '3': 'PC 보기',
    '4': '자리 비움',
    '5': '오프라인',
  };
  const checkFocusTargetState = await prisma.focusTarget.findFirst({
    where: {
      target: targetMap[data.targetId],
      userId: BigInt(data.userId),
    },
  });

  if (checkFocusTargetState === null) {
    return null;
  }

  while (data.isInitial > data.timestamp) {
    if (data.isInitial) {
      if (checkFocusTargetState.status === 1) {
        await prisma.enabledFocusTargetTimeTable.create({
          data: {
            measurementStartAt: data.isInitial,
            measurementEndAt: data.timestamp,
            focusTargetId: checkFocusTargetState.id,
          },
        });
      } else {
        await prisma.disabledFocusTargetTimeTable.create({
          data: {
            measurementStartAt: data.isInitial,
            measurementEndAt: data.timestamp,
            focusTargetId: checkFocusTargetState.id,
          },
        });
      }
    } else {
      const latestOffline = await prisma.offlineTimeTable.findFirst({
        orderBy: {
          measurementEndAt: 'desc',
        },
      });
      const latestEmpty = await prisma.emptyTimeTable.findFirst({
        orderBy: {
          measurementEndAt: 'desc',
        },
      });
      const latestEnableTarget =
        await prisma.enabledFocusTargetTimeTable.findFirst({
          orderBy: {
            measurementEndAt: 'desc',
          },
        });
      const latestDisableTarget =
        await prisma.disabledFocusTargetTimeTable.findFirst({
          orderBy: {
            measurementEndAt: 'desc',
          },
        });
      const t1 = latestOffline?.measurementEndAt;
      const t2 = latestEmpty?.measurementEndAt;
      const t3 = latestEnableTarget?.measurementEndAt;
      const t4 = latestDisableTarget?.measurementEndAt;
      const latestTimes = [t1, t2, t3, t4]
        .filter(Boolean)
        .reduce((a, b) => (a! > b! ? a : b));
      if (checkFocusTargetState.status === 1) {
        await prisma.disabledFocusTargetTimeTable.create({
          data: {
            measurementStartAt: latestTimes!,
            measurementEndAt: data.timestamp,
            focusTargetId: checkFocusTargetState.id,
          },
        });
      } else {
        await prisma.disabledFocusTargetTimeTable.create({
          data: {
            measurementStartAt: latestTimes!,
            measurementEndAt: data.timestamp,
            focusTargetId: checkFocusTargetState.id,
          },
        });
      }
    }
  }
}
