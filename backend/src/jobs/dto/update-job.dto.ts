import {
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateJobDto {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

}