import {Team} from 'apis/team/types';

export interface Match {
  id: number;
  isHome: boolean;
  opponentImage: string;
}

export interface MatchDetail {
  id: number;
  time: string;
  location: string;
  homeTeam: Team;
  awayTeam: Team;
}

export interface MatchSchedule {
  [date: string]: Match[];
}
