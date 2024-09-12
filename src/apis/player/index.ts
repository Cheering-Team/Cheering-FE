import {axiosInstance} from '..';
import {ApiResponse} from '../types';
import {Player} from './types';

// 내 선수 불러오기
export const getMyPlayers = async () => {
  const response = await axiosInstance.get<ApiResponse<Player[]>>(
    '/my/players',
  );
  return response.data;
};
