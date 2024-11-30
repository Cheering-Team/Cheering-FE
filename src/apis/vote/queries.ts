export const voteKeys = {
  all: ['votes'] as const,
  details: () => [...voteKeys.all, 'detail'] as const,
  detail: (postId: number) => [...voteKeys.details(), {postId}] as const,
};
