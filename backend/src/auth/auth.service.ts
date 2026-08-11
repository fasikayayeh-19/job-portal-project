import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly companiesService: CompaniesService,
  ) {}

  // =========================
  // REGISTER
  // =========================

  async register(dto: RegisterDto) {
    // 1. Check existing email
    const existingUser =
      await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    // 3. Create user
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // 4. Company is optional
    let company: {
      companyName: string;
    } | null = null;

    // 5. Create company for COMPANY account
    if (dto.role === 'COMPANY') {
 const createdCompany =
  await this.companiesService.create(
    {
      companyName: dto.companyName!,
      website: dto.website,
      phone: dto.phone,
      description: dto.description,
      location: dto.location,
    },
    user,
  );

  company = {
    companyName: createdCompany.companyName,
  };
}
    // 6. JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // 7. Generate token
    const accessToken =
      this.jwtService.sign(payload);

    // 8. Return authentication data
    return {
      accessToken,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,

        company: company
          ? {
              companyName: company.companyName,
            }
          : undefined,
      },
    };
  }

  // =========================
  // LOGIN
  // =========================

  async login(dto: LoginDto) {
    // 1. Find user
    const user =
      await this.usersService.findByEmail(
        dto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // 2. Check password
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

    // 3. JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // 4. Generate token
    const accessToken =
      this.jwtService.sign(payload);

    // 5. Return authentication data
    return {
      message: 'Login successful',

      accessToken,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}