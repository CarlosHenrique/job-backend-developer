import { Test, TestingModule } from '@nestjs/testing';
import { MoviereviewsService, PageResult } from './moviereviews.service';
import { MovieReview } from './entities/movie-review';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OmdbService } from '../omdb/omdb.service';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import { OmdbMovieResponse } from '../omdb/entities/omdb';

import { dummyMovieReviews } from './entities/dummy-movie-reviews';
import { dummyOmdbResponse } from '../omdb/entities/dummy-omdb-response';
import { GetMovieReviewsQueryDto } from './dtos/get-movie-reviews.dto';
import { ConflictException } from '@nestjs/common';

describe('MoviereviewsService', () => {
    let movieReviewService: MoviereviewsService;
    let mockMovieReviewRepository: Partial<Repository<MovieReview>>;
    let mockOmdbService: Partial<OmdbService>;
    beforeEach(async () => {
        mockOmdbService = {
            searchMovies: jest
                .fn()
                .mockResolvedValue(<OmdbMovieResponse>dummyOmdbResponse),
        };

        mockMovieReviewRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviereviewsService,
                {
                    provide: getRepositoryToken(MovieReview),
                    useValue: mockMovieReviewRepository,
                },
                {
                    provide: OmdbService,
                    useValue: mockOmdbService,
                },
            ],
        }).compile();

        movieReviewService =
            module.get<MoviereviewsService>(MoviereviewsService);
    });

    it('should be defined', () => {
        expect(movieReviewService).toBeDefined();
    });

    describe('save review', () => {
        it('should create a review with omdb data and notes wrote by user', async () => {
            const createDto: CreateMovieReviewDomainDto = {
                title: 'King Kong',
                notes: 'test notes',
            };
            mockMovieReviewRepository.findOne = jest
                .fn()
                .mockResolvedValue(null);
            mockMovieReviewRepository.save = jest
                .fn()
                .mockImplementation((movieReview) =>
                    Promise.resolve(movieReview),
                );

            const result = await movieReviewService.createReview(createDto);

            expect(mockOmdbService.searchMovies).toHaveBeenCalledWith(
                createDto.title,
            );
            expect(result).toBeDefined();
            expect(mockMovieReviewRepository.save).toHaveBeenCalled();
            expect(mockMovieReviewRepository.findOne).toHaveBeenCalledWith({
                where: { title: 'King Kong' },
            });
            expect(result).toEqual(
                expect.objectContaining({
                    title: 'King Kong',
                    genre: 'Action, Adventure, Romance',
                    notes: 'test notes',
                }),
            );
        });

        it('should throw ConflictException if a review for the movie already exists', async () => {
            const createDto: CreateMovieReviewDomainDto = {
                title: 'King Kong',
                notes: 'Another test notes',
            };

            mockMovieReviewRepository.findOne = jest.fn().mockResolvedValue({
                id: 'existing-review-id',
                title: 'King Kong',
            });
            mockMovieReviewRepository.save = jest.fn();
            await expect(
                movieReviewService.createReview(createDto),
            ).rejects.toThrow(ConflictException);

            expect(mockOmdbService.searchMovies).toHaveBeenCalledWith(
                createDto.title,
            );

            expect(mockMovieReviewRepository.findOne).toHaveBeenCalledWith({
                where: { title: 'King Kong' },
            });

            expect(mockMovieReviewRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('get reviews', () => {
        it('should retrieve movie reviews', async () => {
            const queryDto: GetMovieReviewsQueryDto = {
                pageSize: 2,
                pageNumber: 1,
            };

            const expectedTotalPages = Math.ceil(
                dummyMovieReviews.length / queryDto.pageSize,
            );
            const expectedCurrentPage = queryDto.pageNumber;

            const mockResults: PageResult<MovieReview> = {
                data: dummyMovieReviews.slice(0, 2),
                total: dummyMovieReviews.length,
                totalPages: expectedTotalPages,
                currentPage: expectedCurrentPage,
            };

            jest.spyOn(movieReviewService, 'getReviews').mockResolvedValueOnce(
                mockResults,
            );

            const results = await movieReviewService.getReviews(queryDto);
            expect(results).toEqual(
                expect.objectContaining({
                    data: expect.arrayContaining(mockResults.data),
                    total: dummyMovieReviews.length,
                    totalPages: expectedTotalPages,
                    currentPage: expectedCurrentPage,
                }),
            );
        });
    });
    describe('getMovieReviewById', () => {
        it('should retrieve an existing review', async () => {
            const existingReview = dummyMovieReviews[0];

            mockMovieReviewRepository.findOneBy = jest
                .fn()
                .mockResolvedValue(existingReview);

            const result = await movieReviewService.getReviewById(
                existingReview.id,
            );

            expect(mockMovieReviewRepository.findOneBy).toHaveBeenCalledWith({
                id: existingReview.id,
            });
            expect(result).toEqual(existingReview);
        });

        it('should throw an error if the review is not found', async () => {
            mockMovieReviewRepository.findOne = jest
                .fn()
                .mockResolvedValue(null);

            await expect(
                movieReviewService.getReviewById('non-existing-id'),
            ).rejects.toThrow('Error getting review from database');
        });
    });

    describe('deleteReviewById', () => {
        it('should successfully delete a review', async () => {
            const reviewId = '1';

            mockMovieReviewRepository.delete = jest
                .fn()
                .mockResolvedValue({ affected: 1 });

            await expect(
                movieReviewService.deleteReviewById(reviewId),
            ).resolves.toBeUndefined();

            expect(mockMovieReviewRepository.delete).toHaveBeenCalledWith({
                id: reviewId,
            });
        });

        it('should throw an error if the review does not exist', async () => {
            const nonExistingId = 'non-existing-id';

            mockMovieReviewRepository.delete = jest
                .fn()
                .mockResolvedValue({ affected: 0 });

            await expect(
                movieReviewService.deleteReviewById(nonExistingId),
            ).rejects.toThrow('Error deleting review from database');

            expect(mockMovieReviewRepository.delete).toHaveBeenCalledWith({
                id: nonExistingId,
            });
        });
    });

    describe('updateMovieReviewNotes', () => {
        it('should update the notes of an existing review', async () => {
            const { id: movieReviewId } = dummyMovieReviews[0];
            const updatedNotes = 'Updated notes for test';

            const existingReview = new MovieReview();
            existingReview.id = movieReviewId;
            existingReview.title = 'Original Title';
            existingReview.notes = 'Original notes';

            mockMovieReviewRepository.findOne = jest
                .fn()
                .mockResolvedValue(existingReview);

            mockMovieReviewRepository.save = jest
                .fn()
                .mockImplementation(async (review) => review);

            const updateDto = { notes: updatedNotes };
            const result = await movieReviewService.updateMovieReviewNotes(
                movieReviewId,
                updateDto,
            );

            expect(mockMovieReviewRepository.findOne).toHaveBeenCalledWith({
                where: { id: movieReviewId },
            });
            expect(mockMovieReviewRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ notes: updatedNotes }),
            );
            expect(result.notes).toEqual(updatedNotes);
        });

        it('should throw an error if the review is not found', async () => {
            const nonExistingId = 'non-existing-id';
            mockMovieReviewRepository.findOne = jest
                .fn()
                .mockResolvedValue(null);

            await expect(
                movieReviewService.updateMovieReviewNotes(nonExistingId, {
                    notes: 'New notes',
                }),
            ).rejects.toThrow('Review not found on database');
        });
    });
});
