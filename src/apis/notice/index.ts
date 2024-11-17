import {axiosInstance} from 'apis';
import {ApplyPayload, Notice} from './types';
import {ApiResponse} from 'apis/types';
import {noticeKeys} from './queries';

export const getNotices = async () => {
  const response = await axiosInstance.get<ApiResponse<Notice[]>>('/notices');
  return response.data.result;
};

export const getNoticeById = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof noticeKeys.detail>;
}) => {
  const [, , noticeId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Notice>>(
    `/notices/${noticeId}`,
  );
  return response.data.result;
};
