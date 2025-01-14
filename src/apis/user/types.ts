export interface User {
  id: number;
  phone: string;
  name: string;
  createdAt?: string;
  role?: string;
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
  deviceId: string;
  token: string;
}

export interface DeleteFCMTokenPayload {
  deviceId: string;
}

export interface RegisterManagerAccountPayload {
  communityId: number;
  phone: string;
}

export interface VersionInfo {
  latestVersion: string;
  minSupportedVersion: string;
  iosUrl: string;
  aosUrl: string;
}

export interface SetAgeAndGenderPayload {
  communityId: number;
  age: number | null;
  gender: 'MALE' | 'FEMALE' | null;
  name: string;
  status: 'NEITHER' | 'NULL_PROFILE';
}
