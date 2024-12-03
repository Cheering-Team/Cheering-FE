import {Community} from 'apis/community/types';
import {Fan} from 'apis/fan/types';
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
  lastMessage: string | null;
  lastMessageTime: string | null;
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
export interface ChatRoomListResponse extends Page {
  chatRooms: ChatRoom[];
}

export interface GetChatsResponse extends Page {
  chats: Chat[];
}
