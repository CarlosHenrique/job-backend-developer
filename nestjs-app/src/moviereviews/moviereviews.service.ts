import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OmdbService } from 'src/omdb/omdb.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import {
  DefaultPageable,
  GetMovieReviewsFilterDto,
  PaginationDto,
} from './dtos/get-movie-reviews.dto';
import { MovieReview } from './entities/movie-review';
import { mapToMovieReview } from './mappers/map-movieapi-to-moviereview';
import { RepositoryGenericError } from 'src/utils/repository-generic-error';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';

export interface PageResult<T> {
  data: T[];
  total: number;
  totalPages?: number;
  currentPage?: number;
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
      throw new RepositoryGenericError('Error creating review from database');
    }
  }

  async getReviews(
    filter: GetMovieReviewsFilterDto,
    page: PaginationDto = DefaultPageable,
  ): Promise<PageResult<MovieReview>> {
    try {
      const { pageNumber, pageSize } = page;
      let query = this.movieReviewRepository.createQueryBuilder('movieReviews');
      query = this.constructWhere(query, filter);
      query.skip(pageSize * (pageNumber - 1)).take(pageSize);
      const [data, total] = await query.getManyAndCount();

      return {
        data,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNumber,
      };
    } catch (err) {
      throw new RepositoryGenericError('Error getting reviews from database');
    }
  }

  async getReviewById(id: string): Promise<MovieReview> {
    try {
      const found = await this.movieReviewRepository.findOneBy({ id });
      if (!found) {
        throw new RepositoryGenericError('Error getting review from database');
      }
      return found;
    } catch (err) {
      throw new RepositoryGenericError('Error getting review from database');
    }
  }

  async deleteReviewById(id: string): Promise<void> {
    try {
      const result = await this.movieReviewRepository.delete({ id });
      if (result.affected === 0) {
        throw new RepositoryGenericError('Error deleting review from database');
      }
      return;
    } catch (err) {
      throw new RepositoryGenericError('Error deleting review from database');
    }
  }

  async updateMovieReviewNotes(
    id: string,
    data: UpdateMovieReviewDto,
  ): Promise<MovieReview> {
    try {
      const { notes } = data;

      const found = await this.movieReviewRepository.findOne({
        where: { id },
      });
      if (!found) {
        throw new RepositoryGenericError('Review not found on database');
      }
      found.notes = notes;

      return await this.movieReviewRepository.save(found);
    } catch (err) {
      throw new RepositoryGenericError('Error updating review from database');
    }
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
