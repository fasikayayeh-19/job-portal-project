import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateJobDto {
  @IsUUID()
  categoryId!: string;

  @IsUUID()
  jobTypeId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  requirements!: string;

  @IsArray()
  skills!: string[];

  @IsString()
  location!: string;

  @IsString()
  experience!: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  deadline?: Date;

  
}