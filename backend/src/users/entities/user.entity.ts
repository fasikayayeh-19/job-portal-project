import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
    OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('users')
export class User {


  @PrimaryGeneratedColumn('uuid')
  id!:string;



  @Column()
  firstName!:string;



  @Column()
  lastName!:string;



  @Column({
    unique:true,
  })
  email!:string;



  @Column()
  password!:string;



  @Column({
    default:'JOB_SEEKER',
  })
  role!:string;



  @Column({
    default:'ACTIVE',
  })
  status!:string;

 @OneToOne(
 ()=>Company,
 company=>company.user,
)
company!:Company;


  @CreateDateColumn()
  createdAt!:Date;



  @UpdateDateColumn()
  updatedAt!:Date;


 
}