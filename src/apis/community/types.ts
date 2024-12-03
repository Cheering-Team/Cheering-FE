import {Fan} from 'apis/fan/types';
import {Page} from 'apis/types';

export interface Community {
  id: number;
  type: 'TEAM' | 'PLAYER';
  koreanName: string;
  englishName: string;
  image: string;
  backgroundImage: string;
  fanCount: number;
  curFan?: Fan;
  sportName?: string;
  leagueName?: string;
  firstTeamName?: string;
  officialRoomId: number | null;
  color: string;
  role: 'USER' | 'ADMIN';
}

// 요청
export interface JoinCommunityPayload {
  communityId: number;
  name: string;
}

export interface ChangeCommunityOrderPayload {
  communityId: number;
  communityOrder: number;
}

export interface JoinCommunitiesPayload {
  communityIds: number[];
}

// 응답
export interface SearchPlayersResponse extends Page {
  players: Community[];
}
