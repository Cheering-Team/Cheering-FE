import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {matchKeys} from './queries';
import {MatchDetail, MatchSchedule} from './types';

export const getMatchSchedule = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof matchKeys.list>;
}) => {
  const [, , {communityId, year, month}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<MatchSchedule>>(
    `/communities/${communityId}/matches?year=${year}&month=${month}`,
  );
  return response.data.result;
};

export const getMatchDetail = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof matchKeys.detail>;
}) => {
  const [, , matchId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<MatchDetail>>(
    `/matches/${matchId}`,
  );
  return response.data.result;
};

export const getNextMatch = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof matchKeys.nextList>;
}) => {
  const [, , , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<MatchDetail>>(
    `/communities/${communityId}/matches/next`,
  );
  return response.data.result;
};
