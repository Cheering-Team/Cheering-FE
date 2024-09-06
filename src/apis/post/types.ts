import {Player} from '../player/types';
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
  images: ImageType[];
  writer: PlayerUser;
}

export interface ImageType {
  url: string;
  width: number;
  height: number;
}

// 요청
export interface LikePostPayload {
  postId: number;
}
