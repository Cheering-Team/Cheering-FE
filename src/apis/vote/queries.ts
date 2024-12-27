export const voteKeys = {
  all: ['votes'] as const,
  details: () => [...voteKeys.all, 'detail'] as const,
  detail: (voteId: number | null | undefined) =>
    [...voteKeys.details(), voteId] as const,
  hot: (communityId: number) => [...voteKeys.details(), {communityId}] as const,
};
