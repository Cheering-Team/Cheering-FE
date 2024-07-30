// TEAM
export interface TeamResponse {
  id: number;
  name: string;
  image: string;
  fanCount: number;
}

// PLAYER
export interface GetPlayersInfoResponse {
  id: number;
  koreanName: string;
  englishName: string;
  image: string;
  backgroundImage: string;
  fanCount: number;
  user: PlayerUserResponse | null;
  teams: TeamResponse[];
}

// PLAYERUSER
export interface PlayerUserResponse {
  id: number;
  nickname: string;
  image: string;
}
