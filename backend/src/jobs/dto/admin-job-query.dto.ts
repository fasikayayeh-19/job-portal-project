import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum AdminJobStatus {
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export class AdminJobQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AdminJobStatus)
  status?: AdminJobStatus;
}