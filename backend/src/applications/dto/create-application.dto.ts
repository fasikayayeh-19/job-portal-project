import { IsString, IsUUID } from 'class-validator';


export class CreateApplicationDto {


  @IsUUID()
  jobId!: string;


  @IsString()
  coverLetter!: string;

}