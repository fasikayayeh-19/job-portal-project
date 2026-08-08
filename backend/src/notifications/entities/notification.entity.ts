import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class Notification {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  message!: string;

  @Column({
    default: false,
  })
  isRead!: boolean;

  @ManyToOne(
    () => User,
    user => user.notifications,
    {
      onDelete: 'CASCADE',
    },
  )
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

}