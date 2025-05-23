import {axiosInstance} from '../index';
import {ApiResponse} from '../types';
import {
  AgeGender,
  CheckCodePayload,
  CheckCodeSocialPayload,
  ConnectSocialPayload,
  DeleteFCMTokenPayload,
  RegisterManagerAccountPayload,
  SaveFCMTokenPayload,
  SendSMSPayload,
  SetAgeAndGenderPayload,
  SignUpPayload,
  Token,
  TokenPayload,
  UpdateUserNamePayload,
  User,
  VersionInfo,
} from './types';
import {userKeys} from './queries';

export const sendSMS = async (data: SendSMSPayload) => {
  const response = await axiosInstance.post<ApiResponse<User | null>>(
    '/phone/sms',
    data,
  );
  return response.data.result;
};

export const checkCode = async (data: CheckCodePayload) => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    '/phone/code',
    data,
  );
  return response.data.result;
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
  return response.data.result;
};

export const signUp = async (data: SignUpPayload) => {
  const response = await axiosInstance.post<ApiResponse<Token>>(
    '/signup',
    data,
  );
  return response.data.result;
};

export const kakaoSignIn = async (data: TokenPayload) => {
  const {accessToken} = data;
  const response = await axiosInstance.post<ApiResponse<Token>>(
    '/signin/kakao',
    {accessToken},
  );
  return response.data.result;
};

export const naverSignIn = async (data: TokenPayload) => {
  const {accessToken} = data;
  const response = await axiosInstance.post<ApiResponse<Token>>(
    `/signin/naver`,
    {accessToken},
  );
  return response.data.result;
};

export const appleSignIn = async (data: TokenPayload) => {
  const {accessToken, name} = data;
  const response = await axiosInstance.post<ApiResponse<Token>>(
    '/signin/apple',
    {accessToken, name},
  );
  return response.data.result;
};

export const checkCodeSocial = async (data: CheckCodeSocialPayload) => {
  const {accessToken, phone, code, type} = data;
  const response = await axiosInstance.post<ApiResponse<Token | User>>(
    `/phone/code/social?type=${type}`,
    {accessToken, phone, code},
  );
  return response.data;
};

export const connectSocial = async (data: ConnectSocialPayload) => {
  const {accessToken, type, userId} = data;
  const response = await axiosInstance.post<ApiResponse<Token>>(
    `/connect?&type=${type}`,
    {accessToken, userId},
  );
  return response.data.result;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get<ApiResponse<User>>('/users');
  return response.data.result;
};

export const updateUserName = async (data: UpdateUserNamePayload) => {
  const response = await axiosInstance.put<ApiResponse<null>>(
    '/users/name',
    data,
  );
  return response.data.result;
};

export const deleteUser = async () => {
  const response = await axiosInstance.delete<ApiResponse<null>>('/users');
  return response.data.result;
};

export const saveFCMToken = async (data: SaveFCMTokenPayload) => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    '/fcm-token',
    data,
  );
  return response.data;
};

export const deleteFCMToken = async (data: DeleteFCMTokenPayload) => {
  const {deviceId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/fcm-token?deviceId=${deviceId}`,
  );
  return response.data;
};

export const registerManagerAccount = async (
  data: RegisterManagerAccountPayload,
) => {
  const {communityId, phone} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/users/manager/${communityId}`,
    {phone},
  );
  return response.data.result;
};

export const getPlayerAccount = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof userKeys.playerAccount>;
}) => {
  const [, , playerId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<SendSMSPayload | null>>(
    `/users/manager/${playerId}`,
  );
  return response.data.result;
};

export const reissuePlayerAccountPassword = async (
  data: RegisterManagerAccountPayload,
) => {
  const {communityId: playerId, phone} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/users/manager/${playerId}`,
    {phone},
  );
  return response.data.result;
};

export const isFirstLogin = async () => {
  const response =
    await axiosInstance.get<ApiResponse<boolean>>(`/isFirstLogin`);
  return response.data.result;
};

export const getVersionInfo = async () => {
  const response =
    await axiosInstance.get<ApiResponse<VersionInfo>>('/version');
  return response.data.result;
};

export const isAgeAndGenderSet = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof userKeys.isAgeGenderSet>;
}) => {
  const [, , communityId] = queryKey;
  const response = await axiosInstance.get<
    ApiResponse<'NEITHER' | 'NULL_PROFILE' | 'BOTH'>
  >(`/users/communities/${communityId}/check-profile`);
  return response.data.result;
};

export const setAgeAndGender = async (data: SetAgeAndGenderPayload) => {
  const {communityId, ...rest} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/users/communities/${communityId}/set-profile`,
    rest,
  );
  return response.data.result;
};

export const getAgeAndGender = async () => {
  const response =
    await axiosInstance.get<ApiResponse<AgeGender>>(`/users/age-gender`);
  return response.data.result;
};
