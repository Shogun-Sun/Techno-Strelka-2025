import { Module } from '@nestjs/common';
import { ChipsService } from './chips.service';
import { ChipsController } from './chips.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chip } from 'src/database/models/chips.model';

@Module({
  imports: [SequelizeModule.forFeature([Chip])],
  controllers: [ChipsController],
  providers: [ChipsService],
})
export class ChipsModule {}
