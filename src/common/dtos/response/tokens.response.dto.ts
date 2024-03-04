import { ApiProperty } from "@nestjs/swagger";

export class TokensResponseDto {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
