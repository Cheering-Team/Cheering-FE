import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {matchKeys} from './queries';
import {
  EditMatchPayload,
  GetUnfinishedMatchesResponse,
  MatchDetail,
  MatchSchedule,
} from './types';

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

export const getNearMatch = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof matchKeys.nearList>;
}) => {
  const [, , , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<MatchDetail[]>>(
    `/communities/${communityId}/matches/near`,
  );
  return response.data.result;
};

export const getUnfinishedMatches = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  const response = await axiosInstance.get<
    ApiResponse<GetUnfinishedMatchesResponse>
  >(`/matches/unfinished?page=${pageParam}&size=10`);
  return response.data.result;
};

export const editMatch = async (data: EditMatchPayload) => {
  const {matchId, ...rest} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/matches/${matchId}`,
    rest,
  );
  return response.data.result;
};

export const getTwoWeeksMatches = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof matchKeys.twoWeeksList>;
}) => {
  const [, , , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<MatchDetail[]>>(
    `/communities/${communityId}/matches/twoweeks`,
  );
  return response.data.result;
};
