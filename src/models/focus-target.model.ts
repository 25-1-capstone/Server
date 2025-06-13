export interface FocusTargetResponse {
  id: string;
  target: string;
  userId: string;
  status: number;
}

export interface FocusTargetState {
  targetId: string;
  groupId: string[];
  timestamp: Date;
  isInitial: Date;
}

export interface FocusTargetListResponse {
  targets: {
    id: string;
    target: string;
    userId: string;
    status: number;
  }[];
}

export interface DailyStatisticsResponse {
  dailyTotalTime: {
    '0': number;
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
  };
  today: {
    disabledTarget: {
      target: string;
      targetId: string;
      startTime: Date;
      endTime: Date;
    }[];
    enabledTarget: {
      target: string;
      targetId: string;
      startTime: Date;
      endTime: Date;
    }[];
  };
}
