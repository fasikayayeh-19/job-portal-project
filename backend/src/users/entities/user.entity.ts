import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Notification } from '../../notifications/entities/notification.entity';
import { Company } from '../../companies/entities/company.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  
  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: 'JOB_SEEKER',
  })
  role!: string;

  @Column({
    default: 'ACTIVE',
  })
  status!: string;

  @OneToOne(
    () => Company,
    company => company.user,
  )
  company?: Company;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(
    () => Application,
    application => application.seeker,
  )
  applications!: Application[];

  @OneToMany(
    () => Notification,
    notification => notification.user,
  )
  notifications!: Notification[];
}