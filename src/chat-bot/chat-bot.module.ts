import { Module } from '@nestjs/common';
import { ChatBotService } from './chat-bot.service';
import { ChatBotController } from './chat-bot.controller';
import { ChatBotGateway } from './chat-bot.gateway';

@Module({
  controllers: [ChatBotController],
  providers: [ChatBotService, ChatBotGateway],
})
export class GooglecloudModule {}
