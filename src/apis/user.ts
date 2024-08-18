import {axiosInstance} from '.';

interface postPhoneSMSRequest {
  phone: string;
}

interface postPhoneCodeRequest {
  phone: string;
  code: string;
}

interface postKakaoPhoneCodeRequest {
  accessToken: string;
  phone: string;
  code: string;
}

interface postSignupRequest {
  phone: string;
  nickname: string;
}

interface updateUserNikcnameRequest {
  nickname: string;
}

interface siginWithKakaoRequest {
  accessToken: string;
}

interface postConnectKakaoRequest {
  accessToken: string;
  userId: number;
}

export const getTest = async () => {
  const response = await axiosInstance.get('/token');
  return response.data;
};

export const postPhoneSMS = async (data: postPhoneSMSRequest) => {
  const response = await axiosInstance.post('/phone/sms', data);
  return response.data;
};

export const postPhoneCode = async (data: postPhoneCodeRequest) => {
  const response = await axiosInstance.post('/phone/code', data);
  return response.data;
};

export const postSignin = async (data: postPhoneCodeRequest) => {
  const formData = new FormData();
  formData.append('phone', data.phone);
  formData.append('code', data.code);
  const response = await axiosInstance.post('/signin', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const postSignup = async (data: postSignupRequest) => {
  const response = await axiosInstance.post('/signup', data);
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get('/users');

  return response.data;
};

export const updateUserNickname = async (data: updateUserNikcnameRequest) => {
  const response = await axiosInstance.put('/users/nickname', data);

  return response.data;
};

export const deleteUser = async () => {
  const response = await axiosInstance.delete('/users');
  return response.data;
};

export const siginWithKakao = async (data: siginWithKakaoRequest) => {
  const {accessToken} = data;
  const response = await axiosInstance.post(
    `/signin/kakao?accessToken=${accessToken}`,
  );
  return response.data;
};

export const postKakaoPhoneCode = async (data: postKakaoPhoneCodeRequest) => {
  const {accessToken, phone, code} = data;
  const response = await axiosInstance.post(
    `/phone/code/kakao?accessToken=${accessToken}`,
    {phone, code},
  );
  return response.data;
};

export const connectKakao = async (data: postConnectKakaoRequest) => {
  const {accessToken, userId} = data;
  const response = await axiosInstance.post(
    `/connect/kakao?accessToken=${accessToken}`,
    {userId},
  );
  return response.data;
};
