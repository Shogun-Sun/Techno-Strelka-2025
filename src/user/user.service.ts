import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';
import { NewUserDto } from './dto/newUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  // Метод для регистрации нового пользователя
  async newUser(newUserDto: NewUserDto) {
    try {
      const user = await this.userModel.findOne({
        where: {
          user_telephone: newUserDto.user_telephone,
        },
      });

      if (user) {
        throw new ConflictException('Пользователь уже существует');
      }

      //Хеширование пароля
      // const hashedPassword = await bcrypt.hash(newUserDto.user_password, 10);
      // newUserDto.user_password = hashedPassword;

      await this.userModel.create(newUserDto as Partial<User>);
      return { message: 'Вы успешно заригестрировались' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Метод для валидации пользователя по телефону и паролю
  async validateUser(
    user_telephone: string,
    user_password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { user_telephone } });
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
