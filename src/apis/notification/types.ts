import {ImageSizeType} from '../post/types';
import {Page} from '../types';
import {Fan} from '../user/types';

// 엔티티
export interface Notification {
  id: number;
  type: 'LIKE';
  from: Fan;
  to: Fan;
  count: number;
  post: NotificationPost;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationPost {
  id: number;
  image: ImageSizeType;
}

// 요청
export interface ReadNotificationPayload {
  notificationId: number;
}

// 응답
export interface GetNotificationsResponse extends Page {
  notifications: Notification[];
}
