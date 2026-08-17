
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}

  // =====================================================
  // CREATE COMPANY
  // =====================================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  createCompany(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.create(
      dto,
      user,
    );
  }

  // =====================================================
  // GET MY COMPANY PROFILE
  // =====================================================

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMyCompany(
    @CurrentUser() user: any,
  ) {
    return this.companiesService.getMyCompany(
      user.id,
    );
  }

  // =====================================================
  // UPDATE MY COMPANY PROFILE
  // =====================================================

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  updateMyCompany(
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.updateMyCompany(
      user.id,
      dto,
    );
  }

  // =====================================================
  // UPLOAD COMPANY LOGO
  // =====================================================

@Post('logo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('COMPANY')
@UseInterceptors(
  FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/company',

      filename: (
        req,
        file,
        callback,
      ) => {
        const uniqueName =
          `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;

        callback(
          null,
          uniqueName,
        );
      },
    }),

    fileFilter: (
      req,
      file,
      callback,
    ) => {
      if (
        !file.mimetype.startsWith(
          'image/',
        )
      ) {
        return callback(
          new Error(
            'Only image files are allowed',
          ),
          false,
        );
      }

      callback(null, true);
    },

    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }),
)
async uploadLogo(
  @UploadedFile()
  file: Express.Multer.File,

  @CurrentUser()
  user: any,
) {
  if (!file) {
    throw new Error(
      'Company logo file is required',
    );
  }

  return this.companiesService.updateLogo(
    user.id,
    `/uploads/company/${file.filename}`,
  );
}



  
}
