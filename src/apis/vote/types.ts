import {VoteMatch} from 'apis/match/types';

export interface Vote {
  id: number;
  title: string;
  endTime: string;
  match: VoteMatch;
  options: VoteOption[];
  isVoted: boolean;
  totalCount: number;
}

export interface VoteOption {
  id: number;
  name: string;
  image: string;
  backgroundImage: string;
  communityId: number;
  percent: number;
  isVoted: boolean;
}

// 요청
export interface VoteOptionIdPayload {
  voteOptionId: number;
}
