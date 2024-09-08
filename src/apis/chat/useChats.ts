import {useQuery} from '@tanstack/react-query';
import {chatRoomKeys} from './queries';
import {getChatRooms} from '.';

// 채팅방 목록
export const useGetChatRooms = (playerId: number, enabled: boolean) => {
  return useQuery({
    queryKey: chatRoomKeys.list(playerId),
    queryFn: getChatRooms,
    enabled: enabled,
  });
};
