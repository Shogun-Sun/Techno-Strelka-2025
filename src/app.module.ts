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
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';
import { T2apiModule } from './t2api/t2api.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Session]),
    UserModule,
    SessionModule,
    DatabaseModule,
    PagesModule,
    AdminModule,
    ReviewsModule,
    T2apiModule,
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
          store: new SequelizeStore(this.sessionService),
          secret: SESSION_SECRET || 'secret',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24,
          },
        }),
      )
      .forRoutes('*');
  }
}
