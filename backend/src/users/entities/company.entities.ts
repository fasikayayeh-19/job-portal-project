import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  companyName!: string;

  @Column({ nullable: true })
  website!: string | null;

  @Column({ nullable: true })
  phone!: string | null;

  @Column({ nullable: true })
  description!: string | null;

  @OneToOne(
    () => User,
    (user) => user.company,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(
    () => Job,
    (job) => job.company,
  )
  jobs!: Job[];
}