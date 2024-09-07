import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {postKeys} from './queries';
import {editPost, getPostById, getPosts, likePost, writePost} from '.';
import {FilterType} from './types';
import {useNavigation} from '@react-navigation/native';
import {PostWriteScreenNavigationProp} from '../../screens/communityStack/PostWriteScreen';
import {hideToast, showBottomToast} from '../../utils/\btoast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// 게시글 작성
export const useWritePost = () => {
  const navigaion = useNavigation<PostWriteScreenNavigationProp>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: writePost,
    onSuccess: data => {
      queryClient.prefetchQuery({
        queryKey: postKeys.detail(data.result.id),
        queryFn: getPostById,
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      hideToast();
      navigaion.replace('Post', {
        postId: data.result.id,
      });
      showBottomToast(insets.bottom + 20, '작성이 완료되었습니다.');
    },
  });
};

// 게시글 목록 불러오기 (무한 스크롤)
export const useGetPosts = (
  playerId: number,
  filter: FilterType,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: postKeys.list(playerId, filter),
    queryFn: getPosts,
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

// 게시글 불러오기
export const useGetPostById = (postId: number) => {
  return useQuery({queryKey: postKeys.detail(postId), queryFn: getPostById});
};

// 게시글 좋아요 토글
export const useLikePost = (postId: number) => {
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: editPost,
    onSuccess: (_, variables) => {
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
