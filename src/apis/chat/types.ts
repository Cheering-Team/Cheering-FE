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
  type: 'OFFICIAL' | 'PUBLIC' | 'PRIVATE' | 'CONFIRM';
  count: number;
  user: Fan | null;
  community: Community | null;
  manager: Fan | null;
  isParticipating: boolean | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number | null;
  meetId: number | null;
  opponentAge?: number;
  opponentGender?: 'MALE' | 'FEMALE';
  communityId: number;
  isConfirmed?: boolean;
}

export interface Chat {
  type: 'MESSAGE' | 'SYSTEM' | 'JOIN_REQUEST' | 'JOIN_ACCEPT' | 'ERROR';
  createdAt: string;
  writer: Fan;
  messages: string[];
  groupKey: string;
}

export interface ChatResponse {
  type: 'MESSAGE' | 'SYSTEM' | 'JOIN_REQUEST' | 'JOIN_ACCEPT' | 'ERROR';
  content: string;
  createdAt: string;
  writerId: number;
  writerImage: string;
  writerName: string;
  groupKey: string;
}

export interface IdWithConditionResponse {
  chatRoomId: number;
  isConditionMatched: boolean;
}

// 요청
export interface ChatRoomIdPayload {
  chatRoomId: number;
}

export interface CreatePrivateChatRoomPayload {
  communityId: number;
  meetId: number;
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

export interface ChatListResponse {
  chats: Chat[];
  hasNext: boolean;
}
