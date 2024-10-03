import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {chatKeys, chatRoomKeys} from './queries';
import {
  createChatRoom,
  deleteChatRoom,
  getChatRoomById,
  getChatRooms,
  getChats,
  getMyChatRooms,
  getParticipants,
} from './index';

// 채팅방 개설
export const useCreateChatRoom = () => {
  return useMutation({mutationFn: createChatRoom});
};

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
export const useGetChatRoomById = (chatRoomId: number, enabled: boolean) => {
  return useQuery({
    queryKey: chatRoomKeys.detail(chatRoomId),
    queryFn: getChatRoomById,
    enabled: enabled,
  });
};

// 채팅 불러오기 (무한 스크롤)
export const useGetChats = (chatRoomId: number) => {
  return useInfiniteQuery({
    queryKey: chatKeys.list(chatRoomId),
    queryFn: getChats,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
  });
};

// 채팅 참여자 목록 불러오기
export const useGetParticipants = (chatRoomId: number) => {
  return useQuery({
    queryKey: chatRoomKeys.participants(chatRoomId),
    queryFn: getParticipants,
  });
};

// 채팅방 삭제
export const useDeleteChatRoom = () => {
  return useMutation({
    mutationFn: deleteChatRoom,
  });
};
