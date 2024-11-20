import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {Apply, ApplyCommunityPayload, ApplyIdPayload} from './types';

export const applyCommunity = async (data: ApplyCommunityPayload) => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/apply/community`,
    data,
  );
  return response.data.result;
};

export const getCommunityApplies = async () => {
  const response =
    await axiosInstance.get<ApiResponse<Apply[]>>('/apply/community');
  return response.data.result;
};

export const deleteApply = async (data: ApplyIdPayload) => {
  const {applyId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/apply/${applyId}`,
  );
  return response.data.result;
};
