import {axiosInstance} from '..';
import {ApiResponse} from '../types';
import {GetNotificationsResponse} from './types';

// 알림 불러오기
export const getNotifications = async ({
  pageParam = 0,
}: {
  pageParam: number;
}) => {
  const response = await axiosInstance.get<
    ApiResponse<GetNotificationsResponse>
  >(`/notifications?page=${pageParam}&size=20`);
  return response.data;
};
