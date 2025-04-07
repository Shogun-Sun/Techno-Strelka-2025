import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSession } from 'src/types/session';

export const SessionAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserSession | undefined = request.session?.user;

    if (!user) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return user;
  },
);
