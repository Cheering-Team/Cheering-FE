import {axiosInstance} from '..';
import {ApiResponse, Id} from '../types';
import {
  Comment,
  GetCommentsResponse,
  GetReCommentsResponse,
  ReComment,
  WriteCommentPayload,
  WriteReCommentPayload,
} from './types';
import {commentKeys, reCommentKeys} from './queries';

interface postReCommentsRequest {
  commentId: number | null;
  content: string;
  toId: number;
}

//// 댓글

// 댓글 작성
export const writeComment = async (data: WriteCommentPayload) => {
  const {postId, content} = data;
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/posts/${postId}/comments`,
    {
      content,
    },
  );
  return response.data;
};

// 댓글 불러오기 (무한 스크롤)
export const getComments = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof commentKeys.list>;
  pageParam: number;
}) => {
  const [, , {postId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetCommentsResponse>>(
    `/posts/${postId}/comments?page=${pageParam}&size=15`,
  );
  return response.data;
};

export const deleteComment = async data => {
  const {commentId} = data;

  const response = await axiosInstance.delete(`/comments/${commentId}`);

  return response.data;
};

export const reportComment = async ({commentId}) => {
  const response = await axiosInstance.post(`/comments/${commentId}/reports`);

  return response.data;
};

//// 답글

// 답글 작성
export const writeReComment = async (data: WriteReCommentPayload) => {
  const {commentId, content, toId} = data;
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/comments/${commentId}/re`,
    {
      content,
      toId,
    },
  );
  return response.data;
};

// 답글 불러오기
export const getReComments = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof reCommentKeys.list>;
}) => {
  const [, , {commentId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetReCommentsResponse>>(
    `/comments/${commentId}/re`,
  );
  return response.data;
};

export const deleteReComment = async data => {
  const {reCommentId} = data;

  const response = await axiosInstance.delete(`/reComments/${reCommentId}`);

  return response.data;
};

export const reportReComment = async ({reCommentId}) => {
  const response = await axiosInstance.post(
    `/reComments/${reCommentId}/reports`,
  );

  return response.data;
};
