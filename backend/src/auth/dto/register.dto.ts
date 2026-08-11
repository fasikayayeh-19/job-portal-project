import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  COMPANY = 'COMPANY',
}

export class RegisterDto {
  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;
  @IsString()
location!: string;
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}