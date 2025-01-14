import {ChatRoom} from 'apis/chat/types';
import {MatchDetail} from 'apis/match/types';
import {Page} from 'apis/types';

export interface MeetDetail {
  id: number;
  title: string;
  description: string;
  type: 'LIVE' | 'BOOKING';
  chatRoom: ChatRoom;
  currentCount: number;
  max: number;
  hasTicket: boolean;
  gender: 'ANY';
  minAge: number;
  maxAge: number;
  writer: {
    id: number;
    age: number;
    gender: 'MALE' | 'FEMLAE';
  };
  match: MatchDetail;
  place: string | null;
  isManager: boolean;
}

export interface MeetInfo {
  id: number;
  title: string;
  description: string;
  type: 'LIVE' | 'BOOKING';
  chatRoom: ChatRoom;
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
  place: string | null;
}

export interface MeetMember {
  meetFanId: number;
  userId: number;
  userAge: number;
  userGender: 'MALE' | 'FEMALE';
  role: string;
  name: string;
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
  keyword: string;
}

// 응답
export interface GetMeetsResponse extends Page {
  meets: MeetInfo[];
}

export interface GetMyMeetResponse extends Page {
  meets: MeetSection[];
}
export interface MeetSection {
  title: string;
  data: MeetInfo[];
}
