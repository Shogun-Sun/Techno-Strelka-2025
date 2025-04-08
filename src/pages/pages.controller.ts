import { Controller, Get, Res } from '@nestjs/common';
import { PagesService } from './pages.service';
import { Response } from 'express';
import { join } from 'path';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @ApiOperation({ summary: 'Страница регистрации-авторизации' })
  @Get('loginpage')
  loginPage(@Res() res: Response) {
    res.sendFile(this.pagePath('login_reg.html'));
  }

  @ApiOperation({ summary: 'Главная страница' })
  @Get('map')
  map(@Res() res: Response) {
    res.sendFile(this.pagePath('map.html'));
  }

  pagePath(file: string) {
    return join(__dirname, '..', '..', 'public', file);
  }
}
