import {axiosInstance} from 'apis';
import {ApiResponse, Id} from 'apis/types';
import {CreateMeetPayload, Meet} from './types';

export const getMeetById = async () => {
  const response = await axiosInstance.get<ApiResponse<Meet>>(`meets/${1}`);
  return response.data.result;
};

export const createMeet = async (data: CreateMeetPayload) => {
  const {communityId, ...rest} = data;
  const response = await axiosInstance.post<ApiResponse<Id>>(
    `/communities/${communityId}/meets`,
    rest,
  );
  return response.data.result;
};
