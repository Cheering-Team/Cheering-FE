import {useQuery} from '@tanstack/react-query';
import {
  getLeagues,
  getPopularTeams,
  getSports,
  getTeams,
  getTeamsByPlayer,
  searchTeams,
} from './index';
import {leagueKeys, teamKeys} from './queries';

// 종목 불러오기
export const useGetSports = () => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: getSports,
    retry: false,
  });
};

// 리그 불러오기
export const useGetLeagues = (sportId: number | null) => {
  return useQuery({
    queryKey: leagueKeys.list(sportId),
    queryFn: getLeagues,
    enabled: !!sportId,
    retry: false,
  });
};

// 팀 불러오기
export const useGetTeams = (leagueId: number | null) => {
  return useQuery({
    queryKey: teamKeys.listByLeague(leagueId),
    queryFn: getTeams,
    enabled: !!leagueId,
    retry: false,
  });
};

// 선수 소속팀 목록 불러오기
export const useGetTeamsByPlayer = (playerId: number) => {
  return useQuery({
    queryKey: teamKeys.listByPlayer(playerId),
    queryFn: getTeamsByPlayer,
    retry: false,
  });
};

// 팀 검색하기
export const useSearchTeams = (name: string) => {
  return useQuery({
    queryKey: teamKeys.listByName(name),
    queryFn: searchTeams,
    retry: false,
  });
};

// 인기 팀 조회
export const useGetPopularTeams = () => {
  return useQuery({queryKey: teamKeys.popularList(), queryFn: getPopularTeams});
};
