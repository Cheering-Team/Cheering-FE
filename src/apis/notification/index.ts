import {axiosInstance} from '../index';
import {ApiResponse} from '../types';
import {GetNotificationsResponse, ReadNotificationPayload} from './types';

// 알림 불러오기
export const getNotifications = async ({
  pageParam = 0,
}: {
  pageParam: number;
}) => {
  const response = await axiosInstance.get<
    ApiResponse<GetNotificationsResponse>
  >(`/notifications?page=${pageParam}&size=20`);
  return response.data.result;
};

// 알림 여부 확인
export const getIsUnread = async () => {
  const response = await axiosInstance.get<ApiResponse<boolean>>(
    '/notifications/is-unread',
  );
  return response.data.result;
};

// 알림 읽기
export const readNotification = async (data: ReadNotificationPayload) => {
  const {notificationId} = data;
  const response = await axiosInstance.put<ApiResponse<null>>(
    `/notifications/${notificationId}`,
  );
  return response.data.result;
};
