import {useMutation, useQuery} from '@tanstack/react-query';
import {
  blockUser,
  deletePlayerUser,
  getBlockedUsers,
  getLeagues,
  getMyPlayers,
  getPlayers,
  getPlayersByTeam,
  getPlayersInfo,
  getPlayerUserInfo,
  getSports,
  getTeams,
  joinCommunity,
  unblockUser,
  updatePlayerUserImage,
  updatePlayerUserNickname,
} from './index';
import {queryClient} from '../../../App';
import {showBottomToast} from '../../utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {postKeys} from '../post/queries';
import {chatRoomKeys} from '../chat/queries';
import {leagueKeys, playerKeys, playerUserKeys, teamKeys} from './queries';
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

// 선수 검색
export const useGetPlayers = (name: string) => {
  return useQuery({
    queryKey: playerKeys.lists(),
    queryFn: () => getPlayers(name),
    enabled: false,
  });
};

// 특정 팀 선수 불러오기
export const useGetPlayersByTeam = (teamId: number) => {
  return useQuery({
    queryKey: playerKeys.listByTeam(teamId),
    queryFn: getPlayersByTeam,
  });
};

// 선수 정보 불러오기
export const useGetPlayersInfo = (playerId: number, refreshKey: number) => {
  return useQuery({
    queryKey: playerKeys.detail(playerId, refreshKey),
    queryFn: getPlayersInfo,
  });
};

// 커뮤니티 가입
export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: playerKeys.list('my')});
    },
  });
};

// 내 선수 불러오기
export const useGetMyPlayers = () => {
  return useQuery({
    queryKey: playerKeys.list('my'),
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

// 커뮤니티 유저 이미지 바꾸기
export const useUpdatePlayerUserImage = () => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: updatePlayerUserImage,
    onSuccess: (_, variable) => {
      const {playerUserId, image} = variable;
      queryClient.invalidateQueries({
        queryKey: playerUserKeys.detail(playerUserId),
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
    mutationFn: updatePlayerUserNickname,
    onSuccess: (_, variable) => {
      const {playerUserId} = variable;
      queryClient.invalidateQueries({
        queryKey: playerUserKeys.detail(playerUserId),
      });
    },
  });
};

// 커뮤니티 탈퇴하기
export const useDeletePlayerUser = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return useMutation({
    mutationFn: deletePlayerUser,
    onSuccess: () => {
      showBottomToast(insets.bottom + 20, '커뮤니티에서 탈퇴했습니다.');
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
      });
      queryClient.removeQueries({
        queryKey: playerKeys.details(),
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
    mutationFn: blockUser,
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
    queryKey: playerUserKeys.blockList(playerUserId),
    queryFn: getBlockedUsers,
  });
};

// 차단 해제하기
export const useUnblockUser = (playerUserId: number) => {
  const insets = useSafeAreaInsets();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: data => {
      showBottomToast(insets.bottom + 20, data.message);
      queryClient.invalidateQueries({
        queryKey: playerUserKeys.blockList(playerUserId),
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
      queryClient.invalidateQueries({queryKey: notificationKeys.lists()});
    },
  });
};
