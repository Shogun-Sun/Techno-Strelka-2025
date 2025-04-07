import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from 'src/database/models/session.model';

@Module({
  imports: [SequelizeModule.forFeature([Session])],
  controllers: [],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
