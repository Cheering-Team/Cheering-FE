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

export const getMeetById = async () => {
  const response = await axiosInstance.get<ApiResponse<MeetDetail>>(
    `meets/${1}`,
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
  const [, , {communityId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<GetMeetsResponse>>(
    `/communities/${communityId}/meets?page=${pageParam}&size=20`,
  );
  console.log(response.data.result);
  return response.data.result;
};
