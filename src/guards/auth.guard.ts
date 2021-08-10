import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate{
  canActivate(context: ExecutionContext){
    const {session: {userId}} = context.switchToHttp().getRequest()

    return userId;
  }
}
