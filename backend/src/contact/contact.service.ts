import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactMessageStatus } from './enums/contact-message-status.enum';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  // ==========================================
  // CREATE MESSAGE
  // Public - no login required
  // ==========================================

  async create(dto: CreateContactDto) {
    const contactMessage =
      this.contactRepository.create({
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        status: ContactMessageStatus.UNREAD,
      });

    const savedMessage =
      await this.contactRepository.save(
        contactMessage,
      );

    return {
      message: 'Your message has been sent successfully.',
      id: savedMessage.id,
    };
  }

  // ==========================================
  // ADMIN - GET ALL MESSAGES
  // ==========================================

  async findAll() {
    return this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // ==========================================
  // ADMIN - GET ONE MESSAGE
  // ==========================================

  async findOne(id: string) {
    const message =
      await this.contactRepository.findOne({
        where: { id },
      });

    if (!message) {
      throw new NotFoundException(
        'Contact message not found',
      );
    }

    return message;
  }

  // ==========================================
  // ADMIN - MARK READ
  // ==========================================

  async markAsRead(id: string) {
    const message = await this.findOne(id);

    message.status =
      ContactMessageStatus.READ;

    return this.contactRepository.save(message);
  }

  // ==========================================
  // ADMIN - DELETE
  // ==========================================

  async remove(id: string) {
    const message = await this.findOne(id);

    await this.contactRepository.remove(message);

    return {
      message: 'Contact message deleted successfully.',
    };
  }

  // ==========================================
  // ADMIN - UNREAD COUNT
  // ==========================================

  async getUnreadCount() {
    return this.contactRepository.count({
      where: {
        status: ContactMessageStatus.UNREAD,
      },
    });
  }
}