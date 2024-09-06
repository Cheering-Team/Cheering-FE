export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: number) => [...commentKeys.lists(), {postId}] as const,
};

export const reCommentKeys = {
  all: ['reComments'] as const,
  lists: () => [...reCommentKeys.all, 'list'] as const,
  list: (commentId: number | null) =>
    [...reCommentKeys.lists(), {commentId}] as const,
};
