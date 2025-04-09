import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DialogPromptDto } from './dto/dialogPrompt.dto';
import { CONTEXT } from 'src/config';

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
    const fullPrompt = `${CONTEXT} ${prompt.prompt}`;

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
