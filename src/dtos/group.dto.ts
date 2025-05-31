import {
  BodyToGroup,
  GroupListResponse,
  GroupRequest,
  GroupResponse,
} from 'src/models/group.model.js';

export const responseFromGroup = ({
  id,
  hostId,
  name,
  description,
}: GroupResponse): GroupResponse => {
  return {
    id,
    hostId,
    name,
    description,
  };
};

export const responseFromGroupList = ({
  groups,
}: GroupListResponse): GroupListResponse => {
  return {
    groups: groups.map(grp => ({
      id: grp.id,
      name: grp.name,
      memberCount: grp.memberCount,
    })),
  };
};

export const bodyToGroup = ({name, description}: BodyToGroup): GroupRequest => {
  return {
    name,
    description,
  };
};
