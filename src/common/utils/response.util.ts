import { RestResponse } from "@app/common/interfaces/rest-response";
import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export const ok = <T>(data: T): RestResponse<T> => {
  return {
    status: HttpStatus.OK,
    data,
  };
};

export const error = <E>(
  status: HttpStatus,
  message: string,
  errors?: E
): RestResponse<undefined, undefined, E> => {
  return {
    status: status,
    error: {
      timestamp: dayjs().unix(),
      message,
      errors,
    },
  };
};
