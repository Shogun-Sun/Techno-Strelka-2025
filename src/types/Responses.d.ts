import { Review } from 'src/database/models/reviews.model';

export interface CreateReviewResponse {
  message: string;
}

export interface GetAllReviewsResponse {
  message: string;
  data: Review[];
}
