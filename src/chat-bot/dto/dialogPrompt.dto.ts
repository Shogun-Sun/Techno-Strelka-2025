import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DialogPromptDto {
  @ApiProperty({
    example: 'Привет',
    description: 'Запрос',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
