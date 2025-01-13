export const chatRoomKeys = {
  all: ['chatRooms'] as const,
  lists: () => [...chatRoomKeys.all, 'list'] as const,
  list: (
    communityId: number,
    type: 'OFFICIAL' | 'PUBLIC',
    sortBy: 'participants' | 'createdAt',
    name: string,
  ) => [...chatRoomKeys.lists(), {communityId, type, sortBy, name}] as const,
  my: (type: 'OFFICIAL' | 'PUBLIC') =>
    [...chatRoomKeys.lists(), 'my', {type}] as const,
  listByMeet: (meetId: number) =>
    [...chatRoomKeys.lists(), {type: 'PRIVATE', meetId}] as const,
  details: () => [...chatRoomKeys.all, 'detail'] as const,
  detail: (chatRoomId: number) =>
    [...chatRoomKeys.details(), chatRoomId] as const,
  participants: (chatRoomId: number) =>
    [...chatRoomKeys.all, 'participants', {chatRoomId}] as const,
};

export const chatKeys = {
  all: ['chats'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: (chatRoomId: number) => [...chatKeys.lists(), {chatRoomId}] as const,
  isUnread: () => [...chatKeys.all, 'isUnread'] as const,
};
