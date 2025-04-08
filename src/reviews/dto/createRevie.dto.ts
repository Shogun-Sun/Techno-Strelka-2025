import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsLatitude,
  IsLongitude,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: '1',
    description: 'Идентификатор пользователя',
  })
  @IsNotEmpty({ message: 'Поле user_id не может быть пустым' })
  @IsInt({ message: 'Поле user_id должно быть целым числом' })
  user_id: number;

  @ApiProperty({
    example: 'Тест',
    description: 'Текст отзыва',
  })
  @IsNotEmpty({ message: 'Поле review_text не может быть пустым' })
  @IsString({ message: 'Поле review_text должно быть строкой' })
  review_text: string;

  @ApiProperty({
    example: { lat: 55.751244, lng: 37.618423 },
    description: 'Координаты',
  })
  @IsNotEmpty({ message: 'Поле coordinates не может быть пустым' })
  @IsObject({ message: 'Поле coordinates должно быть объектом' })
  @IsLatitude({ message: 'Широта должна быть действительной' })
  @IsLongitude({ message: 'Долгота должна быть действительной' })
  coordinates: { lat: number; lng: number };

  @ApiProperty({
    example: { download: '12.3', upload: '12.3', ping: '12.3' },
    description: 'Скорость интернета',
  })
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsObject({ message: 'Поле должно быть объектом' })
  review_speed_test: { download: string; upload: string; ping: string };
}
