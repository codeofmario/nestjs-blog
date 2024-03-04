import { Inject, Injectable } from "@nestjs/common";
import {
  DataSource,
  FindOptionsRelations,
  In,
  Like,
  Repository,
} from "typeorm";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Paginated } from "@app/common/entities/paginated";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";
import { SortDirection } from "@app/common/enums/sort-direction";
import { RestPagination } from "@app/common/interfaces/rest-pagination";
import { Role } from "@app/common/entities/role.entity";

const relations: FindOptionsRelations<Role> = {};

@Injectable()
export class RoleRepository {
  private repository: Repository<Role>;

  constructor(@Inject("DATA_SOURCE") private dataSource: DataSource) {
    this.repository = dataSource.getRepository(Role);
  }

  async findAll(): Promise<Role[]> {
    return this.repository.find({
      relations,
    });
  }

  async findAllPageable(
    pageable: TableFilterRequestDto
  ): Promise<Paginated<Role[]>> {
    const where: FindOptionsWhere<Role> = {
      name: Like(`%${pageable.search}%`),
    };

    const order: FindOptionsOrder<Role> = {
      [pageable.sortBy ?? "name"]: pageable.sortDirection ?? SortDirection.DESC,
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

  async findOneById(id: string): Promise<Role> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneByName(name: string): Promise<Role> {
    return this.repository.findOne({
      where: { name },
      relations,
    });
  }

  async findAllByIdIn(ids: string[]): Promise<Role[]> {
    return this.repository.find({
      where: { id: In(ids) },
      relations,
    });
  }

  async findAllByNameIn(names: string[]) {
    return this.repository.find({
      where: { name: In(names) },
      relations,
    });
  }

  async create(data: Role): Promise<Role> {
    const { id } = await this.repository.save(data);
    return await this.findOneById(id);
  }

  async update(data: Role): Promise<Role> {
    const { id } = await this.repository.save(data);
    return await this.findOneById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({
      id: id,
    });
  }
}
