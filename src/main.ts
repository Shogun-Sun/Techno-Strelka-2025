import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PUBLIC_PATH, VIEWS_PATH } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Загрузка переменных окружения из .env
dotenv.config();

async function bootstrap() {
  // Создание приложения
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Установка статических файлов
  app.useStaticAssets(PUBLIC_PATH);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(VIEWS_PATH);

  // Включаем CORS, чтобы разрешить запросы с других источников
  app.enableCors();

  // Регистрация сваггера, для режима разработки
  if (process.env.PROJECT_STATUS === 'dev') {
    // Создаем объект документации для Swagger
    const swaggerDoc = new DocumentBuilder()
      .setTitle('Swagger')
      .setDescription('Документаци для API')
      .setVersion('1.0')
      .build();

    // Документ сваггера
    const document = SwaggerModule.createDocument(app, swaggerDoc);

    // Установка маршрута для сваггера
    SwaggerModule.setup('/api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
