import { OmitType } from '@nestjs/mapped-types';
import { MovieReview } from '../entities/movie-review';

export class CreateMovieReviewDomainDto {
  title: string;
  notes: string;
}

export class CreateMovieArgs extends OmitType(MovieReview, ['id']) {}
