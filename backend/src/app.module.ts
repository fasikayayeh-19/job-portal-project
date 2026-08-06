import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ApplicationsModule } from './applications/applications.module';
import { NotificationsModule } from './notifications/notifications.module';
// import { APP_GUARD } from '@nestjs/core';

// import { RolesGuard } from './common/guards/roles.guard';
import { AdminModule } from './admin/admin.module';
import { JobsModule } from './jobs/jobs.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get('DB_HOST'),

        port: Number(config.get('DB_PORT')),

        username: config.get('DB_USERNAME'),

        password: config.get('DB_PASSWORD'),

        database: config.get('DB_DATABASE'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    UsersModule,

    AuthModule,

    CompaniesModule,

    ApplicationsModule,

    NotificationsModule,

    AdminModule,

    JobsModule,
  ],
  providers:[

// {
//  provide:APP_GUARD,
//  useClass:RolesGuard,
// }

]
})
export class AppModule {}