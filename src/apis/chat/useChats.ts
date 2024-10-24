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
import {queryClient} from '../../../App';

// 채팅방 개설
export const useCreateChatRoom = (communityId: number) => {
  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: chatRoomKeys.list(communityId)});
      queryClient.invalidateQueries({queryKey: chatRoomKeys.my()});
    },
  });
};

// 채팅방 목록
export const useGetChatRooms = (communityId: number, enabled: boolean) => {
  return useQuery({
    queryKey: chatRoomKeys.list(communityId),
    queryFn: getChatRooms,
    enabled: enabled,
    retry: false,
  });
};

// 내 참여중인 채팅방 목록
export const useGetMyChatRooms = () => {
  return useQuery({
    queryKey: chatRoomKeys.my(),
    queryFn: getMyChatRooms,
    retry: false,
  });
};

// 채팅방 정보
export const useGetChatRoomById = (chatRoomId: number, enabled: boolean) => {
  return useQuery({
    queryKey: chatRoomKeys.detail(chatRoomId),
    queryFn: getChatRoomById,
    enabled: enabled,
    retry: false,
  });
};

// 채팅 불러오기 (무한 스크롤)
export const useGetChats = (chatRoomId: number) => {
  return useInfiniteQuery({
    queryKey: chatKeys.list(chatRoomId),
    queryFn: getChats,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

// 채팅 참여자 목록 불러오기
export const useGetParticipants = (chatRoomId: number) => {
  return useQuery({
    queryKey: chatRoomKeys.participants(chatRoomId),
    queryFn: getParticipants,
    retry: false,
  });
};

// 채팅방 삭제
export const useDeleteChatRoom = () => {
  return useMutation({
    mutationFn: deleteChatRoom,
  });
};
