import {useMutation, useQuery} from '@tanstack/react-query';
import {
  changeCommunityOrder,
  getCommunities,
  getCommunityById,
  getMyCommunities,
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
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: changeCommunityOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: communityKeys.listByMy()});
      navigation.goBack();
      showTopToast(insets.top + 10, '저장 완료');
    },
  });
};
