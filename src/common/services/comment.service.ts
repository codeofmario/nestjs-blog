import { Injectable } from "@nestjs/common";
import { CommentRepository } from "@app/common/repositories/comment.repository";
import { Paginated } from "@app/common/entities/paginated";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Comment } from "@app/common/entities/comment.entity";

@Injectable()
export class CommentService {
  constructor(private repository: CommentRepository) {}

  async findAll(): Promise<Comment[]> {
    return await this.repository.findAll();
  }

  async findAllPageable(
    pageable: TableFilterRequestDto
  ): Promise<Paginated<Comment[]>> {
    return await this.repository.findAllPageable(pageable);
  }

  async findOne(id: string): Promise<Comment> {
    return await this.repository.findOneById(id);
  }

  async create(model: Partial<Comment>): Promise<Comment> {
    return await this.repository.create(model);
  }

  async update(model: Partial<Comment>): Promise<Comment> {
    return await this.repository.update(model);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }

  async findAllByIdIn(ids: string[]): Promise<Comment[]> {
    return await this.repository.findAllByIdIn(ids);
  }
}
