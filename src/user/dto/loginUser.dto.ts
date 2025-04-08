import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: '+79871237483',
    description: 'Почта пользователя',
  })
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  user_telephone: string;

  @ApiProperty({
    example: '123456789',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  user_password: string;
}
