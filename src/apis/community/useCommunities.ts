import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getCommunities,
  getCommunitiesByTeam,
  getCommunityById,
  getMyCommunities,
  joinCommunity,
} from './index';
import {communityKeys} from './queries';
import {queryClient} from '../../../App';

// 커뮤니티 조회
export const useGetCommunityById = (communityId: number) => {
  return useQuery({
    queryKey: communityKeys.detail(communityId),
    queryFn: getCommunityById,
    retry: false,
  });
};

// 특정 팀 소속 커뮤니티 목록 조회
export const useGetCommunitiesByTeam = (teamId: number) => {
  return useQuery({
    queryKey: communityKeys.listByTeam(teamId),
    queryFn: getCommunitiesByTeam,
    retry: false,
  });
};

// 커뮤니티 검색
export const useGetCommunities = (name: string, enabled: boolean) => {
  return useQuery({
    queryKey: communityKeys.listBySearch(name),
    queryFn: getCommunities,
    enabled,
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
