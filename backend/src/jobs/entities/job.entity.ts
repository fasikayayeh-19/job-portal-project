import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';


import { Company } from '../../companies/entities/company.entity';
import { Category } from '../../categories/entities/category.entity';
import { Application } from '../../applications/entities/application.entity';



export enum JobStatus {

  PENDING = 'PENDING',

  APPROVED = 'APPROVED',

  PUBLISHED = 'PUBLISHED',

  CLOSED = 'CLOSED',

}


@Entity()
export class Job {


  @PrimaryGeneratedColumn('uuid')
  id!:string;



  @Column()
  title!:string;



  @Column('text')
  description!:string;



  @Column('text')
  requirements!:string;



  @Column('simple-array')
  skills!:string[];



  @Column()
  location!:string;



  @Column()
  jobType!:string;



  @Column()
  experience!:string;



  @Column({
    nullable:true
  })
  salary!:string;



  @Column({
    type:'enum',
    enum:JobStatus,
    default:JobStatus.PENDING
  })
  status!:JobStatus;



  @Column({
    type:'date',
    nullable:true
  })
  deadline!:Date;



  @ManyToOne(
    ()=>Company,
    company=>company.jobs,
    {
      onDelete:'CASCADE'
    }
  )
  @JoinColumn()
  company!:Company;


  @ManyToOne(
  () => Category,
  category => category.jobs,
)
@JoinColumn()
category!: Category;
  @OneToMany(
  ()=>Application,
  application=>application.job
)
applications!: Application[];

  @CreateDateColumn()
  createdAt!:Date;



  @UpdateDateColumn()
  updatedAt!:Date;


}