import {ImageSizeType} from '../post/types';
import {Page} from '../types';
import {PlayerUser} from '../user/types';

// 엔티티
export interface Notification {
  id: number;
  type: 'LIKE';
  from: PlayerUser;
  to: PlayerUser;
  count: number;
  post: NotificationPost;
  content: string;
}

export interface NotificationPost {
  id: number;
  image: ImageSizeType;
}

// 응답
export interface GetNotificationsResponse extends Page {
  notifications: Notification[];
}
