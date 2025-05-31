import {
  BodyToSchedule,
  ScheduleRequest,
  ScheduleResponse,
  WeeklyScheduleResponse,
} from 'src/models/schedule.model.js';

export const responseFromSchedule = ({
  id,
  title,
  userId,
  description,
  startDate,
  endDate,
  repeatType,
  notification,
}: ScheduleResponse): ScheduleResponse => {
  return {
    id,
    title,
    userId,
    description,
    startDate,
    endDate,
    repeatType,
    notification,
  };
};

export const bodyToSchedule = ({
  title,
  description,
  startDate,
  endDate,
  repeatType,
  notification,
}: BodyToSchedule): ScheduleRequest => {
  return {
    title,
    description,
    startDate,
    endDate,
    repeatType,
    notification,
  };
};

export const responseFromWeeklySchedule = ({
  userId,
  schedules,
}: WeeklyScheduleResponse): WeeklyScheduleResponse => {
  return {
    userId,
    schedules: {
      '0': schedules[0].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
      '1': schedules[1].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
      '2': schedules[2].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
      '3': schedules[3].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
      '4': schedules[4].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
      '5': schedules[5].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
      '6': schedules[6].map(sche => ({
        id: sche.id,
        title: sche.title,
        startDate: sche.startDate,
        endDate: sche.endDate,
        description: sche.description,
      })),
    },
  };
};
