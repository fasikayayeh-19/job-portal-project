import {
 IsString,
 IsOptional,
} from 'class-validator';



export class CreateCompanyDto {


@IsString()
companyName!:string;



@IsOptional()
@IsString()
description?:string;



@IsOptional()
@IsString()
website?:string;



@IsOptional()
@IsString()
logo?:string;



@IsString()
location!:string;


}