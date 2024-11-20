export interface Sport {
  id: number;
  name: string;
  image: string;
}

export interface Team {
  id: number;
  koreanName: string;
  image: string;
  shortName: string;
  color: string;
}

export interface TeamWithLeague extends Team {
  sportName: string;
  leagueName: string;
}
