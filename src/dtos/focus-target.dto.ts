import {
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
