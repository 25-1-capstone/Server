import {
  responseFromFocusTarget,
  responseFromFocusTargetList,
} from 'src/dtos/focus-target.dto.js';
import {FocusTargetEnableError} from 'src/error.js';
import {
  DailyStatisticsResponse,
  FocusTargetListResponse,
  FocusTargetResponse,
} from 'src/models/focus-target.model.js';
import {
  allowFocusTarget,
  getDailyStatistics,
  getFocusTargetList,
  notAllowFocusTarget,
} from 'src/repositories/focus-target.repository.js';
import {responseFromDailyStatistics} from '../dtos/focus-target.dto.js';

export const FocusTargetUpdateEnable = async (
  focusTargetId: bigint,
): Promise<FocusTargetResponse> => {
  const updatedFocusTarget = await allowFocusTarget(focusTargetId);
  if (updatedFocusTarget === null) {
    throw new FocusTargetEnableError({
      focusTargetId: focusTargetId,
    });
  }
  return responseFromFocusTarget(updatedFocusTarget);
};

export const FocusTargetUpdateDisable = async (
  focusTargetId: bigint,
): Promise<FocusTargetResponse> => {
  const updatedFocusTarget = await notAllowFocusTarget(focusTargetId);
  if (updatedFocusTarget === null) {
    throw new FocusTargetEnableError({
      focusTargetId: focusTargetId,
    });
  }
  return responseFromFocusTarget(updatedFocusTarget);
};

export const FocusTargetListGet = async (
  userId: bigint,
): Promise<FocusTargetListResponse> => {
  const focusTargetList = await getFocusTargetList(userId);
  return responseFromFocusTargetList(focusTargetList);
};

export const DailyStatisticsGet = async (
  userId: bigint,
): Promise<DailyStatisticsResponse> => {
  const dailyStatistics = await getDailyStatistics(userId);
  return responseFromDailyStatistics(dailyStatistics);
};
