import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {deleteCheer, getCheers, writeCheer} from '.';
import {cheerKeys} from './queries';
import {queryClient} from '../../../App';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useWriteCheer = () => {
  return useMutation({
    mutationFn: writeCheer,
    onSuccess: (data, variable) => {
      const {matchId, communityId} = variable;
      queryClient.invalidateQueries({
        queryKey: cheerKeys.list(matchId, communityId),
      });
    },
  });
};

export const useGetCheers = (matchId: number, communityId: number) => {
  return useInfiniteQuery({
    queryKey: cheerKeys.list(matchId, communityId),
    queryFn: getCheers,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

export const useDeleteCheer = (matchId: number, communityId: number) => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: deleteCheer,
    onSuccess: () => {
      showTopToast(insets.top + 20, '삭제 완료');
      queryClient.invalidateQueries({
        queryKey: cheerKeys.list(matchId, communityId),
      });
    },
  });
};
