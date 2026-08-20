import { Injectable,NotFoundException,ForbiddenException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import {
  FindOptionsWhere,
  
  
} from 'typeorm';
import { AdminJobQueryDto } from '../jobs/dto/admin-job-query.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';
import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { CompanyStatus } from '../companies/enums/company-status.enum';
import { User } from '../users/entities/user.entity';
import { ApplicationStatus } from '../applications/enums/application-status.enum';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class AdminService {

constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,

  @InjectRepository(Company)
  private companyRepository: Repository<Company>,

  @InjectRepository(Job)
  private jobRepository: Repository<Job>,

  @InjectRepository(Application)
  private applicationRepository: Repository<Application>,

  private readonly notificationsService: NotificationsService,

  private readonly mailService: MailService,
) {}

async adminFindAll(query: AdminJobQueryDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const qb = this.jobRepository
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.company', 'company')
    .leftJoinAndSelect('job.category', 'category');

  // ADMIN CAN ONLY SEE PUBLISHED AND CLOSED JOBS
  qb.andWhere(
    'job.status IN (:...statuses)',
    {
      statuses: [
        'PUBLISHED',
        'CLOSED',
      ],
    },
  );

  // SEARCH
  if (query.search) {
    qb.andWhere(
      `(
        LOWER(job.title) LIKE LOWER(:search)
        OR LOWER(job.description) LIKE LOWER(:search)
        OR LOWER(company.companyName) LIKE LOWER(:search)
      )`,
      {
        search: `%${query.search}%`,
      },
    );
  }

  // STATUS FILTER
  if (query.status) {
    qb.andWhere(
      'job.status = :status',
      {
        status: query.status,
      },
    );
  }

  // NEWEST FIRST
  qb.orderBy(
    'job.createdAt',
    'DESC',
  );

  // PAGINATION
  qb.skip(
    (page - 1) * limit,
  );

  qb.take(limit);

  const [jobs, total] =
    await qb.getManyAndCount();

  return {
    data: jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit,
    ),
  };
}


async getUsers(
  page = 1,
  limit = 10,
  role?: UserRole,
  status?: UserStatus,
) {
  const skip = (page - 1) * limit;

  const where: FindOptionsWhere<User> = {};

  if (role) {
    where.role = role;
  }

  if (status) {
    where.status = status;
  }

  const [users, total] = await this.userRepository.findAndCount({
    where,

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },

    order: {
      createdAt: 'DESC',
    },

    skip,
    take: limit,
  });

  return {
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
async blockUser(id: string) {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.status === UserStatus.BLOCKED) {
    return {
      message: 'User is already blocked',
    };
  }

  await this.userRepository.update(id, {
    status: UserStatus.BLOCKED,
  });

  return {
    message: 'User blocked successfully',
  };
}

async unblockUser(id: string) {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.status === UserStatus.ACTIVE) {
    return {
      message: 'User is already active',
    };
  }

  await this.userRepository.update(id, {
    status: UserStatus.ACTIVE,
  });

  return {
    message: 'User unblocked successfully',
  };
}


  async getPendingCompanies() {
    return this.companyRepository.find({
      where: {
        status: CompanyStatus.PENDING,
      },

      relations: {
        user:true,

    },
    });
  }

 async approveCompany(id: string) {
  const company = await this.companyRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  if (company.status !== CompanyStatus.PENDING) {
    throw new BadRequestException(
      'Only pending companies can be approved',
    );
  }

  company.status = CompanyStatus.APPROVED;

  await this.companyRepository.save(company);

  await this.notifyCompanyStatusChange(
    company,
    'Company approved',
    'REJECTED',
    `Your company "${company.companyName}" has been approved. You can now access your company dashboard and manage your jobs.`,
  );

  return {
    message: 'Company approved successfully',
  };
}




  async getApplications() {
  return this.applicationRepository.find({
    relations: {
      seeker: true,
      job: {
        company: true,
      },
    },

    order: {
      createdAt: 'DESC',
    },
  });
}
  async getJobs(page = 1, limit = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;

    const qb = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.category', 'category')
      .orderBy('job.createdAt', 'DESC');

    if (search) {
      qb.andWhere(
        '(job.title ILIKE :search OR company.companyName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      qb.andWhere('job.status = :status', { status });
    }

    const [data, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

async getDashboardStats() {
  const [
    totalUsers,
    totalCompanies,
    pendingCompanies,
    approvedCompanies,
    totalJobs,
    totalApplications,

    applicationStatus,
    applicationsOverTime,
    jobsByCategory,
  ] = await Promise.all([
    // ============================================
    // BASIC STATISTICS
    // ============================================

    this.userRepository.count(),

    this.companyRepository.count(),

    this.companyRepository.count({
      where: {
        status: CompanyStatus.PENDING,
      },
    }),

    this.companyRepository.count({
      where: {
        status: CompanyStatus.APPROVED,
      },
    }),

    this.jobRepository.count(),

    this.applicationRepository.count(),

    // ============================================
    // APPLICATION STATUS
    // ============================================

    this.getApplicationStatus(),

    // ============================================
    // APPLICATIONS OVER TIME
    // ============================================

    this.applicationRepository
      .createQueryBuilder('application')
      .select(
        "TO_CHAR(DATE_TRUNC('month', application.createdAt), 'YYYY-MM')",
        'month',
      )
      .addSelect('COUNT(application.id)', 'applications')
      .groupBy(
        "DATE_TRUNC('month', application.createdAt)",
      )
      .orderBy(
        "DATE_TRUNC('month', application.createdAt)",
        'ASC',
      )
      .getRawMany(),

    // ============================================
    // JOBS BY CATEGORY
    // ============================================

    this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(job.id)', 'jobs')
      .where('category.name IS NOT NULL')
      .groupBy('category.name')
      .orderBy('COUNT(job.id)', 'DESC')
      .getRawMany(),
  ]);

  return {
    totalUsers,
    totalCompanies,
    pendingCompanies,
    approvedCompanies,
    totalJobs,
    totalApplications,

    applicationStatus,

    companyStatus: {
      pending: pendingCompanies,
      approved: approvedCompanies,
    },

    applicationsOverTime: applicationsOverTime.map((item) => ({
      month: item.month,
      applications: Number(item.applications),
    })),

    jobsByCategory: jobsByCategory.map((item) => ({
      category: item.category,
      jobs: Number(item.jobs),
    })),
  };
}

private async getApplicationStatus() {
  const [
    pendingReview,
    test,
    interview,
    hired,
    declined,
  ] = await Promise.all([
    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.PENDING_REVIEW,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.TEST,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.INTERVIEW,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.HIRED,
      },
    }),

    this.applicationRepository.count({
      where: {
        status: ApplicationStatus.DECLINED,
      },
    }),
  ]);

  return {
    pendingReview,
    test,
    interview,
    hired,
    declined,
  };
}
  
async deleteUser(id: string, currentAdminId: string) {
  if (id === currentAdminId) {
    throw new ForbiddenException(
      'You cannot delete your own admin account',
    );
  }

  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.userRepository.delete(id);

  return {
    message: 'User deleted successfully',
  };
}
async getCompanies(
  page = 1,
  limit = 10,
  status?: CompanyStatus,
  search?: string,
) {
  const skip = (page - 1) * limit;

  const query = this.companyRepository
    .createQueryBuilder('company')
    .leftJoinAndSelect('company.user', 'user')
    .orderBy('company.createdAt', 'DESC')
    .skip(skip)
    .take(limit);

  if (status) {
    query.andWhere('company.status = :status', { status });
  }

  if (search) {
    query.andWhere(
      '(LOWER(company.companyName) LIKE LOWER(:search) OR LOWER(company.location) LIKE LOWER(:search))',
      {
        search: `%${search}%`,
      },
    );
  }

  const [companies, total] = await query.getManyAndCount();

  return {
    data: companies,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


async suspendCompany(id: string) {
  const company = await this.companyRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  if (company.status !== CompanyStatus.APPROVED) {
    throw new BadRequestException(
      'Only approved companies can be suspended',
    );
  }

  company.status = CompanyStatus.SUSPENDED;

  await this.companyRepository.save(company);

  await this.notifyCompanyStatusChange(
    company,
    'Company suspended',
    'SUSPENDED',
    `Your company "${company.companyName}" has been suspended by the administrator.`,
  );

  return {
    message: 'Company suspended successfully',
  };
}

async deleteCompanyAccount(userId: string) {
  const user = await this.userRepository.findOne({
    where: {
      id: userId,
      role: UserRole.COMPANY,
    },
    relations: {
      company: true,
    },
  });

  if (!user) {
    throw new NotFoundException('Company user not found');
  }

  await this.userRepository.delete(userId);

  return {
    message: 'Company account and related data deleted successfully',
  };
}



async activateCompany(id: string) {
  const company = await this.companyRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  if (company.status !== CompanyStatus.SUSPENDED) {
    throw new BadRequestException(
      'Only suspended companies can be activated',
    );
  }

  company.status = CompanyStatus.APPROVED;

  await this.companyRepository.save(company);

  await this.notifyCompanyStatusChange(
    company,
    'Company account restored',
    'APPROVED',
    `Your company "${company.companyName}" has been restored and can now use the platform again.`,
  );

  return {
    message: 'Company activated successfully',
  };
}

  async rejectCompany(id: string) {
  const company = await this.companyRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  if (company.status !== CompanyStatus.PENDING) {
    throw new BadRequestException(
      'Only pending companies can be rejected',
    );
  }

  company.status = CompanyStatus.REJECTED;

  await this.companyRepository.save(company);

  await this.notifyCompanyStatusChange(
    company,
    'Company registration rejected',
    'REJECTED',
    `Your company "${company.companyName}" registration has been rejected. Please contact support if you need more information.`,
  );

  return {
    message: 'Company rejected successfully',
  };



}

private async notifyCompanyStatusChange(
  company: Company,
  title: string,
  status: string,
  message: string,
) {
  if (!company.user) {
    return;
  }

  await this.notificationsService.create(
    company.user.id,
    title,
    message,
  );

  await this.mailService.sendCompanyStatusEmail(
    company.user.email,
    company.companyName,
    status,
    message,
  );
}

}


