import { CanActivate, ExecutionContext } from '@nestjs/common';
const { promisify } = require('util');
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      //1)check if there a bararer token
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      )
        token = req.headers.authorization.split(' ')[1];
      if (!token) return false;

      // 2) Verification token
      let decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET || 'this_is_a_temporary_secret_for_jwt',
      );

      // 3) Check if user still exists
      const currentUser = await this.userService.findUser(decoded.id);
      if (!currentUser) return false;

      // // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      return true;
    } catch (e) {
      return false;
    }
  }
}
