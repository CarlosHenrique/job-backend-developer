import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OmdbService } from 'src/omdb/omdb.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import { GetMovieReviewsFilterDto } from './dtos/get-movie-reviews.dto';
import { MovieReview } from './entities/movie-review';
import { mapToMovieReview } from './mappers/map-movieapi-to-moviereview';

export interface PageResult<T> {
  data: T[];
  total: number;
}

@Injectable()
export class MoviereviewsService {
  constructor(
    @InjectRepository(MovieReview)
    private movieReviewRepository: Repository<MovieReview>,
    private readonly omdbService: OmdbService,
  ) {}

  async createReview(
    createReviewArgs: CreateMovieReviewDomainDto,
  ): Promise<MovieReview> {
    try {
      const { title, notes } = createReviewArgs;

      const omdbFoundData = await this.omdbService.searchMovies(title);
      const mappedReview = mapToMovieReview(omdbFoundData, notes);

      const created = await this.movieReviewRepository.save({
        ...mappedReview,
        id: randomUUID(),
      });

      return created;
    } catch (err) {
      throw new Error('Error creating review from database');
    }
  }

  async getReviews(
    filter: GetMovieReviewsFilterDto,
  ): Promise<PageResult<MovieReview>> {
    let query = this.movieReviewRepository.createQueryBuilder('movieReviews');
    query = this.constructWhere(query, filter);
    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  private constructWhere(
    query: SelectQueryBuilder<MovieReview>,
    filter: GetMovieReviewsFilterDto,
  ): SelectQueryBuilder<MovieReview> {
    const { sortRating, sortRelease, search } = filter;

    if (search) {
      query.andWhere(
        'LOWER(movieReviews.title) LIKE LOWER(:search) OR LOWER(movieReviews.actors) LIKE LOWER(:search) OR LOWER(movieReviews.directors) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    if (sortRelease) {
      query.addOrderBy('movieReviews.released', sortRelease);
    }

    if (sortRating) {
      query.addOrderBy('movieReviews.imdbRating', sortRating);
    }
    return query;
  }
}
