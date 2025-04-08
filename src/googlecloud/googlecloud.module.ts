import { Module } from '@nestjs/common';
import { GoogleCloudService } from './googlecloud.service';
import { GoogleCloudController } from './googlecloud.controller';

@Module({
  controllers: [GoogleCloudController],
  providers: [GoogleCloudService],
})
export class GooglecloudModule {}
