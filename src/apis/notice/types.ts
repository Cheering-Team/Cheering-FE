export interface Notice {
  id: number;
  title: string;
  createdAt: Date;
  image: string;
  content: string;
}

// 타입가드
export function isNotice(item: any): item is Notice {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    item.createdAt instanceof Date &&
    typeof item.image === 'string' &&
    typeof item.content === 'string'
  );
}
