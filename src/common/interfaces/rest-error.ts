export interface RestError<T> {
  timestamp: number;
  message: string;
  errors: T;
}
