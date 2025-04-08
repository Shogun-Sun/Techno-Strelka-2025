import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from 'src/database/models/reviews.model';
import { CreateReviewDto } from './dto/createRevie.dto';
import { CreateReviewResponse, GetAllReviewsResponse } from 'src/types/Responses';
import { User } from 'src/database/models/user.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(User) private userModel: typeof User,
  ) {}
  async createReview(
    createReviewDto: CreateReviewDto,
  ): Promise<CreateReviewResponse> {
    try {
      const user = await this.userModel.findByPk(createReviewDto.user_id);
      if (!user) {
        throw new ConflictException('Данный пользователь не существует');
      }
      await this.reviewRepository.create(createReviewDto as Partial<Review>);
      return { message: 'Отзыв успешно создан' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllReviews(): Promise<GetAllReviewsResponse> {
    try {
      const reviews = await this.reviewRepository.findAll();
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
