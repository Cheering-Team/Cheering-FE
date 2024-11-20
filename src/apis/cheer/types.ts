import {Fan} from 'apis/fan/types';
import {Page} from 'apis/types';

export interface Cheer {
  id: number;
  content: string;
  createdAt: string;
  writer: Fan;
  isWriter: boolean;
}

// 요청
export interface WriteCheerPayload {
  matchId: number;
  communityId: number;
  content: string;
}

export interface CheerIdPayload {
  cheerId: number;
}

// 응답
export interface GetCheersResponse extends Page {
  cheers: Cheer[];
}
