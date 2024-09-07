import {axiosInstance} from '..';
import {Image} from '../player';
import {ApiResponse, Id} from '../types';
import {postKeys} from './queries';
import {
  EditPostPayload,
  GetPostsResponse,
  LikePostPayload,
  Post,
  WritePostPayload,
} from './types';

// 게시글 작성
export const writePost = async (data: WritePostPayload) => {
  const {playerId, content, tags, images} = data;

  const formData = new FormData();
  formData.append('content', content);
  tags.forEach(tag => formData.append('tags', tag));
  images.forEach(image => formData.append('images', image));

  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/players/${playerId}/posts`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 게시글 목록 불러오기 (무한 스크롤)
export const getPosts = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof postKeys.list>;
  pageParam: number;
}) => {
  let [, , {playerId, filter}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetPostsResponse>>(
    `/players/${playerId}/posts?tag=${
      filter === 'all' ? '' : filter
    }&page=${pageParam}&size=5`,
  );
  return response.data;
};

export const getMyPlayersPosts = async ({pageParam, queryKey}) => {
  let [_key1, _key2, hotTab] = queryKey;

  let response;

  if (hotTab === 0) {
    response = await axiosInstance.get(
      `my/players/posts?page=${pageParam}&size=5`,
    );
  } else {
    response = await axiosInstance.get(
      `/players/${hotTab}/posts?tag=&page=${pageParam}&size=5`,
    );
  }

  return response.data;
};

// 게시글 불러오기
export const getPostById = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof postKeys.detail>;
}) => {
  const [, , postId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Post>>(
    `/posts/${postId}`,
  );
  return response.data;
};

// 게시글 좋아요 토글
export const likePost = async (data: LikePostPayload) => {
  const {postId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/posts/${postId}/likes`,
  );
  return response.data;
};

// 게시글 수정
export const editPost = async (data: EditPostPayload) => {
  const {postId, content, tags, images} = data;

  const formData = new FormData();
  formData.append('content', content);
  tags.forEach(tag => formData.append('tags', tag));
  images.forEach(image => formData.append('images', image));

  const response = await axiosInstance.put<ApiResponse<null>>(
    `/posts/${postId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const reportPost = async ({postId}) => {
  const response = await axiosInstance.post(`/posts/${postId}/reports`);

  return response.data;
};

export const deletePost = async data => {
  const {postId} = data;

  const response = await axiosInstance.delete(`/posts/${postId}`);

  return response.data;
};
