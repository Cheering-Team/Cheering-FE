import {Team} from 'apis/team/types';

export interface Match {
  id: number;
  isHome: boolean;
  opponentImage: string;
}

export interface MatchDetail {
  id: number;
  status:
    | 'not_started'
    | 'started'
    | 'live'
    | 'postponed'
    | 'suspended'
    | 'match_about_to_start'
    | 'delayed'
    | 'interrupted'
    | 'cancelled'
    | 'ended'
    | 'closed';
  time: string;
  location: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
  sportName: string;
}

export interface MatchSchedule {
  [date: string]: Match[];
}
