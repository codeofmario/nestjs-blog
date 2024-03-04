import { Inject, Injectable } from "@nestjs/common";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Paginated } from "@app/common/entities/paginated";
import { SortDirection } from "@app/common/enums/sort-direction";
import { RestPagination } from "@app/common/interfaces/rest-pagination";
import { Post } from "@app/common/entities/post.entity";
import {
  DataSource,
  FindOperator,
  FindOptionsRelations,
  ILike,
  In,
  Repository,
} from "typeorm";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";

const relations: FindOptionsRelations<Post> = {
  createdBy: true,
};

@Injectable()
export class PostRepository {
  private repository: Repository<Post>;

  constructor(@Inject("DATA_SOURCE") private dataSource: DataSource) {
    this.repository = dataSource.getRepository(Post);
  }

  async findAll(createdBy?: string[]): Promise<Post[]> {
    let builder = this.repository.createQueryBuilder();

    if (createdBy && createdBy.length > 0) {
      builder = builder.andWhere({
        createdBy: In(createdBy),
      });
    }

    return await builder.setFindOptions({ relations }).getMany();
  }

  async findAllPageable(
    pageable: TableFilterRequestDto,
    createdBy?: string[]
  ): Promise<Paginated<Post[]>> {
    const where: (
      | { title: FindOperator<string> }
      | { body: FindOperator<string> }
    )[] = [
      { title: ILike(`%${pageable.search}%`) },
      { body: ILike(`%${pageable.search}%`) },
    ];

    const order: FindOptionsOrder<Post> = {
      [pageable.sortBy ?? "createdAt"]:
        pageable.sortDirection ?? SortDirection.DESC,
    };

    let builder = this.repository.createQueryBuilder().setFindOptions({
      where,
      order,
    });

    if (createdBy && createdBy.length > 0) {
      builder = builder.andWhere({
        createdBy: In(createdBy),
      });
    }

    const data = await builder
      .skip(pageable.page * pageable.size)
      .take(pageable.size)
      .setFindOptions({ relations })
      .getMany();

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

  async findOneById(id: string): Promise<Post> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findAllByIdIn(ids: string[]): Promise<Post[]> {
    return this.repository.find({
      where: { id: In<string>(ids) },
      relations,
    });
  }

  async create(model: Partial<Post>): Promise<Post> {
    const { id } = await this.repository.save(model);
    return await this.findOneById(id);
  }

  async update(model: Partial<Post>): Promise<Post> {
    const { id } = await this.repository.save(model);
    return await this.findOneById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({
      id: id,
    });
  }
}
