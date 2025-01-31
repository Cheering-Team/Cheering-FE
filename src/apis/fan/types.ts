export interface Fan {
  id: number;
  type?: 'TEAM' | 'PLAYER' | 'ADMIN';
  name: string;
  image: string;
}

export interface FanProfile {
  id: number;
  type: 'TEAM' | 'PLAYER' | 'ADMIN';
  name: string;
  image: string;
  meetName: string;
  meetImage: string;
  isUser: boolean;
  communityId: number;
}

// 요청
export interface FanIdPayload {
  fanId: number;
}

export interface UpdateFanImagePayload extends FanIdPayload {
  type: 'COMMUNITY' | 'MEET';
  image: {uri: string; name: string; type: string} | null;
}

export interface UpdateFanNamePayload extends FanIdPayload {
  type: 'COMMUNITY' | 'MEET';
  name: string;
}

// 응답
export interface GetFanInfoResponse {
  fan: Fan;
  isUser: boolean;
  communityKoreanName: string;
  communityEnglishName: string;
}
