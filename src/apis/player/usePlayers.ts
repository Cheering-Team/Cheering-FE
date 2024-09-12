import {useQuery} from '@tanstack/react-query';
import {playerKeys, playerUserKeys} from './queries';
import {getMyPlayers, getPlayerUserInfo} from './index';

// 내 선수 불러오기
export const useGetMyPlayers = () => {
  return useQuery({
    queryKey: playerKeys.lists(),
    queryFn: getMyPlayers,
  });
};

// 커뮤니티 유저 정보 불러오기
export const useGetPlayerUserInfo = (playerUserId: number) => {
  return useQuery({
    queryKey: playerUserKeys.detail(playerUserId),
    queryFn: getPlayerUserInfo,
  });
};
