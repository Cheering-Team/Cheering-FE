import {Fan} from 'apis/fan/types';
import {Match, MatchDetail} from 'apis/match/types';

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
