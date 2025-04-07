import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class NewUserDto {
  @ApiProperty({
    example: 'test',
    description: 'Имя пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  user_name: string;

  @ApiProperty({
    example: '123456789',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  user_password: string;

  @ApiProperty({
    example: '@gmail.com',
    description: 'Почта пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty()
  user_email: string;
}
