import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './entities/application.entity';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UpdateApplicationNoteDto } from './dto/update-application-note.dto';

import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private notificationsService: NotificationsService,

    private mailService: MailService,
  ) {}

  // =====================================================
  // JOB SEEKER - APPLY FOR JOB
  // =====================================================

  async create(dto: CreateApplicationDto, user: any) {
    // 1. Find job
    const job = await this.jobRepository.findOne({
      where: {
        id: dto.jobId,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // 2. Find the actual seeker profile
    const seeker = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });

    if (!seeker) {
      throw new NotFoundException(
        'Job seeker not found',
      );
    }

    // 3. Make sure the seeker has a resume
    if (!seeker.resumeUrl) {
      throw new ForbiddenException(
        'Please upload your resume before applying for a job',
      );
    }

    // 4. Check duplicate application
    const existingApplication =
      await this.applicationRepository.findOne({
        where: {
          job: {
            id: job.id,
          },

          seeker: {
            id: seeker.id,
          },
        },
      });

    if (existingApplication) {
      throw new ForbiddenException(
        'You already applied for this job',
      );
    }

    // 5. Create application
    const application =
      this.applicationRepository.create({
        coverLetter: dto.coverLetter || null,

        // Save a snapshot of the resume
        resumeUrl: seeker.resumeUrl,

        resumeFileName:
          seeker.resumeFileName || null,

        job,

        seeker,
      });

    // 6. Save application
    const savedApplication =
      await this.applicationRepository.save(
        application,
      );

    // 7. Optional notification to company
    // We can add this after the basic application flow works.

    return savedApplication;
  }

  // =====================================================
  // COMPANY - GET APPLICANTS FOR ONE JOB
  // =====================================================

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
      throw new NotFoundException(
        'Job not found',
      );
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

  // =====================================================
  // COMPANY - UPDATE PRIVATE NOTE
  // =====================================================

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

    // Make sure company owns the job
    if (
      application.job.company.user.id !==
      user.id
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

  // =====================================================
  // COMPANY - UPDATE APPLICATION STATUS
  // =====================================================

  async updateStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
    user: any,
  ) {
    const application =
      await this.applicationRepository.findOne({
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
      throw new NotFoundException(
        'Application not found',
      );
    }

    // Make sure company owns the job
    if (
      application.job.company.user.id !==
      user.id
    ) {
      throw new ForbiddenException(
        'You cannot update this application',
      );
    }

    application.status = dto.status;

    // Create notification for job seeker
    await this.notificationsService.create(
      application.seeker.id,
      'Application Update',
      `Your application status changed to ${dto.status}`,
    );

    // Send email
    await this.mailService.sendApplicationStatusEmail(
      application.seeker.email,
      dto.status,
    );

    return this.applicationRepository.save(
      application,
    );
  }

  // =====================================================
  // JOB SEEKER - MY APPLICATIONS
  // =====================================================

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

  // =====================================================
  // COMPANY - ALL APPLICANTS
  // =====================================================

  async getCompanyApplicants(user: any) {
    const applications =
      await this.applicationRepository.find({
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

    return applications.map(
      (application) => ({
        id: application.id,

        coverLetter:
          application.coverLetter,

        companyNote:
          application.companyNote,

        // IMPORTANT:
        // Resume submitted with this application
        resumeUrl:
          application.resumeUrl,

        resumeFileName:
          application.resumeFileName,

        status:
          application.status,

        createdAt:
          application.createdAt,

        updatedAt:
          application.updatedAt,

        seeker: {
          id: application.seeker.id,

          firstName:
            application.seeker.firstName,

          lastName:
            application.seeker.lastName,

          email:
            application.seeker.email,

          phone:
            application.seeker.phone,

          professionalTitle:
            application.seeker.professionalTitle,

          profileImageUrl:
            application.seeker.profileImageUrl,

          resumeUrl:
            application.seeker.resumeUrl,

          resumeFileName:
            application.seeker.resumeFileName,

          skills:
            application.seeker.skills,

          experience:
            application.seeker.experience,

          education:
            application.seeker.education,

          bio:
            application.seeker.bio,
        },

        job: {
          id: application.job.id,

          title:
            application.job.title,

          location:
            application.job.location,

          jobType:
            application.job.jobType,

          category:
            application.job.category
              ? {
                  id:
                    application.job.category.id,

                  name:
                    application.job.category.name,
                }
              : undefined,
        },
      }),
    );
  }
}