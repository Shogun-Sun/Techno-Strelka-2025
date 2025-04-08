import 'express-session';

interface UserSession {
  user_id: number;
  user_telephone: string;
}

declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}
