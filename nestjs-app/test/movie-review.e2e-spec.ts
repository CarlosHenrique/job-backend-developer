import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MoviereviewsModule } from '../src/moviereviews/moviereviews.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieReview } from '../src/moviereviews/entities/movie-review';
import { OmdbService } from '../src/omdb/omdb.service';
import { dummyMovieReviews } from '../src/moviereviews/entities/dummy-movie-reviews';
import { OmdbModule } from '../src/omdb/omdb.module';

describe('MovieReviewController (e2e)', () => {
    let app: INestApplication;

    const mockMovieReviewRepository = {
        createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest
                .fn()
                .mockResolvedValue([
                    dummyMovieReviews,
                    dummyMovieReviews.length,
                ]),
        })),
        findOne: jest.fn(),
        save: jest.fn(),
        findOneBy: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [MoviereviewsModule, OmdbModule],
        })
            .overrideProvider(getRepositoryToken(MovieReview))
            .useValue(mockMovieReviewRepository)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('/movie-reviews (GET)', () => {
        it('should return paginated movie reviews', async () => {
            const pageSize = 4;
            const pageNumber = 1;

            const response = await request(app.getHttpServer())
                .get('/movie-reviews')
                .query({ pageSize, pageNumber });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    data: expect.any(Array),
                    total: expect.any(Number),
                    totalPages: expect.any(Number),
                    currentPage: expect.any(String),
                }),
            );

            const expectedTotalResults =
                response.body.totalPages * response.body.total;
            expect(response.body.data).toHaveLength(expectedTotalResults);
        });
    });
});
