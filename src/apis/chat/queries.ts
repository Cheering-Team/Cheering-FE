export const chatRoomKeys = {
  all: ['chatRooms'] as const,
  lists: () => [...chatRoomKeys.all, 'list'] as const,
  list: (playerId: number) => [...chatRoomKeys.lists(), {playerId}] as const,
};
