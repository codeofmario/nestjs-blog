import { Injectable } from "@nestjs/common";
import { Mapper } from "@app/common/interfaces/mapper";
import { CommentRequestDto } from "@app/common/dtos/request/comment-request.dto";
import { CommentResponseDto } from "@app/common/dtos/response/comment-response.dto";
import { Comment } from "@app/common/entities/comment.entity";

@Injectable()
export class CommentMapper
  implements Mapper<CommentRequestDto, CommentResponseDto, Partial<Comment>>
{
  fromDtoToModel(dto: CommentRequestDto): Partial<Comment> {
    return {
      body: dto.body,
      postId: dto.postId,
      createdBy: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  fromModelToDto(model: Comment): CommentResponseDto {
    const createdBy = {
      id: model.createdBy.id,
      username: model.createdBy.username,
      email: model.createdBy.email,
      avatarUrl: model.createdBy.avatarUrl,
    };

    return {
      id: model.id,
      body: model.body,
      postId: model.postId,
      createdBy,
    };
  }
}
