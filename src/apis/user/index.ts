import {axiosInstance} from '../index';
import {ApiResponse} from '../types';
import {
  CheckCodePayload,
  CheckCodeSocialPayload,
  ConnectSocialPayload,
  SaveFCMTokenPayload,
  SendSMSPayload,
  SignUpPayload,
  Token,
  TokenPayload,
  UpdateUserNicknamePayload,
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
  const response = await axiosInstance.post<ApiResponse<Token | null>>(
    `/signin/naver?accessToken=${encodeURIComponent(accessToken)}`,
  );
  return response.data;
};

export const checkCodeSocial = async (data: CheckCodeSocialPayload) => {
  const {accessToken, phone, code, type} = data;
  const response = await axiosInstance.post<ApiResponse<Token | User>>(
    `/phone/code/social?accessToken=${encodeURIComponent(accessToken)}&type=${type}`,
    {phone, code},
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

export const getUserInfo = async () => {
  const response = await axiosInstance.get<ApiResponse<User>>('/users');
  return response.data;
};

export const updateUserNickname = async (data: UpdateUserNicknamePayload) => {
  const response = await axiosInstance.put<ApiResponse<null>>(
    '/users/nickname',
    data,
  );
  return response.data;
};

export const deleteUser = async () => {
  const response = await axiosInstance.delete<ApiResponse<null>>('/users');
  return response.data;
};

export const saveFCMToken = async (data: SaveFCMTokenPayload) => {
  const {token} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/fcm-token?token=${encodeURIComponent(token)}`,
    data,
  );
  return response.data;
};

export const deleteFCMToken = async () => {
  const response = await axiosInstance.delete<ApiResponse<null>>('/fcm-token');
  return response.data;
};
