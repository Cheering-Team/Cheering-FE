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

export const getPosts = async ({queryKey}) => {
  let [_key, playerId, selectedFilter] = queryKey;

  if (selectedFilter === 'all') {
    selectedFilter = '';
  }

  const response = await axiosInstance.get(
    `/players/${playerId}/posts?tag=${selectedFilter}`,
  );

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

// // 커뮤니티 게시글 작성
// export const postCommunitiesPosts = async (
//   query: {id: number},
//   data: FormData,
// ) => {
//   const {id} = query;
//   try {
//     const response = await axiosInstance.post(
//       `/communities/${id}/posts`,
//       data,
//       {
//         headers: {
//           'content-type': 'multipart/form-data',
//         },
//       },
//     );

//     return response.data;
//   } catch (error: any) {}
// };

// // 커뮤니티 게시글 상세
// export const getCommunitiesPosts = async (query: {
//   communityId: number;
//   postId: number;
// }) => {
//   const {communityId, postId} = query;
//   try {
//     const response = await axiosInstance.get(
//       `/communities/${communityId}/posts/${postId}`,
//     );

//     return response.data;
//   } catch (error) {
//     //
//   }
// };

// // 댓글 작성
// export const postComments = async (
//   query: {communityId: number; postId: number},
//   data: {content: string},
// ) => {
//   const {communityId, postId} = query;
//   try {
//     const response = await axiosInstance.post(
//       `/communities/${communityId}/posts/${postId}/comments`,
//       data,
//     );

//     return response.data;
//   } catch (error: any) {
//     //
//     console.log(JSON.stringify(error.response));
//   }
// };

// // 댓글 조회
// export const getComments = async (query: {
//   communityId: number;
//   postId: number;
// }) => {
//   const {communityId, postId} = query;
//   try {
//     const response = await axiosInstance.get(
//       `/communities/${communityId}/posts/${postId}/comments`,
//     );

//     return response.data;
//   } catch (error: any) {
//     //
//   }
// };

// // 답글 작성
// export const postRecomments = async (
//   query: {communityId: number; postId: number; commentId: number},
//   data: {content: string},
// ) => {
//   const {communityId, postId, commentId} = query;
//   try {
//     const response = await axiosInstance.post(
//       `/communities/${communityId}/posts/${postId}/comments/${commentId}/recomments`,
//       data,
//     );

//     return response.data;
//   } catch (error: any) {
//     //
//     console.log(JSON.stringify(error.response));
//   }
// };

// // 답글 조회
// export const getRecomments = async (query: {
//   communityId: number;
//   postId: number;
//   commentId: number;
// }) => {
//   const {communityId, postId, commentId} = query;
//   try {
//     const response = await axiosInstance.get(
//       `/communities/${communityId}/posts/${postId}/comments/${commentId}/recomments`,
//     );

//     return response.data;
//   } catch (error: any) {
//     //
//   }
// };

// // 게시글 좋아요
// export const getPostsLike = async (query: {
//   communityId: number;
//   postId: number;
// }) => {
//   const {communityId, postId} = query;
//   try {
//     const response = await axiosInstance.post(
//       `/communities/${communityId}/posts/${postId}/like`,
//     );

//     return response.data;
//   } catch (error: any) {
//     //
//   }
// };
