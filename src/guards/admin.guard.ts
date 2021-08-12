import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('ini', request);

    if (!request.currentUser) return false;
    console.log('masuk', request.currentUser.admin);
    return request.currentUser.admin;
  }
}
