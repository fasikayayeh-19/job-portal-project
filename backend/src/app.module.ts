import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ApplicationsModule } from './applications/applications.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { JobsModule } from './jobs/jobs.module';
import { CategoriesModule } from './categories/categories.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';

@Module({
  imports: [
    // =====================================================
    // Configuration
    // =====================================================

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // =====================================================
    // Database
    // =====================================================

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get('DB_HOST'),

        port: Number(
          config.get('DB_PORT'),
        ),

        username: config.get('DB_USERNAME'),

        password: config.get('DB_PASSWORD'),

        database: config.get('DB_DATABASE'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    // =====================================================
    // Uploaded files
    // =====================================================

    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'uploads',
      ),

      serveRoot: '/uploads',
    }),

    // =====================================================
    // Application modules
    // =====================================================

    UsersModule,

    AuthModule,

    CompaniesModule,

    ApplicationsModule,

    NotificationsModule,

    AdminModule,

    JobsModule,

    CategoriesModule,

    SavedJobsModule,
  ],

  providers: [
    // Global guards can be added here later.
  ],
})
export class AppModule {}