import {axiosInstance} from 'apis';
import {ApplyPayload, Notice} from './types';
import {ApiResponse} from 'apis/types';
import {noticeKeys} from './queries';

export const getNotices = async () => {
  const response = await axiosInstance.get<ApiResponse<Notice[]>>('/notices');
  return response.data;
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
  return response.data;
};

export const apply = async (data: ApplyPayload) => {
  const {field1, field2, field3, field4, image} = data;

  const formData = new FormData();
  formData.append('field1', field1);
  formData.append('field2', field2);
  formData.append('field3', field3);
  formData.append('field4', field4);
  formData.append('image', image);

  const response = await axiosInstance.post<ApiResponse<null>>(
    '/applies',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
