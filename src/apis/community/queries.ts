export const communityKeys = {
  all: ['communities'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  listByTeam: (teamId: number) => [...communityKeys.lists(), {teamId}] as const,
  listBySearch: (name: string) => [...communityKeys.lists(), {name}] as const,
  listByMy: () => [...communityKeys.lists(), 'my'] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  detail: (communityId: number) =>
    [...communityKeys.details(), communityId] as const,
};
