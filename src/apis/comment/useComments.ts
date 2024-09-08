import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteComment,
  deleteReComment,
  getComments,
  getReComments,
  writeComment,
  writeReComment,
} from '.';
import {commentKeys, reCommentKeys} from './queries';
import {postKeys} from '../post/queries';
import {showBottomToast} from '../../utils/\btoast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: data => {
      const {message} = data;
      if (message === '존재하지 않는 댓글입니다.') {
        showBottomToast(insets.bottom + 20, message);
      }
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
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

// 답글 삭제
export const useDeleteReComment = () => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: deleteReComment,
    onSuccess: data => {
      const {message} = data;
      if (message === '존재하지 않는 답글입니다.') {
        showBottomToast(insets.bottom + 20, message);
      }
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};
