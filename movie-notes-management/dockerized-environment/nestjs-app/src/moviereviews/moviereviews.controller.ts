import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import { MoviereviewsService } from './moviereviews.service';

@Controller('movie-reviews')
export class MoviereviewsController {
    constructor(
        private readonly movieReviewService: MoviereviewsService,

    ) { }

    @Post()
    createReview(

        @Body() createMovieReviewDto: CreateMovieReviewDomainDto
    ) {
        return this.movieReviewService.createReview(createMovieReviewDto)
    }

    @Get()
    getReviews() {
        return this.movieReviewService.getReviews()
    }
}
