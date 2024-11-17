import {useMutation, useQuery} from '@tanstack/react-query';
import {applyCommunity, deleteApply, getCommunityApplies} from '.';
import {applyKeys} from './queries';
import {queryClient} from '../../../App';
import {showTopToast} from 'utils/toast';

export const useApplyCommunity = () => {
  return useMutation({
    mutationFn: applyCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: applyKeys.list()});
    },
  });
};

export const useGetCommunityApplies = () => {
  return useQuery({queryKey: applyKeys.list(), queryFn: getCommunityApplies});
};

export const useDeleteApply = () => {
  return useMutation({
    mutationFn: deleteApply,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: applyKeys.list()});
      showTopToast({message: '삭제 완료'});
    },
  });
};
