import {useMutation, useQuery} from '@tanstack/react-query';
import {
  changeCommunityOrder,
  getCommunities,
  getCommunityById,
  getMyCommunities,
  getPopularPlayers,
  getRandomCommunity,
  joinCommunities,
  joinCommunity,
} from './index';
import {communityKeys} from './queries';
import {queryClient} from '../../../App';
import {useNavigation} from '@react-navigation/native';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// 커뮤니티 조회
export const useGetCommunityById = (communityId: number) => {
  return useQuery({
    queryKey: communityKeys.detail(communityId),
    queryFn: getCommunityById,
    retry: false,
  });
};

// 커뮤니티 검색
export const useGetCommunities = (teamId: number | null, name: string) => {
  return useQuery({
    queryKey: communityKeys.listBySearch(teamId, name),
    queryFn: getCommunities,
    retry: false,
  });
};

// 커뮤니티 가입
export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: (_, {communityId}) => {
      queryClient.invalidateQueries({queryKey: communityKeys.lists()});
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(communityId),
      });
    },
  });
};

// 내 선수 불러오기
export const useGetMyCommunities = () => {
  return useQuery({
    queryKey: communityKeys.listByMy(),
    queryFn: getMyCommunities,
    retry: false,
  });
};

// 커뮤니티 순서 변경
export const useChangeCommuniyOrder = () => {
  const navigation = useNavigation();
  return useMutation({
    mutationFn: changeCommunityOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: communityKeys.listByMy()});
      navigation.goBack();
      showTopToast({message: '저장 완료'});
    },
  });
};

// 커뮤니티 모두 가입 (신규 회원)
export const useJoinCommunities = () => {
  return useMutation({
    mutationFn: joinCommunities,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: communityKeys.listByMy()});
    },
  });
};

// 랜덤 커뮤니티 조회
export const useGetRandomCommunity = () => {
  return useQuery({
    queryKey: communityKeys.detailRandom(),
    queryFn: getRandomCommunity,
  });
};

// 인기 선수 조회
export const useGetPopularPlayers = () => {
  return useQuery({
    queryKey: communityKeys.popularList(),
    queryFn: getPopularPlayers,
  });
};
