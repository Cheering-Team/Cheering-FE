import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {Meet} from './types';

export const getMeetById = async () => {
  const response = await axiosInstance.get<ApiResponse<Meet>>(`meets/${1}`);
  return response.data.result;
};
