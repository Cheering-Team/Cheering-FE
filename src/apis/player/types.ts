import {PlayerUser} from '../user/types';

export interface Player {
  id: number;
  koreanName: string;
  englishName: string;
  image: string;
  backgroundImage: string;
  fanCount: number | null;
  user: PlayerUser | null;
}
