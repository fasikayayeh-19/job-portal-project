import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateApplicationNoteDto {
  @IsString()
  @IsNotEmpty()
  note!: string;
}