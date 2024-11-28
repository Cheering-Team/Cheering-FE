import {axiosInstance} from 'apis';
import {voteKeys} from './queries';
import {ApiResponse} from 'apis/types';
import {Vote, VoteOptionIdPayload} from './types';

export const getVote = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof voteKeys.detail>;
}) => {
  const [, , {postId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Vote | null>>(
    `/posts/${postId}/votes`,
  );
  return response.data.result;
};

export const vote = async (data: VoteOptionIdPayload) => {
  const {voteOptionId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/votes/${voteOptionId}`,
  );
  return response.data.result;
};
