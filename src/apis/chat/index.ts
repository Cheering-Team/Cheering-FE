import {Fan} from 'apis/fan/types';
import {axiosInstance} from '../index';
import {ApiResponse, Id} from '../types';
import {chatKeys, chatRoomKeys} from './queries';
import {
  ChatListResponse,
  ChatRoom,
  ChatRoomIdPayload,
  ChatRoomListResponse,
  CreateChatRoomPayload,
} from './types';

// 채팅방 생성
export const createChatRoom = async (data: CreateChatRoomPayload) => {
  const {communityId, name, description, max, image} = data;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('max', max);
  if (image.uri) {
    formData.append('image', image);
  }
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/communities/${communityId}/chatrooms`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data.result;
};

// 공식 채팅방 조회
export const getOfficialChatRoom = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.list>;
}) => {
  const [, , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ChatRoom>>(
    `/communities/${communityId}/chatrooms/official`,
  );
  return response.data.result;
};

// 채팅방 목록 조회
export const getChatRooms = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.list>;
  pageParam: number;
}) => {
  const [, , {communityId, sortBy, name}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ChatRoomListResponse>>(
    `/communities/${communityId}/chatrooms?sortBy=${sortBy}&name=${name}&page=${pageParam}&size=10`,
  );
  return response.data.result;
};

// 참여중인 대표 채팅방 목록 조회
export const getMyOfficialChatRooms = async () => {
  const response = await axiosInstance.get<ApiResponse<ChatRoom[]>>(
    '/my/chatrooms/official',
  );
  return response.data.result;
};

// 참여중인 일반 채팅방 목록 조회
export const getMyChatRooms = async () => {
  const response =
    await axiosInstance.get<ApiResponse<ChatRoom[]>>('/my/chatrooms');
  return response.data.result;
};

// 채팅방 정보 조회
export const getChatRoomById = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.detail>;
}) => {
  const [, , chatRoomId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ChatRoom>>(
    `/chatrooms/${chatRoomId}`,
  );
  return response.data.result;
};

// 채팅 목록 조회
export const getChats = async ({
  queryKey,
  pageParam = null,
}: {
  queryKey: ReturnType<typeof chatKeys.list>;
  pageParam: string | null;
}) => {
  const [, , {chatRoomId}] = queryKey;
  let response;
  if (pageParam === null) {
    response = await axiosInstance.get<ApiResponse<ChatListResponse>>(
      `/chatrooms/${chatRoomId}/chats?size=20`,
    );
  } else {
    response = await axiosInstance.get<ApiResponse<ChatListResponse>>(
      `/chatrooms/${chatRoomId}/chats?cursorDate=${pageParam}&size=20`,
    );
  }

  return response.data.result;
};

// 채팅 참여자 조회
export const getParticipants = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof chatRoomKeys.participants>;
}) => {
  const [, , {chatRoomId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Fan[]>>(
    `/chatrooms/${chatRoomId}/participants`,
  );
  return response.data.result;
};

// 채팅방 삭제
export const deleteChatRoom = async (data: ChatRoomIdPayload) => {
  const {chatRoomId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/chatrooms/${chatRoomId}`,
  );
  return response.data.result;
};

// 퇴장 시간 갱신
export const updateExitTime = async (data: ChatRoomIdPayload) => {
  const {chatRoomId} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/chat-rooms/${chatRoomId}/exit-time`,
  );
  return response.data.result;
};

// 안읽은 전체 메세지 수
export const getUnreadChats = async () => {
  const response =
    await axiosInstance.get<ApiResponse<number>>(`/chats/unread`);
  return response.data.result;
};

export const createPrivateChatRoom = async () => {
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/communities/59/meets/1/talk`,
  );
  return response.data.result;
};
