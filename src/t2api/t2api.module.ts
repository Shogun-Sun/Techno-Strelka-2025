import { Module } from '@nestjs/common';
import { T2apiService } from './t2api.service';
import { T2apiController } from './t2api.controller';

@Module({
  controllers: [T2apiController],
  providers: [T2apiService],
})
export class T2apiModule {}
