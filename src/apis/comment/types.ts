import {Page} from '../types';
import {PlayerUser} from '../user/types';

// 엔티티
export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  reCount: number;
  writer: PlayerUser;
  isWriter: boolean;
}

export interface ReComment {
  id: number;
  content: string;
  createdAt: Date;
  to: PlayerUser;
  wrtier: PlayerUser;
  isWriter: boolean;
}

// 요청
export interface WriteCommentPayload {
  postId: number;
  content: string;
}

export interface WriteReCommentPayload {
  commentId: number;
  content: string;
  toId: number;
}

// 응답
export interface GetCommentsResponse extends Page {
  comments: Comment[];
}

export interface GetReCommentsResponse {
  reComments: ReComment[];
}
