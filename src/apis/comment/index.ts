import {axiosInstance} from '../index';
import {ApiResponse, Id} from '../types';
import {
  Comment,
  CommentIdPayload,
  GetCommentsResponse,
  ReComment,
  ReCommentIdPayload,
  ReportCommentPayload,
  ReportReCommentPayload,
  WriteCommentPayload,
  WriteReCommentPayload,
} from './types';
import {commentKeys, reCommentKeys} from './queries';

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
  return response.data.result;
};

// 댓글 목록 조회 (무한 스크롤)
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
  return response.data.result;
};

// 댓글 삭제
export const deleteComment = async (data: CommentIdPayload) => {
  const {commentId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/comments/${commentId}`,
  );
  return response.data.result;
};

// 댓글 신고
export const reportComment = async (data: ReportCommentPayload) => {
  const {postId, commentId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `posts/${postId}/comments/${commentId}/reports`,
  );
  return response.data;
};

// 랜덤 댓글 불러오기
export const getRandomComment = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof commentKeys.random>;
}) => {
  const [, , {postId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Comment | null>>(
    `/posts/${postId}/random-comments`,
  );
  return response.data.result;
};

//// 답글

// 답글 작성
export const writeReComment = async (data: WriteReCommentPayload) => {
  const {postId, commentId, content, toId} = data;
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `posts/${postId}/comments/${commentId}/re`,
    {
      content,
      toId,
    },
  );
  return response.data.result;
};

// 답글 불러오기
export const getReComments = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof reCommentKeys.list>;
}) => {
  const [, , {commentId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<ReComment[]>>(
    `/comments/${commentId}/re`,
  );
  return response.data.result;
};

// 답글 삭제
export const deleteReComment = async (data: ReCommentIdPayload) => {
  const {reCommentId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/reComments/${reCommentId}`,
  );
  return response.data.result;
};

// 답글 신고
export const reportReComment = async (data: ReportReCommentPayload) => {
  const {postId, reCommentId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/posts/${postId}/reComments/${reCommentId}/reports`,
  );
  return response.data.result;
};
