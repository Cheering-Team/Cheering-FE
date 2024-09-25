import {axiosInstance} from '../index';
import {ApiResponse, IdName} from '../types';
import {leagueKeys, playerKeys, playerUserKeys, teamKeys} from './queries';
import {
  GetPlayersByTeamResponse,
  GetPlayerUserInfoResponse,
  JoinCommunityPayload,
  Player,
  PlayerUserIdPayload,
  Sport,
  Team,
  UpdatedPlayerUserImagePayload,
  UpdatedPlayerUserNicknamePayload,
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
  const response = await axiosInstance.get<ApiResponse<Team[]>>(
    `/leagues/${leagueId}/teams`,
  );
  return response.data;
};

// 선수 검색
export const getPlayers = async (name: string) => {
  const response = await axiosInstance.get<ApiResponse<Player[]>>(
    `/players?name=${name}`,
  );
  return response.data;
};

// 특정 팀 선수 불러오기
export const getPlayersByTeam = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof playerKeys.listByTeam>;
}) => {
  const [, , {teamId}] = queryKey;
  const response = await axiosInstance.get<
    ApiResponse<GetPlayersByTeamResponse>
  >(`/teams/${teamId}/players`);
  return response.data;
};

// 선수 정보 불러오기
export const getPlayersInfo = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof playerKeys.detail>;
}) => {
  const [, , playerId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Player>>(
    `/players/${playerId}`,
  );
  return response.data;
};

// 커뮤니티 가입
export const joinCommunity = async (data: JoinCommunityPayload) => {
  const {playerId, nickname, image} = data;
  const formData = new FormData();
  formData.append('nickname', nickname);
  if (image.uri) {
    formData.append('image', image);
  }
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/players/${playerId}/users`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 내 선수 불러오기
export const getMyPlayers = async () => {
  const response =
    await axiosInstance.get<ApiResponse<Player[]>>('/my/players');
  return response.data;
};

// 커뮤니티 프로필 정보 불러오기
export const getPlayerUserInfo = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof playerUserKeys.detail>;
}) => {
  const [, , playerUserId] = queryKey;
  const response = await axiosInstance.get<
    ApiResponse<GetPlayerUserInfoResponse>
  >(`/playerusers/${playerUserId}`);
  return response.data;
};

// 커뮤니티 프로필 이미지 바꾸기
export const updatePlayerUserImage = async (
  data: UpdatedPlayerUserImagePayload,
) => {
  const {playerUserId, image} = data;

  const formData = new FormData();
  formData.append('dummy', 'dummy');

  if (image) {
    formData.append('image', image);
  }
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/playerusers/${playerUserId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 커뮤니티 프로필 닉네임 바꾸기
export const updatePlayerUserNickname = async (
  data: UpdatedPlayerUserNicknamePayload,
) => {
  const {playerUserId, nickname} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/playerusers/${playerUserId}/nickname`,
    {nickname},
  );
  return response.data;
};

// 커뮤니티 탈퇴
export const deletePlayerUser = async (data: PlayerUserIdPayload) => {
  const {playerUserId} = data;
  const response = await axiosInstance.delete(`/playerusers/${playerUserId}`);
  return response.data;
};
