import { Body, Controller, Post } from '@nestjs/common';
import { ChipsService } from './chips.service';
import { CreateChipDto } from './dto/createChip.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GetChipDto } from './dto/getChip.dto';

@Controller('chips')
export class ChipsController {
  constructor(private readonly chipsService: ChipsService) {}

  @ApiOperation({ summary: 'Создание события' })
  @Post('/create')
  createChip(@Body() createChipDto: CreateChipDto) {
    return this.chipsService.createChip(createChipDto);
  }

  @ApiOperation({ summary: 'Получение события' })
  @Post('/get')
  getChip(@Body() getChipDto: GetChipDto) {
    return this.chipsService.getChip(getChipDto);
  }
}
