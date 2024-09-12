import {axiosInstance} from '..';
import {ApiResponse} from '../types';
import {playerUserKeys} from './queries';
import {
  GetPlayerUserInfoResponse,
  Player,
  PlayerUserIdPayload,
  UpdatedPlayerUserImagePayload,
  UpdatedPlayerUserNicknamePayload,
} from './types';

// 내 선수 불러오기
export const getMyPlayers = async () => {
  const response = await axiosInstance.get<ApiResponse<Player[]>>(
    '/my/players',
  );
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

export const deletePlayerUser = async (data: PlayerUserIdPayload) => {
  const {playerUserId} = data;
  const response = await axiosInstance.delete(`/playerusers/${playerUserId}`);
  return response.data;
};
