import {
  BodyToSchedule,
  ScheduleResponse,
  WeeklyScheduleResponse,
} from 'src/models/schedule.model.js';
import {prisma} from '../db.config.js';

export const createSchedule = async (
  data: BodyToSchedule,
  userId: bigint,
): Promise<bigint | null> => {
  const checkOverlapping = await prisma.schedule.findFirst({
    where: {
      userId: userId,
      AND: [{startDate: {lt: data.endDate}}, {endDate: {gt: data.startDate}}],
    },
  });
  if (checkOverlapping) {
    return null;
  }
  const createdSchedule = await prisma.schedule.create({
    data: {
      title: data.title,
      userId,
      startDate: data.startDate,
      endDate: data.endDate,
      repeatType: data.repeatType,
      notification: data.notification,
      description: data.description,
    },
  });

  return createdSchedule.id;
};

export const getSchedule = async (
  scheduleId: bigint,
): Promise<ScheduleResponse | null> => {
  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
    },
    select: {
      id: true,
      title: true,
      userId: true,
      description: true,
      startDate: true,
      endDate: true,
      repeatType: true,
      notification: true,
    },
  });

  if (schedule === null) {
    return null;
  }

  const formattedSchedule = {
    ...schedule,
    id: schedule.id.toString(),
    userId: schedule.userId.toString(),
  };

  return formattedSchedule;
};

export const getWeeklySchedule = async (
  userId: bigint,
): Promise<WeeklyScheduleResponse> => {
  const todayDate = new Date();
  const day = todayDate.getDay(); // 0(일) ~ 6(토)
  const startDate = new Date(todayDate);
  startDate.setDate(todayDate.getDate() - day); // 0(일)
  startDate.setHours(0, 0, 0, 0);
  console.log(startDate.toISOString());
  const endDate = new Date(startDate); // 0(일)
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  console.log(endDate.toISOString());

  const schedules = await prisma.schedule.findMany({
    where: {
      userId: userId,
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      startDate: 'asc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
    },
  });

  if (schedules.length !== 0) {
    console.log('해당 기간에 일정이 있음', schedules.length);
  }

  //   const formattedSchedules = {
  //     schedules: schedules.map(schedule => ({
  //       ...schedule,
  //       id: schedule.id.toString(),
  //     })),
  //   };

  const formattedSchedules = schedules.map(schedule => ({
    ...schedule,
    id: schedule.id.toString(),
  }));
  const weeklySchedule: WeeklyScheduleResponse['schedules'] = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
  };

  for (const sche of formattedSchedules) {
    const scheduleDate = new Date(sche.startDate);
    const day = scheduleDate
      .getDay()
      .toString() as keyof WeeklyScheduleResponse['schedules'];
    console.log(day);
    weeklySchedule[day].push(sche);
  }
  const formattedWeeklySchedules = {
    userId: userId.toString(),
    schedules: weeklySchedule,
  };

  console.log(formattedWeeklySchedules);

  return formattedWeeklySchedules;
};
