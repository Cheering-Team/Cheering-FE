export interface User {
  id: number;
  phone: string;
  nickname: string;
  createdAt?: string;
}

export interface PlayerUser {
  id: number;
  nickname: string;
  image: string;
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

export interface SignUpPayload {
  phone: string;
  nickname: string;
}

export interface ConnectSocialPayload {
  accessToken: string;
  type: 'kakao' | 'naver' | 'apple';
  userId: number;
}

export interface UpdateUserNicknamePayload {
  nickname: string;
}

export interface SaveFCMTokenPayload {
  token: string;
}
