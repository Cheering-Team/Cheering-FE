export interface Api<T> {
  code: number;
  message: string;
  result: T;
}
