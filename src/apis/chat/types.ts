import {ImagePayload, ImageType} from 'apis/post/types';
import {Fan} from '../user/types';
import {Community} from 'apis/player/types';
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
  user?: Fan;
  community: Community;
  manager: Fan | null;
  isParticipating: boolean | null;
}

export interface Chat {
  createdAt: string;
  sender: Fan;
  messages: string[];
}

export interface ChatResponse {
  createdAt: string;
  sender: Fan;
  message: string;
}

// 요청
export interface ChatRoomIdPayload {
  chatRoomId: number;
}

export interface CreateChatRoomPayload {
  communityId: number;
  name: string;
  description: string;
  max: number;
  image: {uri: string; name: string; type: string};
}

// 응답
export interface ChatRoomListResponse {
  title: 'official' | 'public';
  data: ChatRoom[];
}

export interface GetChatsResponse extends Page {
  chats: Chat[];
}
