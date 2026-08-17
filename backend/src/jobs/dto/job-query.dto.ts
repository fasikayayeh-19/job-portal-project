
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class JobQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  // Category filter
  @IsOptional()
  @IsString()
  categoryId?: string;

  // Career filter
  @IsOptional()
  @IsString()
  career?: string;

  // Employment type filter
  @IsOptional()
  @IsString()
  jobType?: string;

  // Posted date filter
  @IsOptional()
  @IsString()
  postedWithin?: string;
}

