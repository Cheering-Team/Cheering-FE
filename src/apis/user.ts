import {axiosInstance} from '.';

interface updateUserNikcnameRequest {
  nickname: string;
}

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
