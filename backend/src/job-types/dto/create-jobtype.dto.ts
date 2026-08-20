import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}