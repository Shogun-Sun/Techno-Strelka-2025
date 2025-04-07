import { SessionService } from './session.service';
import { Store } from 'express-session';
import { SessionData } from 'express-session';

export class SequelizeStore extends Store {
  private readonly cleanInterval: NodeJS.Timer;

  constructor(private sessionService: SessionService) {
    super();

    this.cleanInterval = setInterval(
      () => {
        void this.sessionService.cleanExpired();
      },
      10 * 60 * 1000,
    );
  }

  get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void,
  ): void {
    this.sessionService
      .get(sid)
      .then((session) => callback(null, session?.data || null))
      .catch((err) => callback(err));
  }

  set(sid: string, session: SessionData, callback?: (err?: any) => void): void {
    const expires = new Date(Date.now() + (session.cookie.maxAge || 0));
    const user_id = session.user.user_id;
    this.sessionService
      .set(sid, session, expires, user_id)
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.sessionService
      .destroy(sid)
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }
}
