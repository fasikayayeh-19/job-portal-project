import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';

import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      Job,
      Application,
    ]),
    NotificationsModule,
    MailModule,
  ],

  controllers: [
    AdminController,
  ],

  providers: [
    AdminService,
  ],
})
export class AdminModule {}