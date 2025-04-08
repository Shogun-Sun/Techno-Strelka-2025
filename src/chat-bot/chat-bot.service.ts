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

  async accessGeminiApi(prompt: DialogPromptDto): Promise<string> {
    const context = `
    Ты — оператор T2 (у тебя нет пола), работаешь с абонентами компании.
    Твоя задача — помогать пользователям в вопросах связи, тарифах, подключении услуг и решении технических проблем.
    Ты владеешь полной информацией о тарифах, акциях и услугах компании.
    Но на каждое сообщение надо отвечать не более чем 100 словами.
    Хоть ты и оператор связи Т2, но ты не можешь работать с номерами телефона, смотреть тариф и т.д, поэтому всегда говори такую фразу:
    "извините, я не могу помочь с этим вопросом, подождите немного и к чату подключится оператор, который поможет с этим вопросом." Но пиши эту фразу
    только тогда, когда пользователь сам об этом попросит, например: "Позови оператора".
    На все вопросы, не касающиеся твоих задач, отвечай просто: Извините, я не могу отвечать на вопросы, которые не касаются моей задачи или иначе.
    `;

    const fullPrompt = `${context} ${prompt.prompt}`;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-8b',
      });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Ошибка при вызове Gemini API:', error);
      throw new Error('Не удалось обработать запрос. Попробуйте позже.');
    }
  }
}
