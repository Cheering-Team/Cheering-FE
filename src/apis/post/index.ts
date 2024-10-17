import {axiosInstance} from '../index';
import {ApiResponse, Id} from '../types';
import {dailyKeys, postKeys} from './queries';
import {
  DailyIdPayload,
  EditDailyPayload,
  EditPostPayload,
  GetDailysResponse,
  GetPostsResponse,
  Post,
  PostIdPayload,
  WriteDailyPayload,
  WritePostPayload,
} from './types';

// 게시글 작성
export const writePost = async (data: WritePostPayload) => {
  const {playerId, content, tags, images, handleProgress} = data;

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
      onUploadProgress: progressEvent => {
        handleProgress(progressEvent);
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
  const [, , {playerId, filter}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetPostsResponse>>(
    `/players/${playerId}/posts?tag=${
      filter === 'all' ? '' : filter
    }&page=${pageParam}&size=10`,
  );
  return response.data;
};

// 유저 게시글 불러오기 (무한 스크롤)
export const getPlayerUserPosts = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof postKeys.list>;
  pageParam: number;
}) => {
  const [, , {playerUserId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetPostsResponse>>(
    `/playerusers/${playerUserId}/posts?page=${pageParam}&size=10`,
  );
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
export const likePost = async (data: PostIdPayload) => {
  const {postId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/posts/${postId}/likes`,
  );
  return response.data;
};

// 게시글 수정
export const editPost = async (data: EditPostPayload) => {
  const {postId, content, tags, images, handleProgress} = data;

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
      onUploadProgress: progressEvent => {
        handleProgress(progressEvent);
      },
    },
  );
  return response.data;
};

// 게시글 신고
export const reportPost = async (data: PostIdPayload) => {
  const {postId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/posts/${postId}/reports`,
  );
  return response.data;
};

// 게시글 삭제
export const deletePost = async (data: PostIdPayload) => {
  const {postId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/posts/${postId}`,
  );
  return response.data;
};

// 데일리 작성
export const writeDaily = async (data: WriteDailyPayload) => {
  const {playerId, content} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/players/${playerId}/dailys`,
    {content},
  );
  return response.data;
};

// 데일리 불러오기
export const getDailys = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof dailyKeys.list>;
  pageParam: number;
}) => {
  const [, , {playerId, date}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetDailysResponse>>(
    `/players/${playerId}/dailys?date=${date}&page=${pageParam}&size=10`,
  );
  return response.data;
};

// 데일리 수정하기
export const editDaily = async (data: EditDailyPayload) => {
  const {dailyId, content} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/dailys/${dailyId}`,
    {content},
  );
  return response.data;
};

// 데일리 삭제하기
export const deleteDaily = async (data: DailyIdPayload) => {
  const {dailyId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/dailys/${dailyId}`,
  );
  return response.data;
};

// 데일리 유무 로드
export const getDailyExist = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof dailyKeys.exist>;
}) => {
  const [, , {playerId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<string[]>>(
    `/players/${playerId}/dailys/exist`,
  );
  return response.data;
};
