import {Fan} from 'apis/fan/types';

export interface Meet {
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
