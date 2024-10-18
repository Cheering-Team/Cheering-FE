import {AxiosProgressEvent} from 'axios';
import {Community} from '../player/types';
import {Page} from '../types';
import {Fan} from '../user/types';

// 엔티티
export interface Post {
  id: number;
  user: Fan;
  community: Community;
  content: string;
  isHide: boolean;
  createdAt: string;
  tags: string[];
  isLike: boolean;
  likeCount: number;
  commentCount: number;
  images: ImageSizeType[];
  writer: Fan;
}

export interface ImageType {
  uri: string;
  name: string | undefined;
  type: string;
}

export interface ImageSizeType {
  url: string;
  width: number;
  height: number;
  type?: 'IMAGE' | 'VIDEO';
}

export type FilterType = 'all' | 'hot' | 'photo' | 'viewing' | 'information';
export type TagType = 'photo' | 'viewing' | 'information';

// 요청
export interface PostIdPayload {
  postId: number;
}

export interface DailyIdPayload {
  dailyId: number;
}

export interface WritePostPayload {
  communityId: number;
  content: string;
  tags: TagType[];
  images: ImageType[];
  handleProgress: (progressEvent: AxiosProgressEvent) => void;
}

export interface EditPostPayload {
  postId: number;
  content: string;
  tags: TagType[];
  images: ImageType[];
  handleProgress: (progressEvent: AxiosProgressEvent) => void;
}

export interface WriteDailyPayload {
  communityId: number;
  content: string;
}

export interface EditDailyPayload {
  dailyId: number;
  content: string;
}

// 응답
export interface GetPostsResponse extends Page {
  posts: Post[];
}

export interface GetDailysResponse extends Page {
  dailys: Post[];
  isManager: boolean;
  manager: Fan;
}
