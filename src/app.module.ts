import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { DatabaseModule } from './database/database.module';
import { SessionService } from './session/session.service';
import { SESSION_SECRET } from './config';
import { SequelizeStore } from './session/sequelize-store';
import * as session from 'express-session';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from './database/models/session.model';
import { PagesModule } from './pages/pages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GooglecloudModule } from './chat-bot/chat-bot.module';
import { ChipsModule } from './chips/chips.module';
import { T2apiModule } from './t2api/t2api.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Session]),
    UserModule,
    SessionModule,
    DatabaseModule,
    PagesModule,
    ReviewsModule,
    GooglecloudModule,
    T2apiModule,
    ChipsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private sessionService: SessionService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        session({
          store: new SequelizeStore(this.sessionService), //Настройка хранилища сессий
          secret: SESSION_SECRET || 'secret', //Секрет для подписания sid.
          resave: false, // Не перезаписывать сессию, если она не изменялась
          saveUninitialized: false, // Не сохранять сессию, если она не была инициализирована
          cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24,
          },
        }),
      )
      .forRoutes('*'); // Применение middleware ко всем маршрутам
  }
}
