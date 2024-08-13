import {PlayerUserResponse} from './player';

// POST
export interface PostInfoResponse {
  id: number;
  playerUser: PlayerUserResponse;
  content: string;
  createdAt: Date;
  tags: string[];
}

export interface GetPostsResponse {
  posts: PostInfoResponse;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
