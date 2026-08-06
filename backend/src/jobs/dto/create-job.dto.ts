import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';


export class CreateJobDto {

  @IsUUID()
categoryId!: string;

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