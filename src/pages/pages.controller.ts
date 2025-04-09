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
  @Get('/')
  map(@Res() res: Response) {
    res.sendFile(this.pagePath('map.html'));
  }

  @ApiOperation({ summary: 'Страница чат бота' })
  @Get('chatbot')
  chatBotPage(@Res() res: Response) {
    res.sendFile(this.pagePath('ChatBot.html'));
  }

  pagePath(file: string) {
    return join(__dirname, '..', '..', 'public', file);
  }

  @Get('testOffice')
  testOffice(@Res() res: Response) {
    res.sendFile(this.pagePath('TestOffice.html'));
  }
}
