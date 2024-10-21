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
  officialChatRoomId: number;
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
  fanCount: number;
  communityId: number;
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
  image: {uri: string; name: string; type: string} | null;
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

// 타입가드
export function isCommunity(item: any): item is Community {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'number' &&
    (item.type === 'TEAM' || item.type === 'PLAYER') &&
    typeof item.koreanName === 'string' &&
    (typeof item.englishName === 'string' || item.englishName === undefined) &&
    typeof item.image === 'string' &&
    typeof item.backgroundImage === 'string' &&
    (typeof item.fanCount === 'number' || item.fanCount === null) &&
    (item.user === null || typeof item.user === 'object') &&
    (Array.isArray(item.teams) || item.teams === undefined) &&
    (typeof item.sportName === 'string' || item.sportName === null) &&
    (typeof item.leagueName === 'string' || item.leagueName === null) &&
    (typeof item.isManager === 'boolean' || item.isManager === undefined) &&
    (item.manager === null || typeof item.manager === 'object') &&
    typeof item.officialChatRoomId === 'number'
  );
}
