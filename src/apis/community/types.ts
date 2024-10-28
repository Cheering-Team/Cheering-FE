import {Fan} from 'apis/fan/types';
import {ImagePayload} from 'apis/post/types';

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
}

// 요청
export interface JoinCommunityPayload {
  communityId: number;
  name: string;
  image: ImagePayload;
}
