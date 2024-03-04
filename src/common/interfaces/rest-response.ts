import { HttpStatus } from "@nestjs/common";
import { RestError } from "@app/common/interfaces/rest-error";

export interface RestResponse<T, M = undefined, E = any> {
  status: HttpStatus;
  data?: T;
  metadata?: M;
  error?: RestError<E>;
}
