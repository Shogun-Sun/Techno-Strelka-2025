import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/createRevie.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Создание отзыва' })
  @Post('create')
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @ApiOperation({ summary: 'Получение всех отзывов' })
  @Get('get/all/reviews')
  getAllReviews() {
    return this.reviewsService.getAllReviews();
  }
}
