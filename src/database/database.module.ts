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
    // Инициализация подключения к базе данных SQLite
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: DATABASE_PATH,
      autoLoadModels: true,
      synchronize: true, // Синхронизация моделей с БД (для dev-режима)
      models: [User, Session, Review, Chip], // Явное указание моделей
      logging: false,
    }),
    // Подключаем модель Chip для использования в сервисах
    SequelizeModule.forFeature([Chip]),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {}
