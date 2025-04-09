import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetChipDto {
  @ApiProperty({
    example: 'Автозавод',
    description: 'Название района',
  })
  @IsString({ message: 'поле должно быть строкой' })
  @IsNotEmpty({ message: 'поле не должно быть пустым' })
  chip_district: string;
}
