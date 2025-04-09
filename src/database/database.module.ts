import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DATABASE_PATH } from 'src/config';
import { User } from './models/user.model';
import { Session } from './models/session.model';
import { Review } from './models/reviews.model';
import { Chip } from './models/chips.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: DATABASE_PATH,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Session, Review, Chip],
      logging: false,
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {}
