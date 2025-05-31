import {
  responseFromFocusTarget,
  responseFromFocusTargetList,
} from 'src/dtos/focus-target.dto.js';
import {FocusTargetEnableError} from 'src/error.js';
import {
  FocusTargetListResponse,
  FocusTargetResponse,
} from 'src/models/focus-target.model.js';
import {
  allowFocusTarget,
  getFocusTargetList,
  notAllowFocusTarget,
} from 'src/repositories/focus-target.repository.js';

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
