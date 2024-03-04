import { SortDirection } from "@app/common/enums/sort-direction";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class TableFilterRequestDto {
  @ApiProperty({ type: String, default: "" })
  @ApiPropertyOptional()
  @IsString()
  search = "";

  @ApiProperty({ type: Number, default: 0 })
  @IsNotEmpty()
  @IsInt()
  @Transform((params) => Number(params.value))
  page = 0;

  @ApiProperty({ type: Number, default: 10 })
  @IsNotEmpty()
  @IsInt()
  @Transform((params) => Number(params.value))
  size = 10;

  @ApiProperty({ type: String })
  @ApiPropertyOptional()
  sortBy?: string;

  @ApiProperty({ enum: SortDirection })
  @ApiPropertyOptional()
  sortDirection?: SortDirection;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  @Transform((params) => params.value === "true")
  all = false;
}
