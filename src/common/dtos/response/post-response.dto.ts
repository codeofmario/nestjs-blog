import { UserInfoResponseDto } from "@app/common/dtos/response/user-info-response.dto";

export class PostResponseDto {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  createdBy: UserInfoResponseDto;
}
