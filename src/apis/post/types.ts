import {AxiosProgressEvent} from 'axios';
import {Player} from '../player/types';
import {Page} from '../types';
import {PlayerUser} from '../user/types';

// 엔티티
export interface Post {
  id: number;
  playerUser: PlayerUser;
  player: Player;
  content: string;
  isHide: boolean;
  createdAt: Date;
  tags: string[];
  isLike: boolean;
  likeCount: number;
  commentCount: number;
  images: ImageSizeType[];
  writer: PlayerUser;
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
}

export type FilterType = 'all' | 'hot' | 'photo' | 'viewing' | 'information';
export type TagType = 'photo' | 'viewing' | 'information';

// 요청
export interface PostIdPayload {
  postId: number;
}

export interface WritePostPayload {
  playerId: number;
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

// 응답
export interface GetPostsResponse extends Page {
  posts: Post[];
}
