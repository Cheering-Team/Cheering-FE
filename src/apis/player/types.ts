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

// 응답
export interface GetPlayerUserInfoResponse {
  user: PlayerUser;
  isUser: boolean;
  player: Player;
}
