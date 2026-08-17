
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CompanyStatus } from '../enums/company-status.enum';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyName!: string;

  @Column({
    nullable: true,
  })
  description!: string;

  @Column({
    nullable: true,
  })
  website!: string;

  @Column({
    nullable: true,
  })
  location!: string;

  @Column({
    nullable: true,
  })
  logoUrl!: string;

  @Column({
    default: CompanyStatus.PENDING,
  })
  status!: CompanyStatus;

  @OneToOne(
    () => User,
    (user) => user.company,
  )
  @JoinColumn()
  user!: User;

  @OneToMany(
    () => Job,
    (job) => job.company,
  )
  jobs!: Job[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
