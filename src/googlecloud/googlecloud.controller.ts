import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { GoogleCloudService } from './googlecloud.service';
import { DialogPromptDto } from './dto/dialogPrompt.dto';

@Controller('chat/bot')
export class GoogleCloudController {
  constructor(private readonly googlecloudService: GoogleCloudService) {}
  @Post('dialog')
  getResponse(@Body(new ValidationPipe()) prompt: DialogPromptDto) {
    return this.googlecloudService.accessGeminiApi(prompt);
  }
}
