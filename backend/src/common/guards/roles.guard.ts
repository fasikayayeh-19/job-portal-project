import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate {

constructor(
 private reflector: Reflector,
){}


canActivate(
 context:ExecutionContext
){

const requiredRoles =
this.reflector.get<string[]>(
 'roles',
 context.getHandler(),
);


console.log(
"Required Roles:",
requiredRoles
);


if(!requiredRoles){
 return true;
}


const request =
context.switchToHttp().getRequest();


console.log(
"Request User:",
request.user
);


const user = request.user;


if(!user){
 throw new ForbiddenException(
  'User not found'
 );
}


if(!requiredRoles.includes(user.role)){

console.log(
"User Role:",
user.role
);

throw new ForbiddenException(
'You do not have permission'
);

}


return true;

}

}