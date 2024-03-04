import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public password: string;
}
