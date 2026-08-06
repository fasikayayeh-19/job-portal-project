import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {

    const existingUser =
      await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    const user =
await this.usersService.create({

firstName:dto.firstName,

lastName:dto.lastName,

email:dto.email,

password:hashedPassword,

role:dto.role,

});

    return user;
  }

  async login(dto: LoginDto) {

    const user =
      await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    
    };

    const accessToken =
      this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken,
      user,
    };
  }
}