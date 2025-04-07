import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DATABASE_PATH } from 'src/config';
import { User } from './models/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: DATABASE_PATH,
      autoLoadModels: true,
      synchronize: true,
      models: [User],
      logging: false,
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {}
