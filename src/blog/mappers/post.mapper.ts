import { Injectable } from "@nestjs/common";
import { Mapper } from "@app/common/interfaces/mapper";
import { PostRequestDto } from "@app/common/dtos/request/post-request.dto";
import { PostResponseDto } from "@app/common/dtos/response/post-response.dto";
import { Post } from "@app/common/entities/post.entity";

@Injectable()
export class PostMapper
  implements Mapper<PostRequestDto, PostResponseDto, Partial<Post>>
{
  fromDtoToModel(dto: PostRequestDto): Partial<Post> {
    return {
      title: dto.title,
      body: dto.body,
    };
  }

  fromModelToDto(model: Post): PostResponseDto {
    const createdBy = {
      id: model.createdBy.id,
      username: model.createdBy.username,
      email: model.createdBy.email,
      avatarUrl: model.createdBy.avatarUrl,
    };

    return {
      id: model.id,
      title: model.title,
      body: model.body,
      imageUrl: model.imageUrl,
      createdBy,
    };
  }
}
