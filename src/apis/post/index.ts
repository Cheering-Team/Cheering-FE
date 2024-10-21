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
  const {communityId, content, tags, images, handleProgress} = data;

  const formData = new FormData();
  formData.append('content', content);
  tags.forEach(tag => formData.append('tags', tag));

  images.forEach(image => {
    formData.append('images', {
      uri: image.uri,
      type: image.type,
      name: image.name,
    });
    formData.append('widthDatas', image.width);
    formData.append(`heightDatas`, image.height);
  });

  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/communities/${communityId}/posts`,
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

// 커뮤니티 게시글 불러오기 (무한 스크롤) (id = 0 -> 내가 모든 커뮤니티 게시글)
export const getPosts = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof postKeys.list>;
  pageParam: number;
}) => {
  const [, , {communityId, filter, type}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetPostsResponse>>(
    `/communities/${communityId}/posts?type=${type}&tag=${
      filter === 'all' ? '' : filter
    }&page=${pageParam}&size=20`,
  );
  return response.data;
};

// 게시글 조회 (무한 스크롤)
export const getFanPosts = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof postKeys.listByFan>;
  pageParam: number;
}) => {
  const [, , {fanId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetPostsResponse>>(
    `/fans/${fanId}/posts?&page=${pageParam}&size=10`,
  );
  return response.data;
};

// 특정 게시글 조회
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

// 게시글 삭제
export const deletePost = async (data: PostIdPayload) => {
  const {postId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/posts/${postId}`,
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

// 데일리 작성
export const writeDaily = async (data: WriteDailyPayload) => {
  const {communityId, content} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/communities/${communityId}/dailys`,
    {content},
  );
  return response.data;
};

// 특정 날짜 데일리 조회
export const getDailys = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof dailyKeys.list>;
  pageParam: number;
}) => {
  const [, , {communityId, date}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetDailysResponse>>(
    `/communities/${communityId}/dailys?date=${date}&page=${pageParam}&size=10`,
  );
  return response.data;
};

// 데일리 수정
export const editDaily = async (data: EditDailyPayload) => {
  const {dailyId, content} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/dailys/${dailyId}`,
    {content},
  );
  return response.data;
};

// 데일리 삭제
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
  const [, , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<string[]>>(
    `/communities/${communityId}/dailys/exist`,
  );

  return response.data;
};
