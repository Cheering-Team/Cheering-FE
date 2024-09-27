import {ImageType} from 'apis/post/types';

export interface Notice {
  id: number;
  title: string;
  createdAt: Date;
  image: string;
  content: string;
}

// 요청
export interface ApplyPayload {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  image: ImageType;
}
