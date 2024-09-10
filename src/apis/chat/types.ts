import {PlayerUser} from '../user/types';

// 엔티티
export interface ChatRoom {
  id: number;
  name: string;
  image: string;
  description: string;
  count: number;
  playerUser?: PlayerUser;
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
