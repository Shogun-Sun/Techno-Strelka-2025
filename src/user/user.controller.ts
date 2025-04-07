import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserDto } from './dto/newUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { SessionData } from 'express-session';
import { UserSession } from 'src/types/session';
import { Response } from 'express';
import { SessionAuth } from 'src/decorators/session.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/reg')
  newUser(@Body() newUserDto: NewUserDto) {
    return this.userService.newUser(newUserDto);
  }

  @Post('/log')
  async logUser(
    @Session() session: SessionData,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const user = await this.userService.validateUser(
      loginUserDto.user_email,
      loginUserDto.user_password,
    );

    if (!user) {
      return { message: 'Неверный email или пароль' };
    }

    session.user = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
    };

    return { message: 'Вы успешно авторизовались', user: session.user };
  }

  @Get('/profile')
  getProfile(@SessionAuth() user: UserSession) {
    return { message: 'Данные пользователя', user };
  }

  @Get('/logout')
  logout(
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!session.user) {
        throw new UnauthorizedException('Вы не авторизованые');
      }
      res.clearCookie('connect.sid');
      session.destroy();
      return { message: 'Вы успешно вышли из сессии' };
    } catch (err) {
      console.error(err);
    }
  }
}
