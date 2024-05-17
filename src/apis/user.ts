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

interface postEmailRequest {
  email: string;
}

interface postSignupRequest {
  email: string;
  nickName: string;
  password: string;
  passwordConfirm: string;
}

interface postSigninRequest {
  email: string;
  password: string;
}

export const postPhoneSMS = async (data: postPhoneSMSRequest) => {
  const response = await axiosInstance.post('/phone/sms', data);
  return response.data;
};

export const postPhoneCode = async (data: postPhoneCodeRequest) => {
  const response = await axiosInstance.post('/phone/code', data);
  return response.data;
};

export const postEmail = async (data: postEmailRequest) => {
  const response = await axiosInstance.post('/email', data);
  return response;
};

export const postSignup = async (data: postSignupRequest) => {
  try {
    const response = await axiosInstance.post('/signup', data);
    return response;
  } catch (error) {
    //
  }
};

export const postSignin = async (data: postSigninRequest) => {
  try {
    const response = await axiosInstance.post('/signin', data);
    return response;
  } catch (error) {
    //
  }
};
