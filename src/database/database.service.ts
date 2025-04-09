import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chip } from './models/chips.model'; // Импортируем модель Chip

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(@InjectModel(Chip) private chipModel: typeof Chip) {}

  // Метод для добавления данных
  async insertDefaultChips() {
    const chipsData = [
      {
        chip_district: 'Канавинский район',
        chip_description:
          'Сейчас вы находитесь в Канавинском районе, а вы знали, что здесь t2 в январе 2025 улучшила связь еще на 5%',
      },
      {
        chip_district: 'Нижегородский район',
        chip_description:
          'В Нижегородском районе оператор Т2 в 2024 году значительно улучшил мобильное покрытие, повысив качество связи на 7%.',
      },
      {
        chip_district: 'Советский район',
        chip_description:
          'Советский район стал зоной с улучшенным покрытием 4G от Т2. Теперь связь стабильна даже в самых удаленных уголках района!',
      },
      {
        chip_district: 'Приокский район',
        chip_description:
          'В Приокском районе Т2 в 2025 году расширил зоны 5G, что значительно улучшило качество интернета для пользователей.',
      },
      {
        chip_district: 'Автозаводский район',
        chip_description:
          'Автозаводский район стал одним из лидеров по качеству мобильной связи с обновлением покрытия от Т2 в 2024 году, что улучшило стабильность интернета.',
      },
      {
        chip_district: 'Ленинский район',
        chip_description:
          'Т2 в Ленинском районе улучшил 4G-покрытие в 2023 году, обеспечив качественное соединение даже в центре города.',
      },
      {
        chip_district: 'Московский район',
        chip_description:
          'Московский район теперь полностью охвачен сетями 5G от Т2, что значительно повысило скорость мобильного интернета и качество связи в 2024 году.',
      },
      {
        chip_district: 'Сормовский район',
        chip_description:
          'Сормовский район получил улучшенное покрытие сети от Т2 в 2023 году, что улучшило стабильность связи и доступность интернета для всех жителей.',
      },
    ];

    for (const chip of chipsData) {
      const exists = await this.chipModel.findOne({
        where: { chip_district: chip.chip_district },
      });
      if (!exists) {
        await this.chipModel.create(chip);
      }
    }
  }

  async onModuleInit() {
    await this.insertDefaultChips();
  }
}
