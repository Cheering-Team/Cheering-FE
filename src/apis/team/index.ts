import {axiosInstance} from 'apis';
import {ApiResponse, IdName} from 'apis/types';
import {leagueKeys, teamKeys} from './queries';
import {Sport, Team, TeamWithLeague} from './types';

// 종목 불러오기
export const getSports = async () => {
  const response = await axiosInstance.get<ApiResponse<Sport[]>>('/sports');
  return response.data.result;
};

// 리그 불러오기
export const getLeagues = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof leagueKeys.list>;
}) => {
  const [, , {sportId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<IdName[]>>(
    `/sports/${sportId}/leagues`,
  );
  return response.data.result;
};

// 팀 불러오기
export const getTeams = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof teamKeys.listByLeague>;
}) => {
  const [, , {leagueId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Team[]>>(
    `/leagues/${leagueId}/teams`,
  );
  return response.data.result;
};

// 선수 소속팀 목록 불러오기
export const getTeamsByPlayer = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof teamKeys.listByPlayer>;
}) => {
  const [, , {playerId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Team[]>>(
    `/players/${playerId}/teams`,
  );
  return response.data.result;
};

// 팀 검색하기
export const searchTeams = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof teamKeys.listByName>;
}) => {
  const [, , {name}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<TeamWithLeague[]>>(
    `/teams?name=${name}`,
  );
  return response.data.result;
};

// 인기 팀 조회
export const getPopularTeams = async () => {
  const response =
    await axiosInstance.get<ApiResponse<TeamWithLeague[]>>(`/teams/popular`);
  return response.data.result;
};
