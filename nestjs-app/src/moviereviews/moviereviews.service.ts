import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OmdbService } from '../omdb/omdb.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import { GetMovieReviewsQueryDto } from './dtos/get-movie-reviews.dto';
import { MovieReview } from './entities/movie-review';
import { mapToMovieReview } from './mappers/map-movieapi-to-moviereview';
import { RepositoryGenericError } from '../utils/repository-generic-error';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';

export interface PageResult<T> {
    data: T[];
    total: number;
    totalPages: number;
    currentPage: number;
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
            const exists = await this.movieReviewRepository.findOne({
                where: {
                    title: omdbFoundData.Title,
                },
            });
            if (exists) {
                throw new ConflictException(
                    'A review for this movie already exists.',
                );
            }
            const mappedReview = mapToMovieReview(omdbFoundData, notes);

            const created = await this.movieReviewRepository.save({
                ...mappedReview,
                id: randomUUID(),
            });

            return created;
        } catch (err) {
            if (err instanceof ConflictException) {
                throw err;
            } else {
                throw new RepositoryGenericError(
                    'Error creating review from database',
                );
            }
        }
    }

    async getReviews(
        queryDto: GetMovieReviewsQueryDto,
    ): Promise<PageResult<MovieReview>> {
        try {
            const { pageNumber, pageSize } = queryDto;

            let query =
                this.movieReviewRepository.createQueryBuilder('movieReviews');

            query = this.constructWhere(query, queryDto);

            query.skip(pageSize * (pageNumber - 1)).take(pageSize);

            const [data, total] = await query.getManyAndCount();

            return {
                data,
                total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: pageNumber,
            };
        } catch (err) {
            throw new RepositoryGenericError(
                'Error getting reviews from database',
            );
        }
    }

    async getReviewById(id: string): Promise<MovieReview> {
        try {
            const found = await this.movieReviewRepository.findOneBy({ id });
            if (!found) {
                throw new NotFoundException(
                    'Error getting review from database',
                );
            }
            return found;
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            } else {
                throw new RepositoryGenericError(
                    'Error getting review from database',
                );
            }
        }
    }

    async deleteReviewById(id: string): Promise<void> {
        try {
            const result = await this.movieReviewRepository.delete({ id });
            if (result.affected === 0) {
                throw new NotFoundException(
                    'Error deleting review from database',
                );
            }
            return;
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            } else {
                throw new RepositoryGenericError(
                    'Error deleting review from database',
                );
            }
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
                throw new NotFoundException('Review not found on database');
            }
            found.notes = notes;

            return await this.movieReviewRepository.save(found);
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            } else {
                throw new RepositoryGenericError(
                    'Error updating review from database',
                );
            }
        }
    }

    private constructWhere(
        query: SelectQueryBuilder<MovieReview>,
        dto: GetMovieReviewsQueryDto,
    ): SelectQueryBuilder<MovieReview> {
        const { sortRating, sortRelease, search } = dto;

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
