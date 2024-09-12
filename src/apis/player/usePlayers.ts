import {useQuery} from '@tanstack/react-query';
import {playerKeys} from './queries';
import {getMyPlayers} from './index';

// 내 선수 불러오기
export const useGetMyPlayers = () => {
  return useQuery({
    queryKey: playerKeys.lists(),
    queryFn: getMyPlayers,
    gcTime: 0,
  });
};
