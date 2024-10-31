import {useQuery} from '@tanstack/react-query';
import {matchKeys} from './queries';
import {getMatchDetail, getMatchSchedule} from '.';

export const useGetMatchSchedule = (communityId: number) => {
  return useQuery({
    queryKey: matchKeys.list(communityId),
    queryFn: getMatchSchedule,
    retry: false,
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
