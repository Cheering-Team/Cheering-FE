import {ChatRoom} from 'apis/chat/types';
import {Fan} from 'apis/fan/types';
import {Page} from 'apis/types';

export interface MeetDetail {
  title: string;
  description: string;
  currentCount: number;
  max: number;
  hasTicket: boolean;
  gender: 'ANY';
  minAge: number;
  maxAge: number;
  writer: Fan;
  match: {
    id: number;
    opponentImage: string;
    time: string;
  };
}

export interface MeetInfo {
  id: number;
  title: string;
  description: string;
  meetType: 'LIVE' | 'BOOKING';
  chatRoomDTO: ChatRoom;
  currentCount: number;
  max: number;
  hasTicket: boolean;
  gender: 'ANY' | 'MALE' | 'FEMALE';
  ageMin: number;
  ageMax: number;
  match: {
    id: number;
    isHome: boolean;
    opponentShortName: string;
    opponentImage: string;
    opponentColor: string;
    time: string;
  };
}

// 요청
export interface CreateMeetPayload {
  communityId: number;
  title: string;
  description: string;
  max: number;
  gender: 'ANY' | 'MALE' | 'FEMALE';
  ageMin: number;
  ageMax: number;
  place: string | null;
  type: 'BOOKING' | 'LIVE';
  hasTicket: boolean | null;
  matchId: number;
  communityType: 'TEAM' | 'PLAYER';
}

export interface GetMeesPayload {
  communityId: number;
  type: 'BOOKING' | 'LIVE';
  gender: 'ANY' | 'MALE' | 'FEMALE';
  minAge: number;
  maxAge: number;
  ticketOption: 'ALL' | 'HAS' | 'NOT';
  matchId: number | null;
}

// 응답
export interface GetMeetsResponse extends Page {
  meets: MeetInfo[];
}
