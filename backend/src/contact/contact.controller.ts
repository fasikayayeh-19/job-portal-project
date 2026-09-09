import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
  ) {}

  // ==========================================
  // PUBLIC
  // Anyone can send a message
  // ==========================================

  @Post()
  async create(
    @Body() dto: CreateContactDto,
  ) {
    return this.contactService.create(dto);
  }

  // ==========================================
  // ADMIN
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/messages')
  async findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/messages/unread-count')
  async getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/messages/:id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.contactService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/messages/:id/read')
  async markAsRead(
    @Param('id') id: string,
  ) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/messages/:id')
  async remove(
    @Param('id') id: string,
  ) {
    return this.contactService.remove(id);
  }
}