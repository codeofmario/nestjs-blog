import { Injectable } from "@nestjs/common";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { Paginated } from "@app/common/entities/paginated";
import { RoleRepository } from "@app/common/repositories/role.repository";
import { Role } from "@app/common/entities/role.entity";

@Injectable()
export class RoleService {
  constructor(private repository: RoleRepository) {}

  async findAll(): Promise<Role[]> {
    return await this.repository.findAll();
  }

  async findAllPageable(
    pageable: TableFilterRequestDto
  ): Promise<Paginated<Role[]>> {
    return await this.repository.findAllPageable(pageable);
  }

  async findOne(id: string): Promise<Role> {
    return await this.repository.findOneById(id);
  }

  async findOneByName(name: string): Promise<Role> {
    return await this.repository.findOneByName(name);
  }

  async create(data: Role): Promise<Role> {
    return await this.repository.create(data);
  }

  async update(data: Role): Promise<Role> {
    return await this.repository.update(data);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }

  async findAllByIdIn(ids: string[]): Promise<Role[]> {
    return await this.repository.findAllByIdIn(ids);
  }

  async findAllByNameIn(names: string[]): Promise<Role[]> {
    return await this.repository.findAllByNameIn(names);
  }
}
