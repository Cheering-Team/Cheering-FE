import {axiosInstance} from '..';
import {ApiResponse} from '../types';
import {playerUserKeys} from './queries';
import {GetPlayerUserInfoResponse, Player} from './types';

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
