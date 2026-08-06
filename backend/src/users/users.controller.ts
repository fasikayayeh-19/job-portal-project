import {
 Controller,
 Get,
 Req,
 UseGuards,
} from '@nestjs/common';


import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';


@Controller('users')
export class UsersController {


 @Get('profile')
 @UseGuards(JwtAuthGuard)
 profile(
   @Req() req:any,
 ){

   return req.user;

 }



 @Get('admin-test')
 @UseGuards(
   JwtAuthGuard,
   RolesGuard,
 )
 @Roles('ADMIN')
 adminTest(){

   return {
     message:'Welcome Admin'
   };

 }

}