import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {dailyKeys, postKeys} from './queries.ts';
import {
  deleteDaily,
  deletePost,
  editDaily,
  editPost,
  getDailyExist,
  getDailys,
  getFanPosts,
  getMyHotPosts,
  getPostById,
  getPosts,
  getVotes,
  likePost,
  reportPost,
  writeDaily,
  writePost,
} from './index';
import {Post} from './types';
import {useNavigation} from '@react-navigation/native';
import {PostWriteScreenNavigationProp} from '../../screens/communityStack/postWrite/PostWriteScreen.tsx';
import {hideToast, showTopToast} from '../../utils/toast';
import {queryClient} from '../../../App';
import {LayoutAnimation} from 'react-native';
import {FilterType} from 'components/community/FeedFilter.tsx';

// 게시글 작성
export const useWritePost = () => {
  const navigaion = useNavigation<PostWriteScreenNavigationProp>();
  return useMutation({
    mutationFn: writePost,
    onSuccess: data => {
      queryClient.prefetchQuery({
        queryKey: postKeys.detail(data.id),
        queryFn: getPostById,
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      hideToast();
      navigaion.replace('Post', {
        postId: data.id,
      });
      showTopToast({message: '작성 완료'});
    },
  });
};

// 게시글 목록 불러오기 (무한 스크롤)
export const useGetPosts = (
  communityId: number,
  filter: FilterType,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: postKeys.list(communityId, filter),
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: enabled,
    retry: false,
  });
};

// 유저 게시글 불러오기 (무한 스크롤)
export const useGetFanPosts = (fanId: number) => {
  return useInfiniteQuery({
    queryKey: postKeys.listByFan(fanId),
    queryFn: getFanPosts,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

// 경기 게시글 불러오기 (무한 스크롤)
export const useGetVotes = (
  matchId: number,
  communityId: number,
  orderBy: string,
) => {
  return useInfiniteQuery({
    queryKey: postKeys.listByMatch(matchId, communityId, orderBy),
    queryFn: getVotes,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

// 게시글 불러오기
export const useGetPostById = (postId: number) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: getPostById,
    retry: false,
  });
};

// 게시글 좋아요 토글
export const useLikePost = (postId: number) => {
  return useMutation({
    mutationFn: likePost,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postKeys.lists(),
        exact: false,
      });
      await queryClient.cancelQueries({queryKey: postKeys.detail(postId)});

      const previousPosts = queryClient.getQueriesData({
        queryKey: postKeys.lists(),
        exact: false,
      });
      const previousPost = queryClient.getQueryData(postKeys.detail(postId));

      previousPosts.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: Post) =>
                post.id === postId
                  ? {
                      ...post,
                      isLike: !post.isLike,
                      likeCount: post.isLike
                        ? post.likeCount - 1
                        : post.likeCount + 1,
                    }
                  : post,
              ),
            })),
          };
        });
      });
      queryClient.setQueryData(postKeys.detail(postId), (oldData: Post) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isLike: !oldData.isLike,
          likeCount: oldData.isLike
            ? oldData.likeCount - 1
            : oldData.likeCount + 1,
        };
      });
      return {previousPosts, previousPost};
    },
    onError: error => {
      if (error.message === '존재하지 않는 게시글') {
        const previousPosts = queryClient.getQueriesData({
          queryKey: postKeys.lists(),
          exact: false,
        });
        previousPosts.forEach(([key, oldData]: [unknown, any]) => {
          queryClient.setQueryData(key, (data: any) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page: any) => ({
                ...page,
                posts: page.posts.filter((post: Post) => post.id !== postId),
              })),
            };
          });
        });
        queryClient.invalidateQueries({queryKey: postKeys.detail(postId)});
      }
    },
    onSuccess: data => {
      const {isLike, likeCount} = data;
      const previousPosts = queryClient.getQueriesData({
        queryKey: postKeys.lists(),
        exact: false,
      });
      previousPosts.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...data,
              posts: page.posts.map((post: Post) =>
                post.id === postId ? {...post, isLike, likeCount} : post,
              ),
            })),
          };
        });
      });

      queryClient.setQueryData(postKeys.detail(postId), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isLike,
          likeCount,
        };
      });
    },
  });
};

// 게시글 수정
export const useEditPost = () => {
  const navigaion = useNavigation<PostWriteScreenNavigationProp>();
  return useMutation({
    mutationFn: editPost,
    onSuccess: (data, variables) => {
      queryClient.prefetchQuery({
        queryKey: postKeys.detail(variables.postId),
        queryFn: getPostById,
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      hideToast();
      navigaion.goBack();
      showTopToast({message: '수정 완료'});
    },
  });
};

// 게시글 삭제
export const useDeletePost = (postId: number, type: 'feed' | 'post') => {
  const navigation = useNavigation();
  return useMutation({
    mutationFn: deletePost,
    onMutate: async () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await queryClient.cancelQueries({
        queryKey: postKeys.lists(),
        exact: false,
      });
      await queryClient.cancelQueries({queryKey: postKeys.detail(postId)});

      const previousPosts = queryClient.getQueriesData({
        queryKey: postKeys.lists(),
        exact: false,
      });
      const previousPostDetail = queryClient.getQueryData(
        postKeys.detail(postId),
      );

      previousPosts.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              posts: page.posts.filter((post: Post) => post.id !== postId),
            })),
          };
        });
      });

      queryClient.removeQueries({queryKey: postKeys.detail(postId)});
      if (type === 'post') {
        navigation.goBack();
      }

      return {previousPosts, previousPostDetail};
    },
    onSuccess: () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const previousPosts = queryClient.getQueriesData({
        queryKey: postKeys.lists(),
        exact: false,
      });

      previousPosts.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              posts: page.posts.filter((post: Post) => post.id !== postId),
            })),
          };
        });
      });

      showTopToast({message: '삭제 완료'});
    },
  });
};

// 게시글 신고
export const useReportPost = (type: 'feed' | 'post') => {
  const navigation = useNavigation();
  return useMutation({
    mutationFn: reportPost,
    onMutate: async ({postId}) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await queryClient.cancelQueries({
        queryKey: postKeys.lists(),
        exact: false,
      });
      await queryClient.cancelQueries({queryKey: postKeys.detail(postId)});

      const previousPosts = queryClient.getQueriesData({
        queryKey: postKeys.lists(),
        exact: false,
      });
      const previousPostDetail = queryClient.getQueryData(
        postKeys.detail(postId),
      );

      previousPosts.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              posts: page.posts.filter((post: Post) => post.id !== postId),
            })),
          };
        });
      });

      queryClient.removeQueries({queryKey: postKeys.detail(postId)});
      if (type === 'post') {
        navigation.goBack();
      }

      return {previousPosts, previousPostDetail};
    },
    onSuccess: (_, {postId}) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const previousPosts = queryClient.getQueriesData({
        queryKey: postKeys.lists(),
        exact: false,
      });

      previousPosts.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              posts: page.posts.filter((post: Post) => post.id !== postId),
            })),
          };
        });
      });

      showTopToast({message: '신고 완료'});
    },
  });
};

// 인기 게시글 조회
export const useGetMyHotPosts = () => {
  return useInfiniteQuery({
    queryKey: postKeys.listMyHot(),
    queryFn: getMyHotPosts,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

// 데일리 작성
export const useWriteDaily = () => {
  return useMutation({
    mutationFn: writeDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: dailyKeys.lists()});
    },
  });
};

// 데일리 목록 불러오기
export const useGetDailys = (
  playerId: number,
  date: string,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: dailyKeys.list(playerId, date),
    queryFn: getDailys,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: enabled,
    retry: false,
  });
};

// 데일리 수정
export const useEditDaily = () => {
  return useMutation({
    mutationFn: editDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: dailyKeys.lists()});
    },
  });
};

// 데일리 삭제
export const useDeleteDaily = (curId: number | null) => {
  return useMutation({
    mutationFn: deleteDaily,
    onMutate: async () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await queryClient.cancelQueries({
        queryKey: dailyKeys.lists(),
        exact: false,
      });

      const previousDailys = queryClient.getQueriesData({
        queryKey: dailyKeys.lists(),
        exact: false,
      });

      previousDailys.forEach(([key, oldData]: [unknown, any]) => {
        queryClient.setQueryData(key, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              dailys: page.dailys.filter((post: Post) => post.id !== curId),
            })),
          };
        });
      });

      return {previousDailys};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: dailyKeys.lists()});
    },
  });
};

// 데일리 유무 로드
export const useGetDailyExist = (playerId: number) => {
  return useQuery({
    queryKey: dailyKeys.exist(playerId),
    queryFn: getDailyExist,
    retry: false,
  });
};
