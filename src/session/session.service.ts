import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from 'src/database/models/session.model';
import { Op } from 'sequelize';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session) private sessions: typeof Session) {}

  async get(sid: string): Promise<Session | null> {
    return this.sessions.findOne({ where: { sid } });
  }

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

  async destroy(sid: string): Promise<void> {
    await this.sessions.destroy({ where: { sid } });
  }

  async cleanExpired(): Promise<void> {
    await this.sessions.destroy({
      where: { expires: { [Op.lt]: new Date() } },
    });
  }
}
