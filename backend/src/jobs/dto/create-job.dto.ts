import {
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';


export class CreateJobDto {


  @IsString()
  title!:string;


  @IsString()
  description!:string;


  @IsString()
  requirements!:string;


  @IsArray()
  skills!:string[];


  @IsString()
  location!:string;


  @IsString()
  jobType!:string;


  @IsString()
  experience!:string;


  @IsOptional()
  salary?:string;


  @IsOptional()
  deadline?:Date;


}