import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import {
  deleteCheer,
  deleteLikeCheer,
  getCheers,
  likeCheer,
  writeCheer,
} from '.';
import {cheerKeys} from './queries';
import {queryClient} from '../../../App';
import {showTopToast} from 'utils/toast';
import {Cheer, GetCheersResponse} from './types';

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
  return useMutation({
    mutationFn: deleteCheer,
    onSuccess: () => {
      showTopToast({message: '삭제 완료'});
      queryClient.invalidateQueries({
        queryKey: cheerKeys.list(matchId, communityId),
      });
    },
  });
};

export const useLikeCheer = (
  matchId: number,
  communityId: number,
  cheerId: number,
) => {
  return useMutation({
    mutationFn: likeCheer,
    onMutate: () => {
      queryClient.setQueryData(
        cheerKeys.list(matchId, communityId),
        (data: InfiniteData<GetCheersResponse, unknown>) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: GetCheersResponse) => ({
              ...page,
              cheers: page.cheers.map((cheer: Cheer) =>
                cheer.id === cheerId
                  ? {
                      ...cheer,
                      isLike: true,
                      likeCount: cheer.likeCount + 1,
                    }
                  : cheer,
              ),
            })),
          };
        },
      );
    },
  });
};

export const useDeleteLikeCheer = (
  matchId: number,
  communityId: number,
  cheerId: number,
) => {
  return useMutation({
    mutationFn: deleteLikeCheer,
    onMutate: () => {
      queryClient.setQueryData(
        cheerKeys.list(matchId, communityId),
        (data: InfiniteData<GetCheersResponse, unknown>) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page: GetCheersResponse) => ({
              ...page,
              cheers: page.cheers.map((cheer: Cheer) =>
                cheer.id === cheerId
                  ? {
                      ...cheer,
                      isLike: false,
                      likeCount: cheer.likeCount - 1,
                    }
                  : cheer,
              ),
            })),
          };
        },
      );
    },
  });
};
