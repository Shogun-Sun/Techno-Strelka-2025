import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { DialogPromptDto } from './dto/dialogPrompt.dto';

@Controller('chat/bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) {}
  @Post('dialog')
  getResponse(@Body(new ValidationPipe()) prompt: DialogPromptDto) {
    return this.chatBotService.accessGeminiApi(prompt);
  }
}
