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
  type: 'text',
  nullable: true,
})
coverLetter!: string | null;


  @Column({
    type:'enum',
    enum:ApplicationStatus,
    default:ApplicationStatus.PENDING_REVIEW
  })
  status!:ApplicationStatus;
 @Column({
  type: 'text',
  nullable: true,
})
companyNote?: string;


  @ManyToOne(
    ()=>User,
    user=>user.applications,
    {
      onDelete:'CASCADE'
    }
  )
  @JoinColumn()
  seeker!:User;

 @Column({
  type: 'text',
  nullable: true,
})
resumeUrl!: string | null;

@Column({
  type: 'text',
  nullable: true,
})
resumeFileName!: string | null;
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