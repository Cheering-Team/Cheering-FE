import axios from 'axios';
import * as RootNavigation from '../navigations/RootNavigation';
import EncryptedStorage from 'react-native-encrypted-storage';

export const axiosInstance = axios.create({
  baseURL: 'http://172.30.1.47:8080/api',
});

axiosInstance.interceptors.request.use(async config => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  const refreshToken = await EncryptedStorage.getItem('refreshToken');

  if (config.url === '/refresh' && refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  } else if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
      if (response.data.message === '해당 사용자를 찾을 수 없습니다.') {
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        RootNavigation.navigate('SettingStack', {screen: 'SignOut'});
      }
      return Promise.reject(response.data);
    }

    if (response.data.message === '토큰이 유효하지 않습니다.') {
      if (config.url === '/refresh') {
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
        RootNavigation.navigate('SettingStack', {screen: 'SignOut'});
      } else {
        const data = await reIssueToken();

        const {accessToken, refreshToken} = data.result;

        await EncryptedStorage.setItem('accessToken', accessToken);
        await EncryptedStorage.setItem('refreshToken', refreshToken);

        return axiosInstance(config);
      }
    }
    return Promise.reject(error);
  },
);

const reIssueToken = async () => {
  const response = await axiosInstance.get('/refresh');

  return response.data;
};
