import { Controller, Post, Query } from '@nestjs/common';
import { GoogleCloudService } from './googlecloud.service';

@Controller('googlecloud')
export class GoogleCloudController {
  constructor(private readonly googlecloudService: GoogleCloudService) {}
  @Post('/test')
  getResponse(@Query('prompt') prompt: string) {
    return this.googlecloudService.accessGeminiApi(prompt);
  }
}
