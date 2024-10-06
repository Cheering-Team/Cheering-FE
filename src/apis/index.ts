import axios from 'axios';
import * as RootNavigation from '../navigations/RootNavigation';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';
import {queryClient} from '../../App';
import {showBottomToast} from '../utils/toast';
import {postKeys} from './post/queries';
import {commentKeys, reCommentKeys} from './comment/queries';

export const axiosInstance = axios.create({
  baseURL: 'http://172.30.1.38:8080/api',
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
    const status = response.status;
    const message = response.data.message;

    if (message === '해당 사용자를 찾을 수 없습니다.') {
      await EncryptedStorage.removeItem('accessToken');
      await EncryptedStorage.removeItem('refreshToken');
      RootNavigation.navigate('MoreStack', {screen: 'SignOut'});
      return;
    }

    // 탈퇴처리된 유저 활동중 발생
    if (message === '해당 커뮤니티 유저를 찾을 수 없습니다.') {
      queryClient.invalidateQueries({queryKey: ['my', 'players']});
      queryClient.invalidateQueries({queryKey: postKeys.list(0, 'all')});
      RootNavigation.navigate('HomeStack', {screen: 'Home'});
      showBottomToast(50, '일시적인 오류입니다.');
      return Promise.reject(error);
    }

    // 삭제된 게시글에 대한 활동
    if (message === '존재하지 않는 게시글입니다.') {
      showBottomToast(50, message);
      return Promise.resolve(response);
    }

    // 삭제된 댓글에 대한 활동
    if (message === '존재하지 않는 댓글입니다.') {
      showBottomToast(50, message);
      queryClient.invalidateQueries({queryKey: commentKeys.lists()});
      queryClient.invalidateQueries({queryKey: reCommentKeys.lists()});
      queryClient.invalidateQueries({queryKey: postKeys.details()});
      queryClient.invalidateQueries({queryKey: postKeys.lists()});
      return Promise.reject(error);
    }

    if (message === '토큰이 유효하지 않습니다.') {
      if (config.url === '/refresh') {
        RootNavigation.navigate('MoreStack', {screen: 'SignOut'});
        return;
      } else {
        const data = await reIssueToken();

        const {accessToken, refreshToken} = data.result;

        await EncryptedStorage.setItem('accessToken', accessToken);
        await EncryptedStorage.setItem('refreshToken', refreshToken);

        return axiosInstance(config);
      }
    }
    if (status >= 500) {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '서버에 문제가 발생했습니다.',
        text2: '잠시 후 다시 시도해 주세요.',
      });
    } else if (status >= 400) {
      return Promise.resolve(response);
    }

    return Promise.reject(error);
  },
);

export const reIssueToken = async () => {
  const response = await axiosInstance.get('/refresh');

  return response.data;
};
