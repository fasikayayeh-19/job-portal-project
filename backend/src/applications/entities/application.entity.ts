import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('applications')
export class Application {

 @PrimaryGeneratedColumn('uuid')
 id!:string;

}