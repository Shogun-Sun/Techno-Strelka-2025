import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DialogPromptDto } from './dto/dialogPrompt.dto';
import { CONTEXT } from 'src/config';

@Injectable()
export class ChatBotService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Инициализация клиента Gemini
    this.genAI = new GoogleGenerativeAI(
      'AIzaSyDZL52wL1kzmUzzzv0mmQaddCpjs0Z7fYM',
    );
  }

  // Метод для обращения к API Gemini и получения ответа
  async accessGeminiApi(
    prompt: DialogPromptDto,
  ): Promise<{ message: string; redirect?: string }> {
    //Добавление контекста к сообщению
    const fullPrompt = `${CONTEXT} ${prompt.prompt}`;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
      });

      // Отправка запроса к модели и получение ответа
      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      // Проверка на наличие фразы, по которой нужно выполнить редирект
      const redirectPhrase = 'личный кабинет';
      if (text.includes(redirectPhrase)) {
        return { message: text, redirect: 'редирект' };
      }

      return { message: text };
    } catch (error) {
      console.error('Ошибка при вызове Gemini API:', error);
      throw new Error('Не удалось обработать запрос. Попробуйте позже.');
    }
  }
}
