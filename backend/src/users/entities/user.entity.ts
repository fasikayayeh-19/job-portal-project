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

  // =====================================================
  // BASIC PROFILE
  // =====================================================

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

  // =====================================================
  // PROFILE INFORMATION
  // =====================================================

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  professionalTitle?: string;

@Column({ type: 'text', nullable: true })
skills?: string;

@Column({ type: 'text', nullable: true })
experience?: string;

@Column({ type: 'text', nullable: true })
education?: string;

@Column({ type: 'text', nullable: true })
bio?: string;

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  @Column({ nullable: true })
  profileImageUrl?: string;

  // =====================================================
  // RESUME
  // =====================================================

  @Column({ nullable: true })
  resumeUrl?: string;

  @Column({ nullable: true })
  resumeFileName?: string;

  // =====================================================
  // COMPANY RELATION
  // =====================================================

  @OneToOne(
    () => Company,
    company => company.user,
  )
  company?: Company;

  // =====================================================
  // APPLICATIONS
  // =====================================================

  @OneToMany(
    () => Application,
    application => application.seeker,
  )
  applications!: Application[];

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  @OneToMany(
    () => Notification,
    notification => notification.user,
  )
  notifications!: Notification[];

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}