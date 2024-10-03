export const chatRoomKeys = {
  all: ['chatRooms'] as const,
  lists: () => [...chatRoomKeys.all, 'list'] as const,
  list: (playerId: number) => [...chatRoomKeys.lists(), {playerId}] as const,
  my: () => [...chatRoomKeys.lists(), 'my'] as const,
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
};
