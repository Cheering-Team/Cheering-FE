import {axiosInstance} from 'apis';
import {
  Fan,
  FanIdPayload,
  FanProfile,
  UpdateFanImagePayload,
  UpdateFanNamePayload,
} from './types';
import {ApiResponse} from 'apis/types';
import {fanKeys} from './queries';

// 팬 정보 조회
export const getFanInfo = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof fanKeys.detail>;
}) => {
  const [, , fanId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<FanProfile>>(
    `/fans/${fanId}`,
  );
  return response.data.result;
};

// 팬 이미지 변경
export const updateFanImage = async (data: UpdateFanImagePayload) => {
  const {fanId, type, image} = data;

  const formData = new FormData();
  formData.append('dummy', 'dummy');

  if (image) {
    formData.append('image', image);
  }
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/fans/${fanId}/image?type=${type}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data.result;
};

// 팬 이름 변경
export const updateFanName = async (data: UpdateFanNamePayload) => {
  const {fanId, type, name} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/fans/${fanId}/name?type=${type}`,
    {name},
  );
  return response.data.result;
};

// 팬 차단
export const blockFan = async (data: FanIdPayload) => {
  const {fanId} = data;
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/blocks/${fanId}`,
  );
  return response.data.result;
};

// 차단한 팬 목록 조회
export const getBlockedFans = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof fanKeys.blockList>;
}) => {
  const [, , , {fanId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Fan[]>>(
    `/blocks/${fanId}`,
  );
  return response.data.result;
};

// 차단 해제
export const unblockFan = async (data: FanIdPayload) => {
  const {fanId} = data;
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/blocks/${fanId}`,
  );
  return response.data.result;
};
