import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatBotService } from './chat-bot.service';
import { DialogPromptDto } from './dto/dialogPrompt.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatBotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatBotService: ChatBotService) {}

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { sender: string; message: string },
  ): Promise<void> {
    this.server.emit('message', data);

    const prompt: DialogPromptDto = { prompt: data.message };
    try {
      const reply = await this.chatBotService.accessGeminiApi(prompt);
      this.server.emit('message', {
        sender: 'Tele2Bot',
        message: reply.message,
        redirect: reply.redirect,
      });
    } catch (e) {
      this.server.emit('message', {
        sender: 'Tele2Bot',
        message: 'Извините, возникла ошибка при обработке вашего сообщения.',
      });
    }
  }
}
