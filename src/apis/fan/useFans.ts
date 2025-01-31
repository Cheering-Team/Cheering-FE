import {useMutation, useQuery} from '@tanstack/react-query';
import {
  blockFan,
  getBlockedFans,
  getFanInfo,
  unblockFan,
  updateFanImage,
  updateFanName,
} from './index';
import {queryClient} from '../../../App';
import {fanKeys} from './queries';
import {postKeys} from 'apis/post/queries';
import {showTopToast} from 'utils/toast';
import {useNavigation} from '@react-navigation/native';
import {commentKeys, reCommentKeys} from 'apis/comment/queries';
import {chatRoomKeys} from 'apis/chat/queries';
import {notificationKeys} from 'apis/notification/queries';
import {communityKeys} from 'apis/community/queries';

// 커뮤니티 유저 정보 불러오기
export const useGetFanInfo = (fanId: number | undefined) => {
  return useQuery({
    queryKey: fanKeys.detail(fanId),
    queryFn: getFanInfo,
    retry: false,
  });
};

// 커뮤니티 유저 이미지 바꾸기
export const useUpdateFanImage = () => {
  return useMutation({
    mutationFn: updateFanImage,
    onSuccess: (_, variable) => {
      const {fanId, image} = variable;
      queryClient.invalidateQueries({
        queryKey: fanKeys.detail(fanId),
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.details(),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
      image
        ? showTopToast({
            message: '수정 완료',
          })
        : showTopToast({
            message: '삭제 완료',
          });
    },
  });
};

// 커뮤니티 유저 닉네임 바꾸기
export const useUpdateFanName = () => {
  return useMutation({
    mutationFn: updateFanName,
    onSuccess: (_, variable) => {
      const {fanId} = variable;
      queryClient.invalidateQueries({
        queryKey: fanKeys.detail(fanId),
      });
    },
  });
};

// 커뮤니티 유저 차단하기
export const useBlockUser = () => {
  const navigation = useNavigation();
  return useMutation({
    mutationFn: blockFan,
    onSuccess: () => {
      showTopToast({message: '차단 완료'});
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
export const useGetBlockedUsers = (fanId: number) => {
  return useQuery({
    queryKey: fanKeys.blockList(fanId),
    queryFn: getBlockedFans,
    retry: false,
  });
};

// 차단 해제하기
export const useUnblockUser = (fanId: number) => {
  return useMutation({
    mutationFn: unblockFan,
    onSuccess: () => {
      showTopToast({message: '차단 해제 완료'});
      queryClient.invalidateQueries({
        queryKey: fanKeys.blockList(fanId),
      });
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
      queryClient.invalidateQueries({queryKey: notificationKeys.lists()});
    },
  });
};
