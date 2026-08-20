import { Module } from '@nestjs/common';
import { JobtypesController } from './jobtypes.controller';

@Module({
  controllers: [JobtypesController]
})
export class JobtypesModule {}
