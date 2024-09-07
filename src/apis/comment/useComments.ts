import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {getComments, getReComments, writeComment, writeReComment} from '.';
import {commentKeys, reCommentKeys} from './queries';
import {postKeys} from '../post/queries';

// 댓글 작성
export const useWriteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: writeComment,
    onSuccess: (_, variables) => {
      const {postId} = variables;
      queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      queryClient.invalidateQueries({queryKey: postKeys.detail(postId)});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 댓글 목록 불러오기
export const useGetComments = (postId: number) => {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: getComments,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
  });
};

// 답글 작성
export const useWriteReComment = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: writeReComment,
    onSuccess: (_, variables) => {
      const {commentId} = variables;
      queryClient.invalidateQueries({queryKey: postKeys.detail(postId)});
      queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      queryClient.invalidateQueries({queryKey: reCommentKeys.list(commentId)});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 답글 불러오기
export const useGetRecomments = (
  commentId: number,
  isReCommentOpen: boolean,
) => {
  return useQuery({
    queryKey: reCommentKeys.list(commentId),
    queryFn: getReComments,
    enabled: isReCommentOpen,
  });
};
