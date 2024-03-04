import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from "nestjs-form-data";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class PostRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  body: string;

  @ApiProperty({ type: String, format: "binary" })
  @ApiPropertyOptional()
  @IsOptional()
  @IsFile()
  @MaxFileSize(524288)
  @HasMimeType(["image/jpeg", "image/png"])
  image: MemoryStoredFile;
}
