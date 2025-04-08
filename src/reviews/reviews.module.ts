import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from 'src/database/models/reviews.model';
import { User } from 'src/database/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Review, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
