import {useMutation, useQuery} from '@tanstack/react-query';
import {voteKeys} from './queries';
import {getVote, vote} from './index';
import {queryClient} from '../../../App';

export const useGetVote = (postId: number) => {
  return useQuery({
    queryKey: voteKeys.detail(postId),
    queryFn: getVote,
    retry: false,
  });
};

export const useVote = (postId: number) => {
  return useMutation({
    mutationFn: vote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: voteKeys.detail(postId)});
    },
  });
};
