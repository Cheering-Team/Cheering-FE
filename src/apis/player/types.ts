import {ImageType} from '../post/types';
import {PlayerUser} from '../user/types';

export interface Player {
  id: number;
  koreanName: string;
  englishName: string;
  image: string;
  backgroundImage: string;
  fanCount: number | null;
  user: PlayerUser | null;
}

// 요청
export interface PlayerIdPayload {
  playerId: number;
}

export interface PlayerUserIdPayload {
  playerUserId: number;
}

export interface UpdatedPlayerUserImagePayload extends PlayerUserIdPayload {
  image: ImageType | null;
}

export interface UpdatedPlayerUserNicknamePayload extends PlayerUserIdPayload {
  nickname: string;
}

// 응답
export interface GetPlayerUserInfoResponse {
  user: PlayerUser;
  isUser: boolean;
  player: Player;
}
