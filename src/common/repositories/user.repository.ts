import { Inject, Injectable } from "@nestjs/common";
import {
  DataSource,
  FindOperator,
  FindOptionsRelations,
  In,
  Like,
  Repository,
} from "typeorm";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Paginated } from "@app/common/entities/paginated";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";
import { SortDirection } from "@app/common/enums/sort-direction";
import { RestPagination } from "@app/common/interfaces/rest-pagination";
import { User } from "@app/common/entities/user.entity";

const relations: FindOptionsRelations<User> = {
  roles: true,
};

@Injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor(@Inject("DATA_SOURCE") private dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      relations,
    });
  }

  async findAllPageable(
    pageable: TableFilterRequestDto
  ): Promise<Paginated<User[]>> {
    const where: (
      | { username: FindOperator<string> }
      | { email: FindOperator<string> }
    )[] = [
      { username: Like(`%${pageable.search}%`) },
      { email: Like(`%${pageable.search}%`) },
    ];

    const order: FindOptionsOrder<User> = {
      [pageable.sortBy ?? "username"]:
        pageable.sortDirection ?? SortDirection.DESC,
    };

    const data = await this.repository.find({
      skip: pageable.page * pageable.size,
      take: pageable.size,
      where,
      order,
      relations,
    });

    const count = await this.repository.count({
      where,
      order,
    });

    const pagination: RestPagination = {
      pageNumber: pageable.page,
      totalElements: count,
      totalPages: Math.ceil(count / pageable.size),
      size: pageable.size,
    };

    return { data, pagination };
  }

  async findOneById(id: string): Promise<User> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.repository.findOne({
      where: { username },
      relations,
    });
  }

  async findAllByIdIn(ids: string[]): Promise<User[]> {
    return this.repository.find({
      where: { id: In(ids) },
      relations,
    });
  }

  async create(user: Partial<User>): Promise<User> {
    const { id } = await this.repository.save(user);
    return await this.findOneById(id);
  }

  async update(user: User): Promise<User> {
    const { id } = await this.repository.save(user);
    return await this.findOneById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({
      id: id,
    });
  }
}
