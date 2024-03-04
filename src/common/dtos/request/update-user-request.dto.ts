import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from "nestjs-form-data";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

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
