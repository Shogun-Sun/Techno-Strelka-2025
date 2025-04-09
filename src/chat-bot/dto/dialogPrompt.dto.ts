import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DialogPromptDto {
  @ApiProperty({
    example: 'Привет',
    description: 'Запрос',
  })
  @IsString({ message: 'Запрос должен быть строкой' })
  @IsNotEmpty({ message: 'Запрос не может быть пустым' })
  prompt: string;
}
