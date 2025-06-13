import {prisma} from 'src/db.config.js';
import {
  DailyStatisticsResponse,
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
  userId: bigint,
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
      userId: BigInt(userId),
    },
  });

  if (checkFocusTargetState === null) {
    return null;
  }

  if (checkFocusTargetState.status === 1) {
    await prisma.enabledFocusTargetTimeTable.create({
      data: {
        measurementStartAt: new Date(data.isInitial),
        measurementEndAt: new Date(data.timestamp),
        focusTargetId: checkFocusTargetState.id,
      },
    });
  } else {
    await prisma.disabledFocusTargetTimeTable.create({
      data: {
        measurementStartAt: new Date(data.isInitial),
        measurementEndAt: new Date(data.timestamp),
        focusTargetId: checkFocusTargetState.id,
      },
    });
  }

  //if (data.isInitial) {
  // if (checkFocusTargetState.status === 1) {
  //   await prisma.enabledFocusTargetTimeTable.create({
  //     data: {
  //       measurementStartAt: new Date(data.isInitial),
  //       measurementEndAt: new Date(data.timestamp),
  //       focusTargetId: checkFocusTargetState.id,
  //     },
  //   });
  // } else {
  //   await prisma.disabledFocusTargetTimeTable.create({
  //     data: {
  //       measurementStartAt: new Date(data.isInitial),
  //       measurementEndAt: new Date(data.timestamp),
  //       focusTargetId: checkFocusTargetState.id,
  //     },
  //   });
  // }
  //} else {
  //   const latestOffline = await prisma.offlineTimeTable.findFirst({
  //     orderBy: {
  //       measurementEndAt: 'desc',
  //     },
  //   });
  //   const latestEmpty = await prisma.emptyTimeTable.findFirst({
  //     orderBy: {
  //       measurementEndAt: 'desc',
  //     },
  //   });
  //   const latestEnableTarget =
  //     await prisma.enabledFocusTargetTimeTable.findFirst({
  //       orderBy: {
  //         measurementEndAt: 'desc',
  //       },
  //     });
  //   const latestDisableTarget =
  //     await prisma.disabledFocusTargetTimeTable.findFirst({
  //       orderBy: {
  //         measurementEndAt: 'desc',
  //       },
  //     });
  //   const t1 = latestOffline?.measurementEndAt;
  //   const t2 = latestEmpty?.measurementEndAt;
  //   const t3 = latestEnableTarget?.measurementEndAt;
  //   const t4 = latestDisableTarget?.measurementEndAt;
  //   const latestTimes = [t1, t2, t3, t4]
  //     .filter(Boolean)
  //     .reduce((a, b) => (a! > b! ? a : b));
  //   if (checkFocusTargetState.status === 1) {
  //     await prisma.enabledFocusTargetTimeTable.create({
  //       data: {
  //         measurementStartAt: new Date(latestTimes!),
  //         measurementEndAt: new Date(data.timestamp),
  //         focusTargetId: checkFocusTargetState.id,
  //       },
  //     });
  //   } else {
  //     await prisma.disabledFocusTargetTimeTable.create({
  //       data: {
  //         measurementStartAt: new Date(latestTimes!),
  //         measurementEndAt: new Date(data.timestamp),
  //         focusTargetId: checkFocusTargetState.id,
  //       },
  //     });
  //   }
  // }
}

export async function getDailyStatistics(
  userId: bigint,
): Promise<DailyStatisticsResponse> {
  const todayDate = new Date();
  const day = todayDate.getDay(); // 0(일) ~ 6(토)
  const startDate = new Date(todayDate);
  startDate.setDate(todayDate.getDate() - day); // 0(일)
  startDate.setHours(0, 0, 0, 0);
  //onsole.log(startDate.toISOString());
  const endDate = new Date(startDate); // 0(일)
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  //console.log(endDate.toISOString());

  const dailyStatistics: DailyStatisticsResponse['dailyTotalTime'] = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
  };

  const enabledFocusTargets = await prisma.enabledFocusTargetTimeTable.findMany(
    {
      where: {
        focusTarget: {userId},
        measurementStartAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    },
  );

  for (const target of enabledFocusTargets) {
    const start = target.measurementStartAt;
    const end = target.measurementEndAt;
    const minutes = (end.getTime() - start.getTime()) / 60000;
    const day = getKSTDay(start); // 한국 시간 기준 요일로 보정
    dailyStatistics[day] += minutes;
  }

  const disabledFocusTargets =
    await prisma.disabledFocusTargetTimeTable.findMany({
      where: {
        focusTarget: {userId},
        measurementStartAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

  for (const target of disabledFocusTargets) {
    const start = target.measurementStartAt;
    const end = target.measurementEndAt;
    const minutes = (end.getTime() - start.getTime()) / 60000;
    const day = getKSTDay(start); // 한국 시간 기준 요일로 보정
    dailyStatistics[day] += minutes;
  }
  const todayStart = new Date(todayDate);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayDate);
  todayEnd.setHours(23, 59, 59, 999);

  const enabledFocusTargetList =
    await prisma.enabledFocusTargetTimeTable.findMany({
      where: {
        focusTarget: {userId},
        measurementStartAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      include: {
        focusTarget: {
          select: {target: true},
        },
      },
    });

  const formattedEnabledFocusTargetList = enabledFocusTargetList.map(
    enabledFocusTarget => ({
      targetId: enabledFocusTarget.focusTargetId!.toString(),
      target: enabledFocusTarget.focusTarget!.target,
      startTime: enabledFocusTarget.measurementStartAt,
      endTime: enabledFocusTarget.measurementEndAt,
    }),
  );

  const disabledFocusTargetList =
    await prisma.disabledFocusTargetTimeTable.findMany({
      where: {
        focusTarget: {userId},
        measurementStartAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      include: {
        focusTarget: {
          select: {target: true},
        },
      },
    });

  const formattedDisabledFocusTargetList = disabledFocusTargetList.map(
    disabledFocusTarget => ({
      targetId: disabledFocusTarget.focusTargetId!.toString(),
      target: disabledFocusTarget.focusTarget!.target,
      startTime: disabledFocusTarget.measurementStartAt,
      endTime: disabledFocusTarget.measurementEndAt,
    }),
  );

  const formattedDailyStatistics = {
    dailyTotalTime: dailyStatistics,
    today: {
      disabledTarget: formattedDisabledFocusTargetList,
      enabledTarget: formattedEnabledFocusTargetList,
    },
  };

  return formattedDailyStatistics;
}

function getKSTDay(
  date: Date,
): keyof DailyStatisticsResponse['dailyTotalTime'] {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const localDate = new Date(date.getTime() + KST_OFFSET);
  return localDate
    .getDay()
    .toString() as keyof DailyStatisticsResponse['dailyTotalTime'];
}
