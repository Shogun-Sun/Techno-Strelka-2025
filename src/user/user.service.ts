import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';
import { NewUserDto } from './dto/newUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async newUser(newUserDto: NewUserDto) {
    try {
      const user = await this.userModel.findOne({
        where: {
          user_email: newUserDto.user_email,
        },
      });

      if (user) {
        throw new ConflictException('Пользователь уже существует');
      }

      await this.userModel.create(newUserDto as Partial<User>);
      return { message: 'Вы успешно заригестрировались' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async validateUser(
    user_email: string,
    user_password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { user_email } });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    const isMatch = user_password === user.user_password;
    if (!isMatch) {
      throw new BadRequestException('Неверный пароль');
    }
    return user;
  }
}
