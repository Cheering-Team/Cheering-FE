import {Page} from '../types';
import {Fan} from '../user/types';

// 엔티티
export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  reCount: number;
  writer: Fan;
  isWriter: boolean;
  status?: 'temp';
}

export interface ReComment {
  id: number;
  content: string;
  createdAt: Date;
  to: Fan;
  writer: Fan;
  isWriter: boolean;
  status?: 'temp';
}

// 요청
export interface CommentIdPayload {
  commentId: number;
}

export interface ReCommentIdPayload {
  reCommentId: number;
}

export interface ReportCommentPayload {
  postId: number;
  commentId: number;
}

export interface ReportReCommentPayload {
  postId: number;
  reCommentId: number;
}

export interface WriteCommentPayload {
  postId: number;
  content: string;
}

export interface WriteReCommentPayload {
  postId: number;
  commentId: number;
  content: string;
  toId: number;
}

// 응답
export interface GetCommentsResponse extends Page {
  comments: Comment[];
}
