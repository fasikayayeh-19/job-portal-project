import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { UpdateProfileDto } from './dto/update-profile.dto';

import { Multer } from 'multer';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}


    async create(data: Partial<User>): Promise<User> {
  const user = this.usersRepository.create(data);

  return this.usersRepository.save(user);
}
  // =====================================================
  // FIND USER BY ID
  // =====================================================

  async findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  // =====================================================
  // FIND USER BY EMAIL
  // =====================================================

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  // =====================================================
  // UPDATE BASIC PROFILE
  // =====================================================

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    const user =
      await this.usersRepository.findOne({
        where: { id: userId },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    Object.assign(user, dto);

    const updatedUser =
      await this.usersRepository.save(user);

    return {
      message: 'Profile updated successfully',

      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        location: updatedUser.location,
        profileImageUrl:
          updatedUser.profileImageUrl,
      },
    };
  }

  // =====================================================
  // UPDATE PROFILE IMAGE
  // =====================================================

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Profile image is required',
      );
    }

    const user =
      await this.usersRepository.findOne({
        where: { id: userId },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    user.profileImageUrl =
      `/uploads/profile-images/${file.filename}`;

    const updatedUser =
      await this.usersRepository.save(user);

    return {
      message:
        'Profile image uploaded successfully',

      profileImageUrl:
        updatedUser.profileImageUrl,
    };
  }

  
  async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!passwordMatches) {
    throw new UnauthorizedException(
      'Current password is incorrect',
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10,
  );

  user.password = hashedPassword;

  await this.usersRepository.save(user);

  return {
    message: 'Password changed successfully',
  };
}
async deleteAccount(userId: string) {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.usersRepository.remove(user);

  return {
    message: 'Account deleted successfully',
  };
}
}