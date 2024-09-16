import {useQuery} from '@tanstack/react-query';
import {chatRoomKeys} from './queries';
import {getChatRoomById, getChatRooms, getMyChatRooms} from '.';

// 채팅방 목록
export const useGetChatRooms = (playerId: number, enabled: boolean) => {
  return useQuery({
    queryKey: chatRoomKeys.list(playerId),
    queryFn: getChatRooms,
    enabled: enabled,
  });
};

// 내 참여중인 채팅방 목록
export const useGetMyChatRooms = () => {
  return useQuery({
    queryKey: chatRoomKeys.my(),
    queryFn: getMyChatRooms,
  });
};

// 채팅방 정보
export const useGetChatRoomById = (chatRoomId: number) => {
  return useQuery({
    queryKey: chatRoomKeys.detail(chatRoomId),
    queryFn: getChatRoomById,
    enabled: false,
  });
};
