export interface Fan {
  id: number;
  type: 'TEAM' | 'PLAYER';
  name: string;
  image: string;
}

// 요청
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
  fan: Fan;
  isUser: boolean;
  communityKoreanName: string;
  communityEnglishName: string;
}
