import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {chatKeys, chatRoomKeys} from './queries';
import {
  createChatRoom,
  createPrivateChatRoom,
  deleteChatRoom,
  disableNotification,
  enableNotification,
  getChatRoomById,
  getChatRooms,
  getChats,
  getMyChatRooms,
  getMyOfficialChatRooms,
  getOfficialChatRoom,
  getParticipants,
  getPrivateChatRoomById,
  getPrivateChatRoomIdsForManager,
  getUnreadChats,
  updateExitTime,
} from './index';
import {queryClient} from '../../../App';
import {ChatRoom} from './types';

// 채팅방 개설
export const useCreateChatRoom = () => {
  return useMutation({
    mutationFn: createChatRoom,
  });
};

// 공식 채팅방 조회
export const useGetOfficialChatRoom = (
  communityId: number,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: chatRoomKeys.list(communityId, 'OFFICIAL', 'createdAt', ''),
    queryFn: getOfficialChatRoom,
    enabled: enabled,
    retry: false,
  });
};

// 채팅방 목록 (무한 스크롤)
export const useGetChatRooms = (
  communityId: number,
  sortBy: 'participants' | 'createdAt',
  name: string,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: chatRoomKeys.list(communityId, 'PUBLIC', sortBy, name),
    queryFn: getChatRooms,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: enabled,
    retry: false,
  });
};

// 참여중인 대표 채팅방 목록 조회
export const useGetMyOfficialChatRooms = () => {
  return useQuery({
    queryKey: chatRoomKeys.my('OFFICIAL'),
    queryFn: getMyOfficialChatRooms,
    retry: false,
  });
};

// 내 참여중인 채팅방 목록
export const useGetMyChatRooms = () => {
  return useQuery({
    queryKey: chatRoomKeys.my('PUBLIC'),
    queryFn: getMyChatRooms,
    retry: false,
    enabled: false,
  });
};

// 채팅방 정보
export const useGetChatRoomById = (
  chatRoomId: number,
  type: 'PRIVATE' | 'PUBLIC' | 'CONFIRM' | 'OFFICIAL',
  enabled: boolean,
) => {
  return useQuery({
    queryKey: chatRoomKeys.detail(chatRoomId),
    queryFn: type === 'PRIVATE' ? getPrivateChatRoomById : getChatRoomById,
    enabled: enabled,
    retry: false,
  });
};

// 채팅 불러오기 (무한 스크롤)
export const useGetChats = (chatRoomId: number) => {
  return useInfiniteQuery({
    queryKey: chatKeys.list(chatRoomId),
    queryFn: getChats,
    initialPageParam: null,
    getNextPageParam: lastPage => {
      return lastPage.hasNext
        ? lastPage.chats[lastPage.chats.length - 1].createdAt
        : undefined;
    },
    retry: false,
    gcTime: 0,
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

// 퇴장 시간 갱신
export const useUpdateExitTime = () => {
  return useMutation({
    mutationFn: updateExitTime,
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: chatRoomKeys.my('PUBLIC'),
      });
    },
  });
};

// 안읽은 전체 채팅 수
export const useGetUnreadChats = () => {
  return useQuery({
    queryKey: chatKeys.isUnread(),
    queryFn: getUnreadChats,
  });
};

export const useCreatePrivateChatRoom = () => {
  return useMutation({mutationFn: createPrivateChatRoom});
};

export const useGetPrivateChatRoomIdsForManager = (meetId: number) => {
  return useQuery({
    queryKey: chatRoomKeys.listByMeet(meetId),
    queryFn: getPrivateChatRoomIdsForManager,
  });
};

export const useEnableNotification = (chatRoomId: number) => {
  return useMutation({
    mutationFn: enableNotification,
    onMutate: () => {
      queryClient.setQueryData(
        chatRoomKeys.detail(chatRoomId),
        (data: ChatRoom) => {
          if (!data) return data;
          return {
            ...data,
            notificationsEnabled: true,
          };
        },
      );
    },
  });
};

export const useDisableNotification = (chatRoomId: number) => {
  return useMutation({
    mutationFn: disableNotification,
    onMutate: () => {
      queryClient.setQueryData(
        chatRoomKeys.detail(chatRoomId),
        (data: ChatRoom) => {
          if (!data) return data;
          return {
            ...data,
            notificationsEnabled: false,
          };
        },
      );
    },
  });
};
