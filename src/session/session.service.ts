import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from 'src/database/models/session.model';
import { Op } from 'sequelize';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session) private sessions: typeof Session) {}

  //Метод для получения сессии
  async get(sid: string): Promise<Session | null> {
    return this.sessions.findOne({ where: { sid } });
  }

  //Метод для установки или обновления сессии
  async set(
    sid: string,
    data: any,
    expires: Date,
    user_id: number | undefined,
  ): Promise<Session> {
    const [session] = await this.sessions.upsert({
      sid,
      data,
      expires,
      user_id,
    });
    return session;
  }

  //Метод для удаления сессии
  async destroy(sid: string): Promise<void> {
    await this.sessions.destroy({ where: { sid } });
  }

  //Метод для очистки устаревших сессий
  async cleanExpired(): Promise<void> {
    await this.sessions.destroy({
      where: { expires: { [Op.lt]: new Date() } },
    });
  }
}
