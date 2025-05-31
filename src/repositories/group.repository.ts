import {prisma} from '../db.config.js';
import {
  BodyToGroup,
  GroupListResponse,
  GroupUserResponse,
} from 'src/models/group.model.js';
import {GroupResponse} from '../models/group.model.js';

export const createGroup = async (
  data: BodyToGroup,
  hostId: bigint,
): Promise<bigint> => {
  const createdGroup = await prisma.group.create({
    data: {
      name: data.name,
      hostId,
      description: data.description,
    },
  });

  await prisma.userGroup.create({
    data: {
      userId: hostId,
      groupId: createdGroup.id,
    },
  });

  return createdGroup.id;
};

export const getGroup = async (
  groupId: bigint,
): Promise<GroupResponse | null> => {
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
    select: {
      id: true,
      name: true,
      hostId: true,
      description: true,
    },
  });

  if (group === null) {
    return null;
  }

  const formattedGroup = {
    ...group,
    id: group.id.toString(),
    hostId: group.hostId.toString(),
  };

  return formattedGroup;
};

export const getGroupList = async (
  userId: bigint,
): Promise<GroupListResponse> => {
  const groupList = await prisma.userGroup.findMany({
    where: {
      userId: userId,
    },
    select: {
      group: {
        select: {
          id: true,
          name: true,
          userGroups: {
            select: {
              id: true, // 아무거나 하나 선택하면 count용
            },
          },
        },
      },
    },
  });

  const formattedGroupList = groupList.map(({group}) => ({
    id: group.id.toString(),
    name: group.name,
    memberCount: group.userGroups.length,
  }));

  const groupListResponse = {
    groups: formattedGroupList,
  };

  return groupListResponse;
};

export const joinGroup = async (
  groupId: bigint,
  userId: bigint,
): Promise<bigint | null> => {
  const checkGroupUser = await prisma.userGroup.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
    },
  });
  if (checkGroupUser !== null) {
    return null;
  }
  const groupUser = await prisma.userGroup.create({
    data: {
      groupId: groupId,
      userId: userId,
    },
  });

  return groupUser.id;
};

export const getGroupUser = async (
  groupUserId: bigint,
): Promise<GroupUserResponse | null> => {
  const groupUser = await prisma.userGroup.findFirst({
    where: {
      id: groupUserId,
    },
    select: {
      id: true,
      user: true,
      group: true,
    },
  });

  if (groupUser === null) {
    return null;
  }
  const formattedGroupUser = {
    ...groupUser,
    id: groupUser.id.toString(),
    user: {
      id: groupUser.user.id.toString(),
      name: groupUser.user.name,
    },
    group: {
      id: groupUser.group.id.toString(),
      name: groupUser.group.name,
    },
  };

  return formattedGroupUser;
};
