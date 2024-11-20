export const cheerKeys = {
  all: ['cheers'] as const,
  lists: () => [...cheerKeys.all, 'list'] as const,
  list: (matchId: number, communityId: number) =>
    [...cheerKeys.lists(), {matchId, communityId}] as const,
};
