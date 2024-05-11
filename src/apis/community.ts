import {axiosInstance} from '.';
import {Alert} from 'react-native';

export const getCommunitiesSearch = async (query: {name: string}) => {
  const {name} = query;
  try {
    const response = await axiosInstance.get(`/communities?name=${name}`);

    return response.data;
  } catch (error) {
    //
  }
};

// 커뮤니티 메인 화면
export const getCommunitiesMain = async (query: {id: number}) => {
  const {id} = query;
  try {
    const response = await axiosInstance.get(`/communities/${id}`);

    return response.data;
  } catch (error: any) {
    //
  }
};

export const getCommunitiesToPosts = async (query: {id: number}) => {
  const {id} = query;
  try {
    const response = await axiosInstance.get(
      `/communities/${id}/posts?type=USER`,
    );

    return response.data;
  } catch (error) {
    //
  }
};

export const getCommunitiesFromPosts = async (query: {id: number}) => {
  const {id} = query;
  try {
    const response = await axiosInstance.get(
      `/communities/${id}/posts?type=PLAYER`,
    );
    return response.data;
  } catch (error) {
    //
  }
};

//// User-Commnunity

export const postCommunitiesUsers = async (
  query: {id: number},
  data: FormData,
) => {
  const {id} = query;

  try {
    const response = await axiosInstance.post(
      `/communities/${id}/users`,
      data,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response.data.message === 'duplicated join community') {
      Alert.alert('중복된 가입');
    }
  }
};

// 가입된 커뮤니티 목록
export const GetUsersCommunities = async () => {
  try {
    const response = await axiosInstance.get('/users/communities');
    return response.data.data;
  } catch (error) {
    //
  }
};

// 팔로우한 커뮤니티 게시글 조회
export const getMyCommunitiesPosts = async () => {
  try {
    const response = await axiosInstance.get('/communities/posts');

    return response.data;
  } catch (error) {
    //
  }
};
