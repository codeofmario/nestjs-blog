import { Injectable } from "@nestjs/common";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Paginated } from "@app/common/entities/paginated";
import { PostRepository } from "@app/common/repositories/post.repository";
import { Post } from "@app/common/entities/post.entity";

@Injectable()
export class PostService {
  constructor(private repository: PostRepository) {}

  async findAll(createdBy?: string[]): Promise<Post[]> {
    return await this.repository.findAll(createdBy);
  }

  async findAllPageable(
    pageable: TableFilterRequestDto,
    createdBy?: string[]
  ): Promise<Paginated<Post[]>> {
    return await this.repository.findAllPageable(pageable, createdBy);
  }

  async findOne(id: string): Promise<Post> {
    return await this.repository.findOneById(id);
  }

  async create(model: Partial<Post>): Promise<Post> {
    return await this.repository.create(model);
  }

  async update(model: Partial<Post>): Promise<Post> {
    return await this.repository.update(model);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }

  async findAllByIdIn(ids: string[]): Promise<Post[]> {
    return await this.repository.findAllByIdIn(ids);
  }
}
