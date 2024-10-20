import {useMutation, useQuery} from '@tanstack/react-query';
import {
  blockFan,
  deleteFan,
  getBlockedFans,
  getLeagues,
  getMyCommunities,
  getCommunities,
  getCommunitiesByTeam,
  getCommunityInfo,
  getFanInfo,
  getSports,
  getTeams,
  joinCommunity,
  unblockFan,
  updateFanImage,
  updateFanName,
  getTeamById,
} from './index';
import {queryClient} from '../../../App';
import {showBottomToast} from '../../utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {postKeys} from '../post/queries';
import {chatRoomKeys} from '../chat/queries';
import {leagueKeys, communityKeys, fanKeys, teamKeys} from './queries';
import {commentKeys, reCommentKeys} from 'apis/comment/queries';
import {notificationKeys} from 'apis/notification/queries';

// 종목 불러오기
export const useGetSports = () => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: getSports,
  });
};

// 리그 불러오기
export const useGetLeagues = (sportId: number | null) => {
  return useQuery({
    queryKey: leagueKeys.list(sportId),
    queryFn: getLeagues,
    enabled: !!sportId,
  });
};

// 팀 불러오기
export const useGetTeams = (leagueId: number | null) => {
  return useQuery({
    queryKey: teamKeys.list(leagueId),
    queryFn: getTeams,
    enabled: !!leagueId,
  });
};

// 팀 조회
export const useGetTeamById = (teamId: number) => {
  return useQuery({
    queryKey: teamKeys.detail(teamId),
    queryFn: getTeamById,
  });
};

// 선수 검색
export const useGetPlayers = (name: string, enabled: boolean) => {
  return useQuery({
    queryKey: communityKeys.list(name),
    queryFn: getCommunities,
    enabled,
  });
};

// 특정 팀 선수 불러오기
export const useGetPlayersByTeam = (teamId: number) => {
  return useQuery({
    queryKey: communityKeys.listByTeam(teamId),
    queryFn: getCommunitiesByTeam,
  });
};

// 선수 정보 불러오기
export const useGetPlayersInfo = (playerId: number, refreshKey: number) => {
  return useQuery({
    queryKey: communityKeys.detail(playerId, refreshKey),
    queryFn: getCommunityInfo,
  });
};

// 커뮤니티 가입
export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: communityKeys.list('my')});
    },
  });
};

// 내 선수 불러오기
export const useGetMyCommunities = () => {
  return useQuery({
    queryKey: communityKeys.list('my'),
    queryFn: getMyCommunities,
  });
};

// 커뮤니티 유저 정보 불러오기
export const useGetPlayerUserInfo = (playerUserId: number) => {
  return useQuery({
    queryKey: fanKeys.detail(playerUserId),
    queryFn: getFanInfo,
  });
};

// 커뮤니티 유저 이미지 바꾸기
export const useUpdatePlayerUserImage = () => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: updateFanImage,
    onSuccess: (_, variable) => {
      const {fanId: playerUserId, image} = variable;
      queryClient.invalidateQueries({
        queryKey: fanKeys.detail(playerUserId),
      });
      image
        ? showBottomToast(insets.bottom + 20, '수정이 완료되었습니다.')
        : showBottomToast(insets.bottom + 20, '삭제가 완료되었습니다.');
    },
  });
};

// 커뮤니티 유저 닉네임 바꾸기
export const useUpdatePlayerUserNickname = () => {
  return useMutation({
    mutationFn: updateFanName,
    onSuccess: (_, variable) => {
      const {fanId: playerUserId} = variable;
      queryClient.invalidateQueries({
        queryKey: fanKeys.detail(playerUserId),
      });
    },
  });
};

// 커뮤니티 탈퇴하기
export const useDeletePlayerUser = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return useMutation({
    mutationFn: deleteFan,
    onSuccess: () => {
      showBottomToast(insets.bottom + 20, '커뮤니티에서 탈퇴했습니다.');
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
      });
      queryClient.removeQueries({
        queryKey: communityKeys.details(),
      });
      queryClient.removeQueries({
        queryKey: postKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: chatRoomKeys.lists(),
      });
    },
  });
};

// 커뮤니티 유저 차단하기
export const useBlockUser = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return useMutation({
    mutationFn: blockFan,
    onSuccess: data => {
      showBottomToast(insets.bottom + 20, data.message);
      navigation.goBack();
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
      queryClient.invalidateQueries({queryKey: notificationKeys.lists()});
    },
  });
};

// 차단한 유저 목록 불러오기
export const useGetBlockedUsers = (playerUserId: number) => {
  return useQuery({
    queryKey: fanKeys.blockList(playerUserId),
    queryFn: getBlockedFans,
  });
};

// 차단 해제하기
export const useUnblockUser = (playerUserId: number) => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: unblockFan,
    onSuccess: data => {
      showBottomToast(insets.bottom + 20, data.message);
      queryClient.invalidateQueries({
        queryKey: fanKeys.blockList(playerUserId),
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
      queryClient.invalidateQueries({queryKey: notificationKeys.lists()});
    },
  });
};
