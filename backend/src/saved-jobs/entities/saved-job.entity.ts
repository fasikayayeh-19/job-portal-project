import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
@Unique(['user', 'job'])
export class SavedJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  user!: User;

  @ManyToOne(
    () => Job,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  job!: Job;

  @CreateDateColumn()
  createdAt!: Date;
}