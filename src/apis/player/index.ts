import {Fan} from 'apis/user/types';
import {axiosInstance} from '../index';
import {ApiResponse, IdName} from '../types';
import {leagueKeys, communityKeys, fanKeys, teamKeys} from './queries';
import {
  GetPlayersByTeamResponse,
  GetFanInfoResponse,
  JoinCommunityPayload,
  Community,
  FanIdPayload,
  Sport,
  TeamName,
  UpdateFanImagePayload,
  UpdateFanNamePayload,
} from './types';

// 종목 불러오기
export const getSports = async () => {
  const response = await axiosInstance.get<ApiResponse<Sport[]>>('/sports');
  return response.data;
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
  return response.data;
};

// 팀 불러오기
export const getTeams = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof teamKeys.list>;
}) => {
  const [, , {leagueId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<TeamName[]>>(
    `/leagues/${leagueId}/teams`,
  );
  return response.data;
};

// 커뮤니티 검색
export const getCommunities = async (name: string) => {
  const response = await axiosInstance.get<ApiResponse<Community[]>>(
    `/communities?name=${name}`,
  );
  return response.data;
};

// 특정 팀, 소속 선수 커뮤니티 불러오기
export const getCommunitiesByTeam = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof communityKeys.listByTeam>;
}) => {
  const [, , {teamId}] = queryKey;
  const response = await axiosInstance.get<
    ApiResponse<GetPlayersByTeamResponse>
  >(`/teams/${teamId}/communities`);
  return response.data;
};

// 선수 정보 불러오기
export const getCommunityInfo = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof communityKeys.detail>;
}) => {
  const [, , playerId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Community>>(
    `/communities/${playerId}`,
  );
  return response.data;
};

// 커뮤니티 가입
export const joinCommunity = async (data: JoinCommunityPayload) => {
  const {communityId, name, image} = data;
  const formData = new FormData();
  formData.append('name', name);
  if (image.uri) {
    formData.append('image', image);
  }
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/communities/${communityId}/users`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 내가 가입한 커뮤니티 조회
export const getMyCommunities = async () => {
  const response =
    await axiosInstance.get<ApiResponse<Community[]>>('/my/communities');
  return response.data;
};

// 팬 정보 조회
export const getFanInfo = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof fanKeys.detail>;
}) => {
  const [, , fanId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetFanInfoResponse>>(
    `/fans/${fanId}`,
  );
  return response.data;
};

// 팬 이미지 변경
export const updateFanImage = async (data: UpdateFanImagePayload) => {
  const {fanId, image} = data;

  const formData = new FormData();
  formData.append('dummy', 'dummy');

  if (image) {
    formData.append('image', image);
  }
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/fans/${fanId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 팬 이름 변경
export const updateFanName = async (data: UpdateFanNamePayload) => {
  const {fanId, name} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/fans/${fanId}/name`,
    {name},
  );
  return response.data;
};

// 커뮤니티 탈퇴
export const deleteFan = async (data: FanIdPayload) => {
  const {fanId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/fans/${fanId}`,
  );
  return response.data;
};

// 팬 차단
export const blockFan = async (data: FanIdPayload) => {
  const {fanId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/blocks/${fanId}`,
  );
  return response.data;
};

// 차단한 팬 목록 조회
export const getBlockedFans = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof fanKeys.blockList>;
}) => {
  const [, , , {fanId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Fan[]>>(
    `/blocks/${fanId}`,
  );
  return response.data;
};

// 차단 해제
export const unblockFan = async (data: FanIdPayload) => {
  const {fanId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/blocks/${fanId}`,
  );
  return response.data;
};
