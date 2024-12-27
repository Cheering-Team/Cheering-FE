import {useMutation, useQuery} from '@tanstack/react-query';
import {voteKeys} from './queries';
import {getHotVote, vote} from './index';
import {queryClient} from '../../../App';
import {postKeys} from 'apis/post/queries';

export const useVote = (communityId: number) => {
  return useMutation({
    mutationFn: vote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: voteKeys.hot(communityId)});
    },
  });
};

export const useGetHotVote = (communityId: number, enabled: boolean) => {
  return useQuery({
    queryKey: voteKeys.hot(communityId),
    queryFn: getHotVote,
    retry: false,
    enabled,
  });
};
