import {useMutation, useQuery} from '@tanstack/react-query';
import {
  appleSignIn,
  checkCode,
  checkCodeSocial,
  connectSocial,
  deleteUser,
  getPlayerAccount,
  getUserInfo,
  isAgeAndGenderSet,
  kakaoSignIn,
  naverSignIn,
  registerManagerAccount,
  reissuePlayerAccountPassword,
  sendSMS,
  setAgeAndGender,
  signIn,
  signUp,
  updateUserName,
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

export const useAppleSignIn = () => {
  return useMutation({mutationFn: appleSignIn});
};

export const useConnectSocial = () => {
  return useMutation({mutationFn: connectSocial});
};

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: userKeys.detail(),
    queryFn: getUserInfo,
    retry: false,
  });
};

export const useUpdateUserName = () => {
  return useMutation({
    mutationFn: updateUserName,
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

export const useRegisterPlayerAccount = () => {
  return useMutation({
    mutationFn: registerManagerAccount,
    onSuccess: (_, variables) => {
      const {communityId: playerId} = variables;
      queryClient.invalidateQueries({
        queryKey: userKeys.playerAccount(playerId),
      });
    },
  });
};

export const useGetPlayerAccount = (playerId: number) => {
  return useQuery({
    queryKey: userKeys.playerAccount(playerId),
    queryFn: getPlayerAccount,
    enabled: playerId !== 0,
    retry: false,
  });
};

export const useReissuePlayerAccountPassword = () => {
  return useMutation({
    mutationFn: reissuePlayerAccountPassword,
    onSuccess: (_, variables) => {
      const {communityId: playerId} = variables;
      queryClient.invalidateQueries({
        queryKey: userKeys.playerAccount(playerId),
      });
    },
  });
};

export const useIsAgeAndGenderSet = (communityId: number) => {
  return useQuery({
    queryKey: userKeys.isAgeGenderSet(communityId),
    queryFn: isAgeAndGenderSet,
    enabled: false,
  });
};

export const useSetAgeAndGender = () => {
  return useMutation({
    mutationFn: setAgeAndGender,
  });
};
