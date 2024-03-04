import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from "nestjs-form-data";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserRequestDto {
  @ApiProperty({ type: String })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  passwordConfirm: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @Transform((params) => Boolean(params.value))
  enabled: boolean;

  @ApiProperty({ type: String, format: "binary" })
  @ApiPropertyOptional()
  @IsOptional()
  @IsFile()
  @MaxFileSize(524288)
  @HasMimeType(["image/jpeg", "image/png"])
  avatar: MemoryStoredFile;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  roleIds: string[];
}
