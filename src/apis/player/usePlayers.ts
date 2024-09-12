import {useMutation, useQuery} from '@tanstack/react-query';
import {playerKeys, playerUserKeys} from './queries';
import {
  deletePlayerUser,
  getMyPlayers,
  getPlayerUserInfo,
  updatePlayerUserImage,
  updatePlayerUserNickname,
} from './index';
import {queryClient} from '../../../App';
import {showBottomToast} from '../../utils/\btoast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {postKeys} from '../post/queries';
import {chatRoomKeys} from '../chat/queries';

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
        queryKey: postKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: chatRoomKeys.lists(),
      });
    },
  });
};
