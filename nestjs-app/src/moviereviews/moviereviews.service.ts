import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OmdbService } from 'src/omdb/omdb.service';
import { Repository } from 'typeorm';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import { MovieReview } from './entities/movie-review';
import { mapToMovieReview } from './mappers/map-movieapi-to-moviereview';


export interface PageResult<T> {
    data: T[]
    total: number
}

@Injectable()
export class MoviereviewsService {
    constructor(
        @InjectRepository(MovieReview)
        private movieReviewRepository: Repository<MovieReview>,
        private readonly omdbService: OmdbService
    ) { }

    async createReview(createReviewArgs: CreateMovieReviewDomainDto): Promise<MovieReview> {
        try {
            const { title, notes } = createReviewArgs
            console.log(createReviewArgs)
            console.log(title)

            const omdbFoundData = await this.omdbService.searchMovies(title)
            const mappedReview = mapToMovieReview(omdbFoundData, notes)

            const created = await this.movieReviewRepository.save({ ...mappedReview, id: randomUUID() })
            console.log(created.id)
            return created

        } catch (err) {
            throw new Error('Error creating review from database')
        }

    }

    async getReviews(): Promise<PageResult<MovieReview>> {
        const [data, total] = await this.movieReviewRepository.findAndCount(

        )


        return { data, total }
    }
}
