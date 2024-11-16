import axios from 'axios';
import * as RootNavigation from '../navigations/RootNavigation';
import EncryptedStorage from 'react-native-encrypted-storage';
import {queryClient} from '../../App';
import {showTopToast} from '../utils/toast';
import {Platform} from 'react-native';

export const axiosInstance = axios.create({
  baseURL:
    Platform.OS === 'ios'
      ? 'http://192.168.0.16:8080/api'
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
      const errorCode = error.response.data?.code;
      const message = error.response.data?.message;
      if (statusCode === 400) {
        if (errorCode === 2002) {
          showTopToast({
            type: 'fail',
            message: '인증번호 만료',
          });
        }
        if (errorCode === 2004) {
          showTopToast({
            type: 'fail',
            message: '부적절한 단어가 포함되어있어요',
          });
        }
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
          showTopToast({type: 'fail', message: '부적절한 사용자'});
        }
        if (message === '존재하지 않는 게시글') {
          showTopToast({
            type: 'fail',
            message: '삭제된 글입니다',
          });
        }
        if (message === '존재하지 않는 댓글') {
          showTopToast({
            type: 'fail',
            message: '삭제된 댓글입니다',
          });
        }
        if (message === '존재하지 않는 채팅방') {
          showTopToast({
            type: 'fail',
            message: '채팅방이 삭제됐어요',
          });
        }
        if (message === '존재하지 않는 경기') {
          showTopToast({
            type: 'fail',
            message: '취소된 경기입니다',
          });
        }
        if (message === '존재하지 않는 공지사항') {
          showTopToast({
            type: 'fail',
            message: '공지사항이 삭제됐어요',
          });
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
