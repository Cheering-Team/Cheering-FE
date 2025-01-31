import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {
  changeCommunityOrder,
  getCommunityById,
  getMyCommunities,
  getPopularPlayers,
  getRandomCommunity,
  joinCommunities,
  joinCommunity,
  leaveCommunity,
  searchPlayers,
} from './index';
import {communityKeys} from './queries';
import {queryClient} from '../../../App';
import {useNavigation} from '@react-navigation/native';
import {showTopToast} from 'utils/toast';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import {matchKeys} from 'apis/match/queries';
import {meetKeys} from 'apis/meet/queries';
import {postKeys} from 'apis/post/queries';

// 커뮤니티 조회
export const useGetCommunityById = (communityId: number) => {
  return useQuery({
    queryKey: communityKeys.detail(communityId),
    queryFn: getCommunityById,
    retry: false,
  });
};

// 선수 검색
export const useSearchPlayers = (
  teamId: number | null,
  name: string,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: communityKeys.listBySearch(teamId, name),
    queryFn: searchPlayers,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
    enabled,
  });
};

// 커뮤니티 가입
export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: (_, {communityId}) => {
      const today = new Date();
      queryClient.invalidateQueries({queryKey: communityKeys.lists()});
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(communityId),
      });
      queryClient.invalidateQueries({
        queryKey: matchKeys.listByDate(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        ),
      });
      queryClient.invalidateQueries({
        queryKey: meetKeys.randomFive(0),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.listMyHot(),
      });
    },
  });
};

// 내 선수 불러오기
export const useGetMyCommunities = (enabled: boolean) => {
  return useQuery({
    queryKey: communityKeys.listByMy(),
    queryFn: getMyCommunities,
    retry: false,
    enabled,
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

// 커뮤니티 탈퇴하기
export const useLeaveCommunity = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      showTopToast({message: '탈퇴 완료'});
      navigation.navigate('Home');
      queryClient.invalidateQueries();
    },
  });
};
