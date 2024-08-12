import {axiosInstance} from '.';
import {Image} from './player';

interface postPlayersPostsRequest {
  playerId: number;
  content: string;
  tags: string[];
  images: Image[];
}

interface postPostsLikesRequest {
  postId: number;
}

interface postCommentsRequest {
  postId: number;
  content: string;
}

interface postReCommentsRequest {
  commentId: number | null;
  content: string;
  toId: number;
}

interface updatePostRequest {
  postId: number;
  content: string;
  tags: string[];
  images: Image[];
}

export const postPlayersPosts = async (data: postPlayersPostsRequest) => {
  const {playerId, content, tags, images} = data;

  const formData = new FormData();

  formData.append('content', content);

  tags.forEach(tag => formData.append('tags', tag));
  images.forEach(image => formData.append('images', image));

  const response = await axiosInstance.post(
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

export const getPosts = async ({pageParam, queryKey}) => {
  let [_key, playerId, selectedFilter] = queryKey;

  if (selectedFilter === 'all') {
    selectedFilter = '';
  }

  const response = await axiosInstance.get(
    `/players/${playerId}/posts?tag=${selectedFilter}&page=${pageParam}&size=5`,
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

export const getPostById = async ({queryKey}) => {
  const [_key, postId] = queryKey;

  const response = await axiosInstance.get(`/posts/${postId}`);

  return response.data;
};

export const postPostsLikes = async (data: postPostsLikesRequest) => {
  const {postId} = data;

  const response = await axiosInstance.post(`/posts/${postId}/likes`);

  return response.data;
};

export const postComments = async (data: postCommentsRequest) => {
  const {postId, content} = data;

  const response = await axiosInstance.post(`/posts/${postId}/comments`, {
    content,
  });

  return response.data;
};

export const getComments = async ({queryKey}) => {
  const [_key, postId] = queryKey;

  const response = await axiosInstance.get(`/posts/${postId}/comments`);

  return response.data;
};

export const postReComments = async (data: postReCommentsRequest) => {
  const {commentId, content, toId} = data;

  const response = await axiosInstance.post(`/comments/${commentId}/re`, {
    content,
    toId,
  });

  return response.data;
};

export const getReComments = async ({queryKey}) => {
  const [_key, commentId] = queryKey;

  const response = await axiosInstance.get(`/comments/${commentId}/re`);

  return response.data;
};

export const updatePost = async (data: updatePostRequest) => {
  const {postId, content, tags, images} = data;

  const formData = new FormData();

  formData.append('content', content);

  tags.forEach(tag => formData.append('tags', tag));
  images.forEach(image => formData.append('images', image));

  const response = await axiosInstance.put(`/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deletePost = async data => {
  const {postId} = data;

  const response = await axiosInstance.delete(`/posts/${postId}`);

  return response.data;
};
