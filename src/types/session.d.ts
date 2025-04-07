import 'express-session';

interface UserSession {
  user_id: number;
  user_name: string;
  user_email: string;
}

declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}
