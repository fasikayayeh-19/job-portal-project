import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

import { Application } from './entities/application.entity';
import { Job } from '../jobs/entities/job.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      Job,
    ]),
    NotificationsModule,
    
    MailModule,
  ],

  controllers: [
    ApplicationsController,
  ],

  providers: [
    ApplicationsService,
  ],
})
export class ApplicationsModule {}