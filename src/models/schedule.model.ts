export interface BodyToSchedule {
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  repeatType: string;
  notification: number;
}

export interface ScheduleResponse {
  id: string;
  title: string;
  userId: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  repeatType: string;
  notification: number;
}

export interface ScheduleRequest {
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  repeatType: string;
  notification: number;
}

export interface WeeklyScheduleResponse {
  userId: string;
  schedules: {
    '0': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
    '1': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
    '2': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
    '3': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
    '4': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
    '5': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
    '6': {
      id: string;
      title: string;
      description: string | null;
      startDate: Date;
      endDate: Date;
    }[];
  };
}
