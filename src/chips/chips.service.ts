import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chip } from 'src/database/models/chips.model';
import { CreateChipDto } from './dto/createChip.dto';
import { GetChipDto } from './dto/getChip.dto';

@Injectable()
export class ChipsService {
  constructor(@InjectModel(Chip) private chipModel: typeof Chip) {}

  // Метод для создания события по району
  async createChip(createChipDto: CreateChipDto) {
    try {
      // Проверка: существует ли уже событие в этом районе
      const chip = await this.chipModel.findAll({
        where: {
          chip_district: createChipDto.chip_district,
        },
      });

      if (chip.length > 0) {
        throw new ConflictException('В этом районе уже существует событие');
      }

      // Создание новой записи в базе данных
      await this.chipModel.create(createChipDto as Partial<Chip>);
      return { message: 'Событие успешно создано' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Метод для получения события по району
  async getChip(getChipDto: GetChipDto) {
    try {
      // Поиск события по району
      const data = await this.chipModel.findOne({
        where: {
          chip_district: getChipDto.chip_district,
        },
      });

      if (!data) {
        throw new NotFoundException('Извините, но событий по этому району нет');
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
