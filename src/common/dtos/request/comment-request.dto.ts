import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CommentRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  body: string;

  @ApiProperty({ type: String })
  @IsString()
  postId: string;
}
