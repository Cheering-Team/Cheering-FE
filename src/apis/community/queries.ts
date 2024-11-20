export const communityKeys = {
  all: ['communities'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  listBySearch: (teamId: number | null, name: string) =>
    [...communityKeys.lists(), {teamId, name}] as const,
  listByMy: () => [...communityKeys.lists(), 'my'] as const,
  popularList: () => [...communityKeys.lists(), 'popular'] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  detail: (communityId: number) =>
    [...communityKeys.details(), communityId] as const,
  detailRandom: () => [...communityKeys.details(), 'random'] as const,
};
