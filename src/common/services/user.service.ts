import { Injectable } from "@nestjs/common";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Paginated } from "@app/common/entities/paginated";
import { User } from "@app/common/entities/user.entity";
import { UserRepository } from "@app/common/repositories/user.repository";

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  async findAllPageable(
    pageable: TableFilterRequestDto
  ): Promise<Paginated<User[]>> {
    return await this.repository.findAllPageable(pageable);
  }

  async findOne(id: string): Promise<User> {
    return await this.repository.findOneById(id);
  }

  async findOneByUsername(id: string): Promise<User> {
    return await this.repository.findOneByUsername(id);
  }

  async create(data: Partial<User>): Promise<User> {
    return await this.repository.create(data);
  }
  async update(data: User): Promise<User> {
    return await this.repository.update(data);
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }
  async findAllByIdIn(ids: string[]): Promise<User[]> {
    return await this.repository.findAllByIdIn(ids);
  }
}
