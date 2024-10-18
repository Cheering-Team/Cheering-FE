import {ImageType} from '../post/types';
import {Fan} from '../user/types';

export interface Community {
  id: number;
  type: 'TEAM' | 'PLAYER';
  koreanName: string;
  englishName?: string;
  image: string;
  backgroundImage: string;
  fanCount: number | null;
  user: Fan | null;
  teams?: Team[];
  sportName: string | null;
  leagueName: string | null;
  isManager?: boolean;
  manager?: Fan;
  officialChatRoomId?: number;
}

export interface Sport {
  id: number;
  name: string;
  image: string;
}

export interface Team {
  id: number;
  name: string;
  image: string;
  fanCount: number | null;
  communityId: number | null;
}

export interface TeamName {
  id: number;
  firstName: string;
  secondName: string;
  image: string;
}

// 요청
export interface PlayerIdPayload {
  playerId: number;
}

export interface JoinCommunityPayload {
  communityId: number;
  name: string;
  image: ImageType;
}

export interface FanIdPayload {
  fanId: number;
}

export interface UpdateFanImagePayload extends FanIdPayload {
  image: ImageType | null;
}

export interface UpdateFanNamePayload extends FanIdPayload {
  name: string;
}

// 응답
export interface GetFanInfoResponse {
  user: Fan;
  isUser: boolean;
  community: Community;
}

export interface GetPlayersByTeamResponse {
  sportName: string;
  leagueName: string;
  team: Team;
  communities: Community[];
}
