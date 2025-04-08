import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GoogleCloudService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      'AIzaSyDZL52wL1kzmUzzzv0mmQaddCpjs0Z7fYM',
    );
  }

  async accessGeminiApi(prompt: string): Promise<string> {
    // Контекст для роли Т2 оператора
    const context = `
      Ты — оператор связи T2, работаешь с абонентами компании. 
      Твоя задача — помогать пользователям в вопросах связи, тарифах, подключении услуг и решении технических проблем. 
      Ты владеешь полной информацией о тарифах, акциях и услугах компании.
      Но на каждое сообщение надо отвечать не более чем 100 словами.
    `;

    // Включаем контекст в запрос
    const fullPrompt = `${context} ${prompt}`;

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Ошибка при вызове Gemini API:', error);
      throw new Error('Не удалось обработать запрос. Попробуйте позже.');
    }
  }
}
