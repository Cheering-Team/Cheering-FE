import {axiosInstance} from '../index';
import {ApiResponse} from '../types';
import {
  CheckCodePayload,
  CheckCodeToKakaoPayload,
  ConnectSocialPayload,
  SendSMSPayload,
  SignUpPayload,
  Token,
  TokenPayload,
  User,
} from './types';

export const sendSMS = async (data: SendSMSPayload) => {
  const response = await axiosInstance.post<ApiResponse<User | null>>(
    '/phone/sms',
    data,
  );
  return response.data;
};

export const checkCode = async (data: CheckCodePayload) => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    '/phone/code',
    data,
  );
  return response.data;
};

export const checkCodeToKakao = async (data: CheckCodeToKakaoPayload) => {
  const {accessToken, phone, code} = data;
  const response = await axiosInstance.post<ApiResponse<Token | User>>(
    `/phone/code/kakao?accessToken=${encodeURIComponent(accessToken)}`,
    {phone, code},
  );
  return response.data;
};

export const signIn = async (data: CheckCodePayload) => {
  const formData = new FormData();
  formData.append('phone', data.phone);
  formData.append('code', data.code);
  const response = await axiosInstance.post<ApiResponse<Token>>(
    '/signin',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const signUp = async (data: SignUpPayload) => {
  const response = await axiosInstance.post<ApiResponse<Token>>(
    '/signup',
    data,
  );
  return response.data;
};

export const kakaoSignIn = async (data: TokenPayload) => {
  const {accessToken} = data;
  const response = await axiosInstance.post<ApiResponse<Token | null>>(
    `/signin/kakao?accessToken=${encodeURIComponent(accessToken)}`,
  );
  return response.data;
};

export const naverSignIn = async (data: TokenPayload) => {
  const {accessToken} = data;
  const response = await axiosInstance.post<ApiResponse<Token | User>>(
    `/signin/naver?accessToken=${encodeURIComponent(accessToken)}`,
  );
  return response.data;
};

export const connectSocial = async (data: ConnectSocialPayload) => {
  const {accessToken, type, userId} = data;
  const response = await axiosInstance.post<ApiResponse<Token>>(
    `/connect?accessToken=${encodeURIComponent(accessToken)}&type=${type}`,
    {userId},
  );
  return response.data;
};
