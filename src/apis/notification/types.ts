import {Fan} from 'apis/fan/types';
import {Page} from '../types';
import {PostImageType} from 'apis/post/types';

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
  image: PostImageType;
}

// 요청
export interface ReadNotificationPayload {
  notificationId: number;
}

// 응답
export interface GetNotificationsResponse extends Page {
  notifications: Notification[];
}

export interface IsUnreadResponse {
  isUnread: boolean;
  role: 'USER' | 'ADMIN';
}
