import {ImageType} from 'apis/post/types';
import {PlayerUser} from '../user/types';
import {Player} from 'apis/player/types';
import {Page} from 'apis/types';

// 엔티티
export interface ChatRoom {
  id: number;
  name: string;
  image: string;
  description: string;
  max: number;
  type: 'OFFICIAL' | 'PUBLIC';
  count: number;
  playerUser?: PlayerUser;
  player: Player;
  creator: PlayerUser | null;
  isParticipating: boolean | null;
}

export interface Chat {
  createdAt: string;
  sender: PlayerUser;
  messages: string[];
}

export interface ChatResponse {
  createdAt: string;
  sender: PlayerUser;
  message: string;
}

// 요청
export interface CreateChatRoomPayload {
  playerId: number;
  name: string;
  description: string;
  max: number;
  image: ImageType;
}

// 응답
export interface ChatRoomListResponse {
  title: 'official' | 'public';
  data: ChatRoom[];
}

export interface GetChatsResponse extends Page {
  chats: Chat[];
}
