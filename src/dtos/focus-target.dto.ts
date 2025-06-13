import {
  DailyStatisticsResponse,
  FocusTargetListResponse,
  FocusTargetResponse,
} from 'src/models/focus-target.model.js';

export const responseFromFocusTarget = ({
  id,
  target,
  userId,
  status,
}: FocusTargetResponse): FocusTargetResponse => {
  return {
    id,
    target,
    userId,
    status,
  };
};

export const responseFromFocusTargetList = ({
  targets,
}: FocusTargetListResponse): FocusTargetListResponse => {
  return {
    targets: targets.map(target => ({
      id: target.id,
      target: target.target,
      userId: target.userId,
      status: target.status,
    })),
  };
};

export const responseFromDailyStatistics = ({
  dailyTotalTime,
  today,
}: DailyStatisticsResponse): DailyStatisticsResponse => {
  return {
    dailyTotalTime: dailyTotalTime,
    today: {
      disabledTarget: today.disabledTarget.map(target => ({
        targetId: target.targetId,
        startTime: target.startTime,
        endTime: target.endTime,
        target: target.target,
      })),
      enabledTarget: today.enabledTarget.map(target => ({
        targetId: target.targetId,
        startTime: target.startTime,
        endTime: target.endTime,
        target: target.target,
      })),
    },
  };
};
