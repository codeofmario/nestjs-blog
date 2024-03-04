import { Inject, Injectable } from "@nestjs/common";
import { Paginated } from "@app/common/entities/paginated";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { RestPagination } from "@app/common/interfaces/rest-pagination";
import { SortDirection } from "@app/common/enums/sort-direction";
import {
  DataSource,
  FindOptionsRelations,
  In,
  Like,
  Repository,
} from "typeorm";
import { Comment } from "@app/common/entities/comment.entity";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";

const relations: FindOptionsRelations<Comment> = {
  createdBy: true,
};

@Injectable()
export class CommentRepository {
  private repository: Repository<Comment>;

  constructor(@Inject("DATA_SOURCE") private dataSource: DataSource) {
    this.repository = dataSource.getRepository(Comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.repository.find({
      relations,
    });
  }

  async findAllPageable(
    pageable: TableFilterRequestDto
  ): Promise<Paginated<Comment[]>> {
    const where: FindOptionsWhere<Comment> = {
      body: Like(`%${pageable.search}%`),
    };

    const order: FindOptionsOrder<Comment> = {
      [pageable.sortBy ?? "createdAt"]:
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

  async findOneById(id: string): Promise<Comment> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findAllByIdIn(ids: string[]): Promise<Comment[]> {
    return this.repository.find({
      where: { id: In<string>(ids) },
      relations,
    });
  }

  async create(model: Partial<Comment>): Promise<Comment> {
    const { id } = await this.repository.save(model);
    return await this.findOneById(id);
  }

  async update(model: Partial<Comment>): Promise<Comment> {
    const { id } = await this.repository.save(model);
    return await this.findOneById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({
      id: id,
    });
  }
}
