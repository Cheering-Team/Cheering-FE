import {Community} from 'apis/player/types';

export interface User {
  id: number;
  phone: string;
  name: string;
  createdAt?: string;
  role?: string;
  community?: Community;
}

export interface Fan {
  id: number;
  type: 'FAN' | 'MANAGER';
  name: string;
  image: string;
  isManager?: boolean;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

// 요청
export interface SendSMSPayload {
  phone: string;
}

export interface CheckCodePayload {
  phone: string;
  code: string;
}

export interface SignUpPayload {
  phone: string;
  name: string;
}

export interface CheckCodeSocialPayload {
  accessToken: string;
  phone: string;
  code: string;
  type: 'kakao' | 'naver' | 'apple';
}

export interface TokenPayload {
  accessToken: string;
  name?: string;
}

export interface ConnectSocialPayload {
  accessToken: string;
  type: 'kakao' | 'naver' | 'apple';
  userId: number;
}

export interface UpdateUserNamePayload {
  name: string;
}

export interface SaveFCMTokenPayload {
  token: string;
}

export interface RegisterManagerAccountPayload {
  communityId: number;
  phone: string;
}
