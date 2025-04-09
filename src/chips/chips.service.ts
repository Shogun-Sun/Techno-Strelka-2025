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
  async createChip(createChipDto: CreateChipDto) {
    try {
      const chip = await this.chipModel.findAll({
        where: {
          chip_district: createChipDto.chip_district,
        },
      });

      if (chip.length > 0) {
        throw new ConflictException('В этом районе уже существует событие');
      }

      await this.chipModel.create(createChipDto as Partial<Chip>);
      return { message: 'Событие успешно создано' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getChip(getChipDto: GetChipDto) {
    try {
      const data = await this.chipModel.findOne({
        where: {
          chip_district: getChipDto.chip_district,
        },
      });

      if (!data) {
        throw new NotFoundException('Извините, но событий по этоу району нет');
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
