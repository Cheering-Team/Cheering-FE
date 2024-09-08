import {axiosInstance} from '..';
import {ApiResponse} from '../types';
import {chatRoomKeys} from './queries';
import {ChatRoom} from './types';

// 채팅방 목록 불러오기
export const getChatRooms = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.list>;
}) => {
  const [, , {playerId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ChatRoom[]>>(
    `/players/${playerId}/chatrooms`,
  );
  return response.data;
};
