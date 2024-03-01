import {axiosInstance} from '.';

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

export const postEmail = async (data: postEmailRequest) => {
  try {
    const response = await axiosInstance.post('/email', data);
    return response;
  } catch (error) {
    //
  }
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
