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

// Создание WebSocket-шлюза с разрешённым доступом со всех источников (CORS)
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

  // Подписка на событие "message" от клиента
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { sender: string; message: string },
  ): Promise<void> {
    // Отправка исходного сообщения всем подключённым клиентам
    this.server.emit('message', data);

    // Формирование запроса для ChatBot из полученного сообщения
    const prompt: DialogPromptDto = { prompt: data.message };

    try {
      // Запрос к внешнему API чат-бота
      const reply = await this.chatBotService.accessGeminiApi(prompt);

      // Отправка ответа обратно всем клиентам
      this.server.emit('message', {
        sender: 'Tele2Bot',
        message: reply.message,
        redirect: reply.redirect,
      });
    } catch (e) {
      // Обработка ошибок и отправка сообщения об ошибке клиенту
      this.server.emit('message', {
        sender: 'Tele2Bot',
        message: 'Извините, возникла ошибка при обработке вашего сообщения.',
      });
    }
  }
}
