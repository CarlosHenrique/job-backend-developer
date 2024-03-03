import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import {
  GetMovieReviewsFilterDto,
  PaginationDto,
} from './dtos/get-movie-reviews.dto';
import { MoviereviewsService, PageResult } from './moviereviews.service';
import { MovieReview } from './entities/movie-review';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';

@Controller('movie-reviews')
export class MoviereviewsController {
  constructor(private readonly movieReviewService: MoviereviewsService) {}

  @Post()
  createReview(
    @Body() createMovieReviewDto: CreateMovieReviewDomainDto,
  ): Promise<MovieReview> {
    return this.movieReviewService.createReview(createMovieReviewDto);
  }

  @Get()
  getReviews(
    @Query() filter: GetMovieReviewsFilterDto,
    @Query() page: PaginationDto,
  ): Promise<PageResult<MovieReview>> {
    return this.movieReviewService.getReviews(filter, page);
  }

  @Get('/:id')
  getReviewById(@Param('id') id: string): Promise<MovieReview> {
    return this.movieReviewService.getReviewById(id);
  }

  @Delete('/:id')
  deleteReviewById(@Param('id') id: string): Promise<void> {
    return this.movieReviewService.deleteReviewById(id);
  }

  @Patch('/:id')
  updateReviewById(
    @Param('id') id: string,
    @Body() updateMovieReviewDto: UpdateMovieReviewDto,
  ): Promise<MovieReview> {
    return this.movieReviewService.updateMovieReviewNotes(
      id,
      updateMovieReviewDto,
    );
  }
}
