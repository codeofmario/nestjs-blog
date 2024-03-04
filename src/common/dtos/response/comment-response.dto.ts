import { UserInfoResponseDto } from "@app/common/dtos/response/user-info-response.dto";

export class CommentResponseDto {
  id: string;
  body: string;
  postId: string;
  createdBy: UserInfoResponseDto;
}
