import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {navigate} from '../navigations/RootNavigation';

export const axiosInstance = axios.create({
  baseURL: 'http://15.165.150.47/api',
});

axiosInstance.interceptors.request.use(async config => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  const refreshToken = await EncryptedStorage.getItem('refreshToken');

  if (config.url === '/refresh') {
    config.headers['Refresh-Token'] = refreshToken;
  } else {
    config.headers['Access-Token'] = accessToken;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const {config, response} = error;
    if (response.status === 400) {
      return Promise.reject(error.response.data);
    }
    if (response.status === 401) {
      if (response.data.message === 'expired Access-Token') {
        const accessToken = await reIssueToken();

        await EncryptedStorage.setItem('accessToken', `Bearer ${accessToken}`);

        return axiosInstance(config);
      } else if (response.data.message === 'expired Refreh-Token') {
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        navigate('SignOut', null);
      }
    }
    return Promise.reject(error);
  },
);

const reIssueToken = async () => {
  try {
    const response = await axiosInstance.get('/refresh');

    return response.data.data;
  } catch (error) {
    //
  }
};
