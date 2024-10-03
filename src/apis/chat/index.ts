import {PlayerUser} from 'apis/user/types';
import {axiosInstance} from '../index';
import {ApiResponse, Id} from '../types';
import {chatKeys, chatRoomKeys} from './queries';
import {
  ChatRoom,
  ChatRoomIdPayload,
  ChatRoomListResponse,
  CreateChatRoomPayload,
  GetChatsResponse,
} from './types';

// 채팅방 개설하기
export const createChatRoom = async (data: CreateChatRoomPayload) => {
  const {playerId, name, description, max, image} = data;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('max', max);
  if (image.uri) {
    formData.append('image', image);
  }
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/players/${playerId}/chatrooms`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 채팅방 목록 불러오기
export const getChatRooms = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.list>;
}) => {
  const [, , {playerId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ChatRoomListResponse[]>>(
    `/players/${playerId}/chatrooms`,
  );
  return response.data;
};

// 내 채팅방 목록 불러오기
export const getMyChatRooms = async () => {
  const response =
    await axiosInstance.get<ApiResponse<ChatRoomListResponse[]>>(
      '/my/chatrooms',
    );
  return response.data;
};

// 채팅방 불러오기
export const getChatRoomById = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.detail>;
}) => {
  const [, , chatRoomId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ChatRoom>>(
    `/chatrooms/${chatRoomId}`,
  );
  return response.data;
};

// 채팅 목록 불러오기
export const getChats = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof chatKeys.list>;
  pageParam: number;
}) => {
  const [, , {chatRoomId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetChatsResponse>>(
    `/chatrooms/${chatRoomId}/chats?page=${pageParam}&size=20`,
  );
  return response.data;
};

// 채팅 참여자 목록 불러오기
export const getParticipants = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.participants>;
}) => {
  const [, , {chatRoomId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<PlayerUser[]>>(
    `/chatrooms/${chatRoomId}/participants`,
  );
  return response.data;
};

// 채팅방 삭제
export const deleteChatRoom = async (data: ChatRoomIdPayload) => {
  const {chatRoomId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/chatrooms/${chatRoomId}`,
  );
  return response.data;
};
