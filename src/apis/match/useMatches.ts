import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {matchKeys} from './queries';
import {
  editMatch,
  getMatchDetail,
  getMatchSchedule,
  getNearMatch,
  getNextMatch,
  getTwoWeeksMatches,
  getUnfinishedMatches,
} from '.';
import {queryClient} from '../../../App';

export const useGetMatchSchedule = (
  communityId: number,
  year: number,
  month: number,
) => {
  return useQuery({
    queryKey: matchKeys.list(communityId, year, month),
    queryFn: getMatchSchedule,
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useGetMatchDetail = (matchId: number | null) => {
  return useQuery({
    queryKey: matchKeys.detail(matchId),
    queryFn: getMatchDetail,
    retry: false,
    enabled: !!matchId,
  });
};

export const useGetNextMatch = (communityId: number) => {
  return useQuery({
    queryKey: matchKeys.nextList(communityId),
    queryFn: getNextMatch,
    retry: false,
  });
};

export const useGetNearMatch = (communityId: number) => {
  return useQuery({
    queryKey: matchKeys.nearList(communityId),
    queryFn: getNearMatch,
    retry: false,
  });
};

export const useGetUnfinishedMatches = () => {
  return useInfiniteQuery({
    queryKey: matchKeys.unfinishedList(),
    queryFn: getUnfinishedMatches,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

export const useEditMatch = () => {
  return useMutation({
    mutationFn: editMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: matchKeys.unfinishedList()});
    },
  });
};

export const useGetTwoWeeksMatches = (communityId: number) => {
  return useQuery({
    queryKey: matchKeys.twoWeeksList(communityId),
    queryFn: getTwoWeeksMatches,
    retry: false,
  });
};
