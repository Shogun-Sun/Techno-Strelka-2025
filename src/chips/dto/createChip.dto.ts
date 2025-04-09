import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChipDto {
  @ApiProperty({
    example: 'Автозавод',
    description: 'Название района',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  chip_district: string;

  @ApiProperty({
    example: 'Описание события',
    description: 'Описание события',
  })
  @IsString({ message: 'Должно быть строкой'})
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  chip_description: string;
}
