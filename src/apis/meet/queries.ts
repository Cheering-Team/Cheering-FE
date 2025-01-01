export const meetKeys = {
  all: ['meets'] as const,
  lists: () => [...meetKeys.all, 'list'] as const,
  list: (communityId: number) => [...meetKeys.lists(), {communityId}] as const,
  details: () => [...meetKeys.all, 'detail'] as const,
  detail: (meetId: number) => [...meetKeys.details(), meetId] as const,
};
