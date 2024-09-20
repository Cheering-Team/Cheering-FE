import {useMutation} from '@tanstack/react-query';
import {
  checkCode,
  checkCodeToKakao,
  connectSocial,
  kakaoSignIn,
  naverSignIn,
  sendSMS,
  signIn,
  signUp,
} from './index';

export const useSendSMS = () => {
  return useMutation({mutationFn: sendSMS});
};

export const useCheckCode = () => {
  return useMutation({mutationFn: checkCode});
};

export const useCheckCodeToKakao = () => {
  return useMutation({mutationFn: checkCodeToKakao});
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
