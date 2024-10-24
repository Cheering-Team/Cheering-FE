import {AxiosProgressEvent} from 'axios';
import {Community} from '../community/types';
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
  images: ImageType[];
  writer: Fan;
}

export interface ImageType {
  path: string;
  fileName?: string;
  localIdentifier?: string;
  width?: number;
  height?: number;
  mime?: string;
  size?: number;
  bucketId?: number;
  realPath?: string;
  parentFolderName?: string;
  creationDate?: string;
  type?: 'IMAGE' | 'VIDEO' | 'image' | 'video';
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

export interface ImagePayload {
  uri: string;
  name: string;
  type: string;
  width?: number;
  height?: number;
}

export interface WritePostPayload {
  communityId: number;
  content: string;
  tags: TagType[];
  images: ImagePayload[];
  handleProgress: (progressEvent: AxiosProgressEvent) => void;
}

export interface EditPostPayload {
  postId: number;
  content: string;
  tags: TagType[];
  images: ImagePayload[];
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

export interface PostLikeResponse {
  isLike: boolean;
  likeCount: number;
}
