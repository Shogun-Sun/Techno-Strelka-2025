import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: '@gmail.com',
    description: 'Почта пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  user_email: string;

  @ApiProperty({
    example: '123456789',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  user_password: string;
}
