import {useMutation, useQuery} from '@tanstack/react-query';
import {
  checkCode,
  checkCodeSocial,
  connectSocial,
  deleteUser,
  getUserInfo,
  kakaoSignIn,
  naverSignIn,
  saveFCMToken,
  sendSMS,
  signIn,
  signUp,
  updateUserNickname,
} from './index';
import {userKeys} from './queries';
import {queryClient} from '../../../App';

export const useSendSMS = () => {
  return useMutation({mutationFn: sendSMS});
};

export const useCheckCode = () => {
  return useMutation({mutationFn: checkCode});
};

export const useCheckCodeSocial = () => {
  return useMutation({mutationFn: checkCodeSocial});
};

export const useSignIn = () => {
  return useMutation({mutationFn: signIn});
};

export const useSignUp = () => {
  return useMutation({mutationFn: signUp});
};

export const useKakaoSignIn = () => {
  return useMutation({mutationFn: kakaoSignIn});
};

export const useNaverSignIn = () => {
  return useMutation({mutationFn: naverSignIn});
};

export const useConnectSocial = () => {
  return useMutation({mutationFn: connectSocial});
};

export const useGetUserInfo = () => {
  return useQuery({queryKey: userKeys.detail(), queryFn: getUserInfo});
};

export const useUpdateUserNickname = () => {
  return useMutation({
    mutationFn: updateUserNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: userKeys.detail()});
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};

export const useSaveFCMToken = () => {
  return useMutation({
    mutationFn: saveFCMToken,
  });
};
