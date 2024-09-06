import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {postKeys} from './queries';
import {getPostById, likePost} from '.';

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
    },
  });
};
