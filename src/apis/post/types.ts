import {AxiosProgressEvent} from 'axios';
import {Page} from '../types';
import {Community} from 'apis/community/types';
import {Fan} from 'apis/fan/types';
import {Vote} from 'apis/vote/types';

// 엔티티
export interface Post {
  id: number;
  community: Community;
  content: string;
  isHide: boolean;
  createdAt: string;
  isLike: boolean;
  likeCount: number;
  commentCount: number;
  images: PostImageType[];
  writer: Fan;
  user: Fan;
  vote: Vote;
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
  type?: string;
}

export interface PostImageType {
  path: string;
  width: number;
  height: number;
  type: string;
}

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

export interface VotePayload {
  id?: number;
  title: string;
  endTime: Date;
  matchId: number | null;
  options: VoteOptionPayload[];
}

export interface VoteOptionPayload {
  name: string;
  image: string | null;
  backgroundImage: string | null;
  communityId: number | null;
}

export interface WritePostPayload {
  communityId: number;
  content: string;
  tags: TagType[];
  images: ImagePayload[];
  vote: VotePayload | null;
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
