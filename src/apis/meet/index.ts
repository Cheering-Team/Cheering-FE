import {axiosInstance} from 'apis';
import {ApiResponse, Id} from 'apis/types';
import {CreateMeetPayload, GetMeetsResponse, MeetDetail} from './types';
import {meetKeys} from './queries';

export const createMeet = async (data: CreateMeetPayload) => {
  const {communityId, ...rest} = data;
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/communities/${communityId}/meets`,
    rest,
  );
  return response.data.result;
};

export const getMeetById = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof meetKeys.detail>;
}) => {
  const [, , meedId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<MeetDetail>>(
    `meets/${meedId}`,
  );
  return response.data.result;
};

export const getAllMeetsByCommunity = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: ReturnType<typeof meetKeys.list>;
  pageParam: number;
}) => {
  const [
    ,
    ,
    {communityId, type, gender, minAge, maxAge, ticketOption, matchId, keyword},
  ] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetMeetsResponse>>(
    `/communities/${communityId}/meets?type=${type}&gender=${gender}&minAge=${minAge}&maxAge=${maxAge}&ticketOption=${ticketOption}${matchId ? `&matchId=${matchId}` : ''}&keyword=${keyword}&page=${pageParam}&size=20`,
  );
  return response.data.result;
};
