export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: number | null) => [...commentKeys.lists(), {postId}] as const,
  random: (postId: number) => [...commentKeys.all, 'random', {postId}] as const,
};

export const reCommentKeys = {
  all: ['reComments'] as const,
  lists: () => [...reCommentKeys.all, 'list'] as const,
  list: (commentId: number | null) =>
    [...reCommentKeys.lists(), {commentId}] as const,
};
