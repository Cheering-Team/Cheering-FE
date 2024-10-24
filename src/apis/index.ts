import axios from 'axios';
import * as RootNavigation from '../navigations/RootNavigation';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';
import {queryClient} from '../../App';
import {showBottomToast, showTopToast} from '../utils/toast';
import {postKeys} from './post/queries';
import {commentKeys, reCommentKeys} from './comment/queries';
import {Platform} from 'react-native';

export const axiosInstance = axios.create({
  baseURL:
    Platform.OS === 'ios'
      ? 'http://192.168.0.10:8080/api'
      : 'http://10.0.2.2:8080/api',
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
    if (error.response) {
      const statusCode = error.response.status;
      const message = error.response.data?.message;
      if (statusCode === 400) {
        //
      } else if (statusCode === 401) {
        if (message === '토큰이 유효하지 않습니다.') {
          if (error.config.url === '/refresh') {
            RootNavigation.navigate('MoreStack', {screen: 'SignOut'});
            return;
          } else {
            const data = await reIssueToken();
            const {accessToken, refreshToken} = data.result;
            await EncryptedStorage.setItem('accessToken', accessToken);
            await EncryptedStorage.setItem('refreshToken', refreshToken);
            return axiosInstance(error.config);
          }
        }
      } else if (statusCode === 404) {
        if (message === '커뮤니티로부터 제재') {
          RootNavigation.navigate('HomeStack', {screen: 'Home'});
          queryClient.removeQueries();
          showBottomToast(50, '부적절한 사용자');
        }
      } else if (statusCode >= 500) {
        console.error('서버 오류');
        // 서버 오류
      }
    } else {
      // 네트워크 오류
      console.error('네트워크 오류');
    }
    return Promise.reject(error.response.data);
  },
);

export const reIssueToken = async () => {
  const response = await axiosInstance.get('/refresh');

  return response.data;
};
