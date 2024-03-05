import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MoviereviewsModule } from '../src/moviereviews/moviereviews.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieReview } from '../src/moviereviews/entities/movie-review';
import { OmdbService } from '../src/omdb/omdb.service';
import { dummyMovieReviews } from '../src/moviereviews/entities/dummy-movie-reviews';
import { OmdbModule } from '../src/omdb/omdb.module';
import { CreateMovieReviewDomainDto } from '../src/moviereviews/dtos/create-movie-review.dto';
import { dummyOmdbResponse } from '../src/omdb/entities/dummy-omdb-response';

describe('MovieReviewController (e2e)', () => {
    let app: INestApplication;
    let omdbService: OmdbService;
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
        omdbService = moduleFixture.get<OmdbService>(OmdbService);
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

    describe('/movie-reviews (POST)', () => {
        it('should create a new movie review', async () => {
            jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(
                dummyOmdbResponse,
            );

            const createReviewDto: CreateMovieReviewDomainDto = {
                title: 'King Kong',
                notes: 'This is a test movie review.',
            };

            mockMovieReviewRepository.findOne = jest
                .fn()
                .mockResolvedValue(null);
            mockMovieReviewRepository.save = jest
                .fn()
                .mockImplementation((movieReview) =>
                    Promise.resolve(movieReview),
                );

            const response = await request(app.getHttpServer())
                .post('/movie-reviews')
                .send(createReviewDto);

            expect(response.status).toBe(201);
            expect(response.body.title).toEqual(createReviewDto.title);
            expect(response.body.notes).toEqual(createReviewDto.notes);
        });

        it('should throw ConflictException if a review for the movie already exists', async () => {
            jest.spyOn(omdbService, 'searchMovies').mockResolvedValue(
                dummyOmdbResponse,
            );

            const createReviewDto: CreateMovieReviewDomainDto = {
                title: 'King Kong',
                notes: 'This is a duplicate movie review.',
            };

            mockMovieReviewRepository.findOne = jest.fn().mockResolvedValue({
                id: 'existing-review-id',
                title: 'King Kong',
            });
            const response = await request(app.getHttpServer())
                .post('/movie-reviews')
                .send(createReviewDto);

            expect(response.status).toBe(409);
            expect(response.body.error).toEqual('Conflict');
            expect(response.body.message).toContain(
                'A review for this movie already exists',
            );
        });

        it('should throw RepositoryGenericError if an unexpected error occurs during review creation', async () => {
            mockMovieReviewRepository.findOne.mockRejectedValue(
                new Error('Unexpected Error'),
            );

            const createReviewDto: CreateMovieReviewDomainDto = {
                title: 'Test Movie',
                notes: 'This is a test movie review.',
            };
            const response = await request(app.getHttpServer())
                .post('/movie-reviews')
                .send(createReviewDto);

            expect(response.status).toBeGreaterThanOrEqual(500);
        });
    });
});
