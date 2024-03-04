import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from "nestjs-form-data";

export class RegisterRequestDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public passwordConfirm: string;

  @ApiProperty({ type: String, format: "binary" })
  @ApiPropertyOptional()
  @IsFile()
  @MaxFileSize(524288)
  @HasMimeType(["image/jpeg", "image/png"])
  public avatar?: MemoryStoredFile;
}
