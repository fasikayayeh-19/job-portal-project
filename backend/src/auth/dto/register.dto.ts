import {
 IsEmail,
 IsString,
 MinLength,
 IsEnum,
} from 'class-validator';


export enum UserRole {
  COMPANY = 'COMPANY',
  JOB_SEEKER = 'JOB_SEEKER',
}


export class RegisterDto {


@IsString()
firstName!:string;


@IsString()
lastName!:string;


@IsEmail()
email!:string;


@IsString()
@MinLength(6)
password!:string;



@IsEnum(UserRole)
role!:UserRole;


}