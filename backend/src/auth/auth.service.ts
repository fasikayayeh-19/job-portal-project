import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UserStatus } from '../users/enums/user-status.enum';
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
  private formatUser(user: any, company?: any) {
  const companyData = company
    ? {
        companyName: company.companyName,
        logoUrl: company.logoUrl,
        profileImageUrl: company.profileImageUrl,
      }
    : user.company
      ? {
          companyName: user.company.companyName,
          logoUrl: user.company.logoUrl,
          profileImageUrl: user.company.profileImageUrl,
        }
      : undefined;

  return {
    id: user.id,
    email: user.email,
    role: user.role,

    firstName: user.firstName,
    lastName: user.lastName,

    phone: user.phone,
    location: user.location,
    professionalTitle: user.professionalTitle,
    bio: user.bio,

    profileImageUrl: user.profileImageUrl,

    resumeUrl: user.resumeUrl,
    resumeFileName: user.resumeFileName,

    company: companyData,
  };
}

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
  const hashedPassword =
    await bcrypt.hash(dto.password, 10);

  // 3. Create user
  const user = await this.usersService.create({
    email: dto.email,
    password: hashedPassword,
    role: dto.role,
    firstName: dto.firstName,
    lastName: dto.lastName,
  });

  // 4. Company
  let company: {
    companyName: string;
  } | null = null;

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
      companyName:
        createdCompany.companyName,
    };
  }

  // 5. JWT
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken =
    this.jwtService.sign(payload);

  // 6. Return complete user
  return {
    accessToken,

    user: this.formatUser(
      user,
      company,
    ),
  };
}

  // =========================
  // LOGIN
  // =========================

 async login(dto: LoginDto) {
  const user = await this.usersService.findByEmailWithCompany(
    dto.email,
  );

  if (!user) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  // Check account status
  if (user.status === UserStatus.BLOCKED) {
    throw new UnauthorizedException(
      'Your account has been blocked',
    );
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken =
    this.jwtService.sign(payload);

  return {
    message: 'Login successful',
    accessToken,
    user: this.formatUser(user),
  };
}
}