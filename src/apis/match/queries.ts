export const matchKeys = {
  all: ['matches'] as const,
  lists: () => [...matchKeys.all, 'list'] as const,
  list: (communityId: number) => [...matchKeys.lists(), {communityId}] as const,
  details: () => [...matchKeys.all, 'detail'] as const,
  detail: (matchId: number | null) =>
    [...matchKeys.details(), matchId] as const,
};
