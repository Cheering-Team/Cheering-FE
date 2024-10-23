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
  getPostById,
  getPosts,
  likePost,
  reportPost,
  writeDaily,
  writePost,
} from './index';
import {FilterType} from './types';
import {useNavigation} from '@react-navigation/native';
import {PostWriteScreenNavigationProp} from '../../screens/communityStack/PostWriteScreen';
import {hideToast, showBottomToast, showTopToast} from '../../utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {queryClient} from '../../../App';
import {LayoutAnimation} from 'react-native';

// 게시글 작성
export const useWritePost = () => {
  const navigaion = useNavigation<PostWriteScreenNavigationProp>();
  const insets = useSafeAreaInsets();
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
      showTopToast(insets.top + 20, '작성 완료');
    },
    onError: () => {
      if (error.code === 2004) {
        showTopToast(insets.top + 20, data.message);
      }
    },
  });
};

// 게시글 목록 불러오기 (무한 스크롤)
export const useGetPosts = (
  communityId: number,
  type: string,
  filter: FilterType,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: postKeys.list(communityId, filter, type),
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: enabled,
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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: postKeys.detail(postId)});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 게시글 수정
export const useEditPost = () => {
  const navigaion = useNavigation<PostWriteScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: editPost,
    onSuccess: (data, variables) => {
      if (data.message === '부적절한 단어가 포함되어 있습니다.') {
        showBottomToast(insets.bottom + 20, data.message);
        return;
      }
      queryClient.prefetchQuery({
        queryKey: postKeys.detail(variables.postId),
        queryFn: getPostById,
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      hideToast();
      navigaion.goBack();
      showBottomToast(insets.bottom + 20, '수정이 완료되었습니다.');
    },
  });
};

// 게시글 신고
export const useReportPost = () => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: reportPost,
    onSuccess: data => {
      const {message} = data;
      showBottomToast(insets.bottom + 20, message);
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
    },
  });
};

// 게시글 삭제
export const useDeletePost = () => {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      hideToast();
    },
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
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
    enabled: enabled,
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

// 데일리 수정
export const useDeleteDaily = () => {
  return useMutation({
    mutationFn: deleteDaily,
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
  });
};
