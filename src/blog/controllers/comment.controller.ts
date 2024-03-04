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

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentService } from "@app/common/services/comment.service";
import { TableFilterRequestDto } from "@app/common/dtos/request/table-filter-request.dto";
import { RestResponse } from "@app/common/interfaces/rest-response";
import { CommentResponseDto } from "@app/common/dtos/response/comment-response.dto";
import { CommentRequestDto } from "@app/common/dtos/request/comment-request.dto";
import { FormDataRequest } from "nestjs-form-data";
import { CommentMapper } from "@app/blog/mappers/comment.mapper";
import { error, ok } from "@app/common/utils/response.util";
import { StoreService } from "@app/common/services/store.service";
import { User } from "@app/common/entities/user.entity";
import { RestPagination } from "@app/common/interfaces/rest-pagination";
import { Comment } from "@app/common/entities/comment.entity";
import { CurrentUser } from "@app/common/decorators/current-user.decorator";
import { JwtPayload } from "@app/common/entities/jwt-payload";

@Controller("api/v1/comments")
@ApiBearerAuth()
@ApiTags("Comment")
export class CommentController {
  constructor(
    private service: CommentService,
    private mapper: CommentMapper,
    private storeService: StoreService
  ) {}

  @Get("/")
  async findAll(
    @Query() tableFilterRequestDto: TableFilterRequestDto
  ): Promise<RestResponse<CommentResponseDto[]>> {
    let data: Comment[];
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
    } as RestResponse<CommentResponseDto[]>;
  }

  @Get("/:id")
  async findOne(
    @Param("id") id: string
  ): Promise<RestResponse<CommentResponseDto>> {
    const model = await this.service.findOne(id);

    if (model === null) {
      return error(HttpStatus.NOT_FOUND, `Comment with id ${id} not found.`);
    }

    return ok(this.mapper.fromModelToDto(model));
  }

  @Post("/")
  @FormDataRequest()
  async create(
    @Body() dto: CommentRequestDto,
    @CurrentUser() sessionUser: JwtPayload
  ): Promise<RestResponse<CommentResponseDto>> {
    const model = this.mapper.fromDtoToModel(dto);
    model.createdBy = new User();
    model.createdBy.id = sessionUser.sub;

    const data = await this.service.create(model);
    return ok(this.mapper.fromModelToDto(data));
  }

  @Put("/:id")
  @FormDataRequest()
  async update(
    @Param("id") id: string,
    @Body() dto: CommentRequestDto
  ): Promise<RestResponse<CommentResponseDto>> {
    const model = this.mapper.fromDtoToModel(dto);
    const current = await this.service.findOne(id);
    current.body = model.body;

    const comment = await this.service.update(current);
    return ok(this.mapper.fromModelToDto(comment));
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    await this.service.deleteById(id);
  }
}
