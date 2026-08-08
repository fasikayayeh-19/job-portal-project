import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
@Injectable()
export class NotificationsService {

  constructor(

    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

  ) {

    
  }
async create(
  userId: string,
  title: string,
  message: string,
) {

  console.log('Creating notification for:', userId);

  const notification = this.notificationRepository.create({
    user: {
      id: userId,
    },
    title,
    message,
  });

  const saved = await this.notificationRepository.save(notification);

  console.log('Notification saved:', saved);

  return saved;
}

async getMyNotifications(user: any) {

  return this.notificationRepository.find({

    where: {
      user: {
        id: user.id,
      },
    },

    order: {
      createdAt: 'DESC',
    },

  });

}



async markAsRead(
  id: string,
  user: any,
) {
  const notification =
    await this.notificationRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

  if (!notification) {
    throw new NotFoundException('Notification not found');
  }

  if (notification.user.id !== user.id) {
    throw new ForbiddenException('You do not have permission');
  }

  notification.isRead = true;

  return this.notificationRepository.save(notification);
}
}