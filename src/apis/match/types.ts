import {Community} from 'apis/community/types';
import {Team} from 'apis/team/types';
import {Page} from 'apis/types';

export interface Match {
  id: number;
  isHome: boolean;
  opponentImage: string;
}

export interface MatchDetail {
  id: number;
  status: MatchStatus;
  time: string;
  location: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
  sportName: string;
}

export type MatchStatus =
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

export interface VoteMatch {
  id: number;
  opponentImage: string;
  shortName: string;
  time: string;
}

export interface MatchSchedule {
  [date: string]: Match[];
}

// 요청
export interface EditMatchPayload {
  matchId: number;
  time: Date;
  location: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  homePlayers: Community[];
  awayPlayers: Community[];
}

// 응답
export interface GetUnfinishedMatchesResponse extends Page {
  matches: MatchDetail[];
}
