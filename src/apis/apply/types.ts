export interface Apply {
  id: number;
  content: string;
  comment: string | null;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// 요청
export interface ApplyCommunityPayload {
  content: string;
}

export interface ApplyIdPayload {
  applyId: number;
}
