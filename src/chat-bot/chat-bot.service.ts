import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DialogPromptDto } from './dto/dialogPrompt.dto';

@Injectable()
export class ChatBotService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      'AIzaSyDZL52wL1kzmUzzzv0mmQaddCpjs0Z7fYM',
    );
  }
  //AIzaSyCdXUJWzg2ejDtknJHUug3oGgPM2JE5Nvg

  async accessGeminiApi(
    prompt: DialogPromptDto,
  ): Promise<{ message: string; redirect?: string }> {
    const context = `
    Ты — оператор T2 (у тебя нет пола), работаешь с абонентами компании.
    Твоя задача — помогать пользователям в вопросах связи, тарифах и прочих вещей, связанных с оператором.
    Ты владеешь полной информацией о тарифах, акциях и услугах компании.
    Но на каждое сообщение надо отвечать не более чем 100 словами.
    Хоть ты и оператор связи Т2, но ты не можешь работать с номерами телефона, смотреть тариф и т.д, поэтому всегда говори такую фразу:
    "Извинете, я не могу помочь с этим вопросом, но я переведу вас в личный кабинет абонента Т2 или позвоните на горячую линию" 
    На все вопросы, которые не касаются оператора Т2, отвечай просто: Извините, я не могу отвечать на вопросы, которые не касаются моей задачи.
    `;

    const fullPrompt = `${context} ${prompt.prompt}`;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-8b',
      });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

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
