import { OmitType } from '@nestjs/mapped-types';
import { MovieReview } from '../entities/movie-review';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieReviewDomainDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  notes: string;
}

export class CreateMovieArgs extends OmitType(MovieReview, ['id']) {}
