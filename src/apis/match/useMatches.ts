import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {matchKeys} from './queries';
import {getMatchDetail, getMatchSchedule, getNearMatch, getNextMatch} from '.';

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
