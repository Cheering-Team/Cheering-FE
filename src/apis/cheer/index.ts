import {axiosInstance} from 'apis/index';
import {
  CheerIdPayload,
  GetCheersResponse,
  LikeCheerPayload,
  WriteCheerPayload,
} from './types';
import {ApiResponse} from 'apis/types';
import {cheerKeys} from './queries';

// 응원 작성
export const writeCheer = async (data: WriteCheerPayload) => {
  const {matchId, communityId, content} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/matches/${matchId}/communities/${communityId}/cheers`,
    {
      content,
    },
  );
  return response.data.result;
};

// 응원 목록 조회
export const getCheers = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof cheerKeys.list>;
  pageParam: number;
}) => {
  const [, , {matchId, communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetCheersResponse>>(
    `/matches/${matchId}/communities/${communityId}/cheers?page=${pageParam}&size=20`,
  );
  return response.data.result;
};

// 응원 삭제
export const deleteCheer = async (data: CheerIdPayload) => {
  const {cheerId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/cheers/${cheerId}`,
  );
  return response.data.result;
};

// 응원 좋아요
export const likeCheer = async (data: LikeCheerPayload) => {
  const {communityId, cheerId} = data;
  const response = await axiosInstance.post<ApiResponse<number>>(
    `/communities/${communityId}/cheers/${cheerId}/likes`,
  );
  return response.data.result;
};

// 응원 좋아요 취소
export const deleteLikeCheer = async (data: LikeCheerPayload) => {
  const {communityId, cheerId} = data;
  const response = await axiosInstance.delete<ApiResponse<number>>(
    `/communities/${communityId}/cheers/${cheerId}/likes`,
  );
  return response.data.result;
};
