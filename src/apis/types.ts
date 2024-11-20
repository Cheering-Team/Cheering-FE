export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  hasNext: boolean;
}

export interface Id {
  id: number;
}

export interface IdName {
  id: number;
  name: string;
}
