import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from 'src/database/models/reviews.model';
import { CreateReviewDto } from './dto/createRevie.dto';
import {
  CreateReviewResponse,
  GetAllReviewsResponse,
} from 'src/types/Responses';
import { User } from 'src/database/models/user.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  // Метод для создания отзыва
  async createReview(
    createReviewDto: CreateReviewDto,
  ): Promise<CreateReviewResponse> {
    try {
      // Проверка на существование пользователя с заданным ID
      const user = await this.userModel.findByPk(createReviewDto.user_id);
      if (!user) {
        throw new ConflictException('Данный пользователь не существует');
      }

      // Создание отзыва в базе данных
      await this.reviewRepository.create(createReviewDto as Partial<Review>);
      return { message: 'Отзыв успешно создан' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Метод для получения всех отзывов
  async getAllReviews(): Promise<GetAllReviewsResponse> {
    try {
      // Получаем все отзывы и данные пользователя (телефон)
      const reviews = await this.reviewRepository.findAll({
        include: [{ model: User, attributes: ['user_telephone'] }],
      });

      return {
        message: 'Отзывы успешно получены',
        data: reviews,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
