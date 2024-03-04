import { RestPagination } from "@app/common/interfaces/rest-pagination";

export class Paginated<T> {
  data: T;
  pagination: RestPagination;
}
