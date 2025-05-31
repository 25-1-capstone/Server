import {responseFromGroup, responseFromGroupList} from 'src/dtos/group.dto.js';
import {
  GroupCreationError,
  GroupJoinDuplicateError,
  GroupNotFoundError,
  GroupJoinError,
} from 'src/error.js';
import {
  BodyToGroup,
  GroupListResponse,
  GroupResponse,
  GroupUserResponse,
} from 'src/models/group.model.js';
import {
  createGroup,
  getGroup,
  getGroupList,
  getGroupUser,
  joinGroup,
} from 'src/repositories/group.repository.js';

export const groupCreate = async (
  hostId: bigint,
  body: BodyToGroup,
): Promise<GroupResponse> => {
  const createdGroupId = await createGroup(body, hostId);
  const group = await getGroup(createdGroupId);
  if (group === null) {
    throw new GroupCreationError({
      groupId: createdGroupId,
    });
  }
  return responseFromGroup(group);
};

export const groupGet = async (groupId: bigint): Promise<GroupResponse> => {
  const group = await getGroup(groupId);
  if (group === null) {
    throw new GroupNotFoundError({
      groupId: groupId,
    });
  }
  return responseFromGroup(group);
};

export const groupListGet = async (
  userId: bigint,
): Promise<GroupListResponse> => {
  const groupList = await getGroupList(userId);
  return responseFromGroupList(groupList);
};

export const groupJoin = async (
  groupId: bigint,
  userId: bigint,
): Promise<GroupUserResponse> => {
  const groupUserId = await joinGroup(groupId, userId);
  if (groupUserId === null) {
    throw new GroupJoinDuplicateError({
      groupId: groupId,
      userId: userId,
    });
  }
  const groupUser = await getGroupUser(groupUserId);
  if (groupUser === null) {
    throw new GroupJoinError({
      groupId: groupId,
      userId: userId,
    });
  }
  return groupUser;
};
