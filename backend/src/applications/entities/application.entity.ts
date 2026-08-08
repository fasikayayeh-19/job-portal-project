import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';


import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

import { ApplicationStatus } from '../enums/application-status.enum';


@Entity()
export class Application {


  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column({
    type:'text',
    nullable:true
  })
  coverLetter!: string;



  @Column({
    type:'enum',
    enum:ApplicationStatus,
    default:ApplicationStatus.PENDING_REVIEW
  })
  status!:ApplicationStatus;



  @ManyToOne(
    ()=>User,
    user=>user.applications,
    {
      onDelete:'CASCADE'
    }
  )
  @JoinColumn()
  seeker!:User;



  @ManyToOne(
    ()=>Job,
    job=>job.applications,
    {
      onDelete:'CASCADE'
    }
  )
  @JoinColumn()
  job!:Job;



  @CreateDateColumn()
  createdAt!:Date;


  @UpdateDateColumn()
  updatedAt!:Date;

}