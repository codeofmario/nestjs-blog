import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { StoreService } from "@app/common/services/store.service";
import { PostService } from "@app/common/services/post.service";
import { PostMapper } from "@app/blog/mappers/post.mapper";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { RestResponse } from "@app/common/interfaces/rest-response";
import { FormDataRequest } from "nestjs-form-data";
import { error, ok } from "@app/common/utils/response.util";
import { PostRequestDto } from "@app/common/dtos/request/post-request.dto";
import { PostResponseDto } from "@app/common/dtos/response/post-response.dto";
import { User } from "@app/common/entities/user.entity";
import { CurrentUser } from "@app/common/decorators/current-user.decorator";
import { JwtPayload } from "@app/common/entities/jwt-payload";
import { UserService } from "@app/common/services/user.service";
import { RestPagination } from "@app/common/interfaces/rest-pagination";
import { Post as BlogPost } from "@app/common/entities/post.entity";

@Controller("api/v1/posts")
@ApiBearerAuth()
@ApiTags("Post")
export class PostController {
  constructor(
    private service: PostService,
    private userService: UserService,
    private mapper: PostMapper,
    private storeService: StoreService
  ) {}

  @Get("/")
  async findAll(
    @Query() tableFilterRequestDto: TableFilterRequestDto
  ): Promise<RestResponse<PostResponseDto[]>> {
    let data: BlogPost[];
    let pagination: RestPagination;

    if (tableFilterRequestDto.all) {
      data = await this.service.findAll();
    } else {
      ({ data, pagination } = await this.service.findAllPageable(
        tableFilterRequestDto
      ));
    }

    return {
      data: data.map((model) => this.mapper.fromModelToDto(model)),
      metadata: pagination,
    } as RestResponse<PostResponseDto[]>;
  }

  @Get("/:id")
  async findOne(
    @Param("id") id: string
  ): Promise<RestResponse<PostResponseDto>> {
    const model = await this.service.findOne(id);

    if (model === null) {
      return error(HttpStatus.NOT_FOUND, `Post with id ${id} not found.`);
    }

    return ok(this.mapper.fromModelToDto(model));
  }

  @Post("/")
  @FormDataRequest()
  @ApiConsumes("multipart/form-data")
  async create(
    @Body() dto: PostRequestDto,
    @CurrentUser() sessionUser: JwtPayload
  ): Promise<RestResponse<PostResponseDto>> {
    const model = this.mapper.fromDtoToModel(dto);
    model.createdBy = new User();
    model.createdBy.id = sessionUser.sub;

    if (dto.image) {
      model.imageUrl = await this.storeService.store(dto.image);
    }

    const data = await this.service.create(model);

    return ok(this.mapper.fromModelToDto(data));
  }

  @Put("/:id")
  @FormDataRequest()
  @ApiConsumes("multipart/form-data")
  async update(
    @Param("id") id: string,
    @Body() dto: PostRequestDto
  ): Promise<RestResponse<PostResponseDto>> {
    const model = this.mapper.fromDtoToModel(dto);
    const current = await this.service.findOne(id);
    current.title = model.title;
    current.body = model.body;

    if (dto.image && model.imageUrl) {
      await this.storeService.delete(model.imageUrl);
    }

    if (dto.image) {
      current.imageUrl = await this.storeService.store(dto.image);
    }

    const data = await this.service.update(current);

    return ok(this.mapper.fromModelToDto(data));
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    const oldModel = await this.service.findOne(id);

    if (oldModel.imageUrl) {
      await this.storeService.delete(oldModel.imageUrl);
    }

    await this.service.deleteById(id);
  }
}
