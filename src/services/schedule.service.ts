import {
  responseFromSchedule,
  responseFromWeeklySchedule,
} from 'src/dtos/schedule.dto.js';
import {
  ScheduleCreationError,
  ScheduleDateError,
  ScheduleNotFoudError,
  ScheduleOverlappingError,
} from 'src/error.js';
import {
  BodyToSchedule,
  ScheduleResponse,
  WeeklyScheduleResponse,
} from 'src/models/schedule.model.js';
import {
  createSchedule,
  getSchedule,
  getWeeklySchedule,
} from 'src/repositories/schedule.repository.js';

export const scheduleCreate = async (
  userId: bigint,
  body: BodyToSchedule,
): Promise<ScheduleResponse> => {
  const createdScheduleId = await createSchedule(body, userId);
  const startDate = body.startDate;
  const endDate = body.endDate;
  if (endDate <= startDate) {
    throw new ScheduleDateError({
      startDate: startDate,
      endDate: endDate,
    });
  }
  if (createdScheduleId === null) {
    throw new ScheduleOverlappingError({
      startDate: startDate,
      endDate: endDate,
    });
  }
  const schedule = await getSchedule(createdScheduleId);
  if (schedule === null) {
    throw new ScheduleCreationError({
      scheduleId: createdScheduleId,
    });
  }
  return responseFromSchedule(schedule);
};

export const scheduleGet = async (
  scheduleId: bigint,
): Promise<ScheduleResponse> => {
  const schedule = await getSchedule(scheduleId);
  if (schedule === null) {
    throw new ScheduleNotFoudError({
      scheduleId: scheduleId,
    });
  }
  return responseFromSchedule(schedule);
};

export const weeklyScheduleGet = async (
  userId: bigint,
): Promise<WeeklyScheduleResponse> => {
  const weeklySchedule = await getWeeklySchedule(userId);
  console.log('주간 일정: ', weeklySchedule);
  return responseFromWeeklySchedule(weeklySchedule);
};
