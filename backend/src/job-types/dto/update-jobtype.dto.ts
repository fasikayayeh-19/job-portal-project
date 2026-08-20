import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateJobTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}