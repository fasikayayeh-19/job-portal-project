import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateApplicationNoteDto } from './dto/update-application-note.dto';
import { Repository } from 'typeorm';

import { Application } from './entities/application.entity';

import { Job } from '../jobs/entities/job.entity';

import { CreateApplicationDto } from './dto/create-application.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    private notificationsService: NotificationsService,

    private mailService: MailService,
  ) {}

  async create(dto: CreateApplicationDto, user: any) {
    // Find job
    const job = await this.jobRepository.findOne({
      where: {
        id: dto.jobId,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check duplicate application
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        job: {
          id: job.id,
        },

        seeker: {
          id: user.id,
        },
      },
    });

    if (existingApplication) {
      throw new ForbiddenException('You already applied for this job');
    }

    // Create application
    const application = this.applicationRepository.create({
      coverLetter: dto.coverLetter,

      job: job,

      seeker: user,
    });

    return this.applicationRepository.save(application);
  }

  async getJobApplicants(
  jobId: string,
  user: any,
) {
  const job = await this.jobRepository.findOne({
    where: {
      id: jobId,
    },
    relations: {
      company: {
        user: true,
      },
    },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  if (job.company.user.id !== user.id) {
    throw new ForbiddenException(
      'You cannot view applicants for this job',
    );
  }

  return this.applicationRepository.find({
    where: {
      job: {
        id: jobId,
      },
    },

    relations: {
      seeker: true,
    },

    order: {
      createdAt: 'DESC',
    },
  });
}

async updateNote(
  id: string,
  dto: UpdateApplicationNoteDto,
  user: any,
) {
  const application =
    await this.applicationRepository.findOne({
      where: {
        id,
      },

      relations: {
        job: {
          company: {
            user: true,
          },
        },
      },
    });

  if (!application) {
    throw new NotFoundException(
      'Application not found',
    );
  }

  // Make sure this company owns the job
  if (
    application.job.company.user.id !== user.id
  ) {
    throw new ForbiddenException(
      'You cannot update this application',
    );
  }

  application.companyNote = dto.note;

  return this.applicationRepository.save(
    application,
  );
}

  async updateStatus(id: string, dto: UpdateApplicationStatusDto, user: any) {
    const application = await this.applicationRepository.findOne({
      where: {
        id,
      },

      relations: {
        seeker: true,
        job: {
          company: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.company.user.id !== user.id) {
      throw new ForbiddenException('You cannot update this application');
    }

    application.status = dto.status;

    await this.notificationsService.create(
      application.seeker.id,
      'Application Update',
      `Your application status changed to ${dto.status}`,
    );

    await this.mailService.sendApplicationStatusEmail(
      application.seeker.email,
      dto.status,
    );

    return this.applicationRepository.save(application);
  }


  async getMyApplications(user: any) {
  return this.applicationRepository.find({
    where: {
      seeker: {
        id: user.id,
      },
    },

    relations: {
      job: {
        company: true,
        category: true,
      },
    },

    order: {
      createdAt: 'DESC',
    },
  });
}



async getCompanyApplicants(user: any) {
  const applications = await this.applicationRepository.find({
    where: {
      job: {
        company: {
          user: {
            id: user.id,
          },
        },
      },
    },

    relations: {
      seeker: true,
      job: {
        category: true,
      },
    },

    order: {
      createdAt: 'DESC',
    },
  });

 return applications.map((application) => ({
  id: application.id,
  coverLetter: application.coverLetter,
  companyNote: application.companyNote,
  status: application.status,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,

  seeker: {
    id: application.seeker.id,
    firstName: application.seeker.firstName,
    lastName: application.seeker.lastName,
    email: application.seeker.email,
    phone: application.seeker.phone,
    professionalTitle: application.seeker.professionalTitle,
    profileImageUrl: application.seeker.profileImageUrl,
    resumeUrl: application.seeker.resumeUrl,
    resumeFileName: application.seeker.resumeFileName,
    skills: application.seeker.skills,
    experience: application.seeker.experience,
    education: application.seeker.education,
    bio: application.seeker.bio,
  },

  job: {
    id: application.job.id,
    title: application.job.title,
    location: application.job.location,
    jobType: application.job.jobType,
    category: application.job.category
      ? {
          id: application.job.category.id,
          name: application.job.category.name,
        }
      : undefined,
  },
}));

}}