import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class JobType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => Job,
    (job) => job.jobType,
  )
  jobs!: Job[];
}