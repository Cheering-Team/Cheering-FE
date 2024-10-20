import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {
  deleteComment,
  deleteReComment,
  getComments,
  getRandomComment,
  getReComments,
  reportComment,
  reportReComment,
  writeComment,
  writeReComment,
} from './index';
import {commentKeys, reCommentKeys} from './queries';
import {postKeys} from '../post/queries';
import {showBottomToast} from '../../utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {queryClient} from '../../../App';
import {LayoutAnimation} from 'react-native';

// 댓글 작성
export const useWriteComment = () => {
  return useMutation({
    mutationKey: ['writeComment'],
    mutationFn: writeComment,
    onSuccess: (_, variables) => {
      const {postId} = variables;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      queryClient.invalidateQueries({queryKey: postKeys.detail(postId)});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      queryClient.invalidateQueries({queryKey: commentKeys.random(postId)});
    },
  });
};

// 댓글 목록 불러오기
export const useGetComments = (postId: number | null) => {
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
    enabled: postId !== null,
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 댓글 신고
export const useReportComment = () => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: reportComment,
    onSuccess: data => {
      const {message} = data;
      showBottomToast(insets.bottom + 20, message);
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
    },
  });
};

// 답글 작성
export const useWriteReComment = (postId: number) => {
  return useMutation({
    mutationFn: writeReComment,
    onSuccess: (_, variables) => {
      const {commentId} = variables;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
  return useMutation({
    mutationFn: deleteReComment,
    onSuccess: () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 답글 신고
export const useReportReComment = () => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: reportReComment,
    onSuccess: data => {
      const {message} = data;
      showBottomToast(insets.bottom + 20, message);
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
    },
  });
};

export const useGetRandomComment = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.random(postId),
    queryFn: getRandomComment,
  });
};
