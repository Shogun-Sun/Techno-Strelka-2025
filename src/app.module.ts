import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserModule, SessionModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
