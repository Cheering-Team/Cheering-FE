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
import {showBottomToast, showTopToast} from '../../utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {queryClient} from '../../../App';
import {LayoutAnimation} from 'react-native';
import {Fan} from 'apis/user/types';
import {Comment, ReComment} from './types';
import {IdName} from 'apis/types';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

// 댓글 작성
export const useWriteComment = (
  postId: number | null,
  writer: Fan | undefined,
) => {
  return useMutation({
    mutationKey: ['writeComment'],
    mutationFn: writeComment,
    onMutate: async newComment => {
      await queryClient.cancelQueries({
        queryKey: commentKeys.list(postId),
      });
      const previousComments = queryClient.getQueryData(
        commentKeys.list(postId),
      );

      queryClient.setQueryData(commentKeys.list(postId), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                comments: [
                  {
                    id: 'temp',
                    content: newComment.content,
                    createdAt: new Date(),
                    reCount: 0,
                    writer,
                    isWriter: true,
                    status: 'temp',
                  },
                  ...page.comments,
                ],
              };
            }
            return page;
          }),
        };
      });

      return {previousComments};
    },
    onSettled: () => {
      if (postId) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
        queryClient.invalidateQueries({queryKey: postKeys.detail(postId)});
        queryClient.invalidateQueries({queryKey: postKeys.lists()});
        queryClient.invalidateQueries({queryKey: commentKeys.random(postId)});
      }
    },
  });
};

// 댓글 목록 불러오기
export const useGetComments = (postId: number | null, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: getComments,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: enabled,
    retry: false,
  });
};

// 댓글 삭제
export const useDeleteComment = (postId: number | null) => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: deleteComment,
    onMutate: async ({commentId}) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await queryClient.cancelQueries({
        queryKey: commentKeys.list(postId),
        exact: false,
      });

      const previousComments = queryClient.getQueriesData({
        queryKey: commentKeys.list(postId),
        exact: false,
      });

      previousComments.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              comments: page.comments.filter(
                (comment: Comment) => comment.id !== commentId,
              ),
            })),
          };
        });
      });

      return {previousComments};
    },
    onSuccess: () => {
      showTopToast(insets.top + 20, '삭제 완료');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 댓글 신고
export const useReportComment = (postId: number | null) => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: reportComment,
    onMutate: async ({commentId}) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await queryClient.cancelQueries({
        queryKey: commentKeys.list(postId),
        exact: false,
      });

      const previousComments = queryClient.getQueriesData({
        queryKey: commentKeys.list(postId),
        exact: false,
      });

      previousComments.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              comments: page.comments.filter(
                (comment: Comment) => comment.id !== commentId,
              ),
            })),
          };
        });
      });

      return {previousComments};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: commentKeys.list(postId)});
      showTopToast(insets.top + 20, '신고 완료');
    },
  });
};

// 답글 작성
export const useWriteReComment = (to: IdName | null, writer: Fan) => {
  return useMutation({
    mutationFn: writeReComment,
    onMutate: async newRecomment => {
      const {commentId, content} = newRecomment;
      await queryClient.cancelQueries({
        queryKey: reCommentKeys.list(commentId),
      });

      const previousReComments = queryClient.getQueryData(
        reCommentKeys.list(commentId),
      );

      queryClient.setQueryData(
        reCommentKeys.list(commentId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return [
            ...oldData,
            {
              id: 'temp',
              content,
              createdAt: new Date(),
              writer,
              to: {id: to?.id, name: to?.name, image: ''},
              status: 'temp',
            },
          ];
        },
      );

      return {previousReComments};
    },
    onSuccess: (_, variables) => {
      const {postId, commentId} = variables;
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
    retry: false,
  });
};

// 답글 삭제
export const useDeleteReComment = (commentId: number) => {
  return useMutation({
    mutationFn: deleteReComment,
    onMutate: async ({reCommentId}) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await queryClient.cancelQueries({
        queryKey: reCommentKeys.list(commentId),
        exact: false,
      });

      const previousRecomments = queryClient.getQueriesData({
        queryKey: reCommentKeys.list(commentId),
        exact: false,
      });

      previousRecomments.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return oldData.filter(
            (recomment: ReComment) => recomment.id !== reCommentId,
          );
        });
      });

      return {previousRecomments};
    },
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
export const useReportReComment = (commentId: number) => {
  return useMutation({
    mutationFn: reportReComment,
    onMutate: async ({reCommentId}) => {
      await queryClient.cancelQueries({
        queryKey: reCommentKeys.list(commentId),
      });

      const previousReComments = queryClient.getQueryData(
        reCommentKeys.list(commentId),
      );

      queryClient.setQueryData(reCommentKeys.list(commentId), (data: any) => {
        if (!data) return data;
        return previousReComments.filter(
          (reComment: ReComment) => reComment.id !== reCommentId,
        );
      });

      return {previousReComments};
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: reCommentKeys.list(commentId)});
    },
  });
};

export const useGetRandomComment = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.random(postId),
    queryFn: getRandomComment,
    retry: false,
  });
};
