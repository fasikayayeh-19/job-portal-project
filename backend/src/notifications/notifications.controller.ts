import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('my-notifications')
  @UseGuards(JwtAuthGuard)
  getMyNotifications(
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.getMyNotifications(user);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAsRead(
      id,
      user,
    );
  }
}