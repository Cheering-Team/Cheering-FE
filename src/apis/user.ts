import {axiosInstance} from '.';

export interface User {
  id: number;
  phone: string;
  nickname: string;
}

interface postPhoneSMSRequest {
  phone: string;
}

interface postPhoneCodeRequest {
  phone: string;
  code: string;
}

interface postSignupRequest {
  phone: string;
  nickname: string;
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

// export const postEmail = async (data: postEmailRequest) => {
//   const response = await axiosInstance.post('/email', data);
//   return response;
// };

// export const postSignin = async (data: postSigninRequest) => {
//   try {
//     const response = await axiosInstance.post('/signin', data);
//     return response;
//   } catch (error) {
//     //
//   }
// };
