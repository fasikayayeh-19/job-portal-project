import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';

import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';

import { UpdateProfileDto } from './dto/update-profile.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =====================================================
  // GET PROFILE
  // =====================================================

  
  
  

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any) {
    return req.user;
  }

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      user.id,
      dto,
    );
  }

  // =====================================================
  // UPLOAD PROFILE IMAGE
  // =====================================================

  @Post('profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/profile-images',
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (
        req,
        file,
        callback,
      ) => {
        if (
          !file.mimetype.startsWith('image/')
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
    }),
  )
  uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfileImage(
      user.id,
      file,
    );
  }

  // =====================================================
  // ADMIN TEST
  // =====================================================

  @Get('admin-test')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  adminTest() {
    return {
      message: 'Welcome Admin',
    };
  }


@Delete('account')
@UseGuards(JwtAuthGuard)
async deleteAccount(@Request() req) {
  return this.usersService.deleteAccount(req.user.id);
}




   @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );

    return {
      message: 'Password changed successfully',
    };
  }
}