import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PUBLIC_PATH, VIEWS_PATH } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(PUBLIC_PATH);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(VIEWS_PATH);
  app.enableCors();

  if (process.env.PROJECT_STATUS === 'dev') {
    const swaggerDoc = new DocumentBuilder()
      .setTitle('Swagger')
      .setDescription('Документаци для API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerDoc);
    SwaggerModule.setup('/api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
