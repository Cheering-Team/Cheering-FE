import {axiosInstance} from 'apis';
import {voteKeys} from './queries';
import {ApiResponse} from 'apis/types';
import {Vote, VoteOptionIdPayload} from './types';

export const vote = async (data: VoteOptionIdPayload) => {
  const {voteOptionId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/votes/${voteOptionId}`,
  );
  return response.data.result;
};

export const getHotVote = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof voteKeys.hot>;
}) => {
  const [, , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Vote | null>>(
    `/communities/${communityId}/votes/hot`,
  );
  return response.data.result;
};
