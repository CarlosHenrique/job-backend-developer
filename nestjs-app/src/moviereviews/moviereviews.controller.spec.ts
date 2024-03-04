import { Test, TestingModule } from '@nestjs/testing';
import { MoviereviewsController } from './moviereviews.controller';
import { MoviereviewsService, PageResult } from './moviereviews.service';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import { dummyMovieReviews } from './entities/dummy-movie-reviews';
import { GetMovieReviewsQueryDto } from './dtos/get-movie-reviews.dto';
import { MovieReview } from './entities/movie-review';
import { NotFoundException } from '@nestjs/common';
import { mock } from 'node:test';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';

describe('MoviereviewsController', () => {
    let controller: MoviereviewsController;
    let mockMovieReviewService: Partial<MoviereviewsService>;

    beforeEach(async () => {
        mockMovieReviewService = {
            createReview: jest.fn().mockResolvedValue(dummyMovieReviews[0]),
            getReviews: jest
                .fn()
                .mockImplementation(
                    (
                        queryDto: GetMovieReviewsQueryDto,
                    ): Promise<PageResult<MovieReview>> => {
                        const data: MovieReview[] = dummyMovieReviews;
                        const total = data.length;
                        const totalPages = Math.ceil(total / queryDto.pageSize);
                        return Promise.resolve({
                            data,
                            total,
                            totalPages,
                            currentPage: queryDto.pageNumber,
                        });
                    },
                ),
            getReviewById: jest.fn().mockResolvedValue(dummyMovieReviews[0]),
            deleteReviewById: jest.fn(),
            updateMovieReviewNotes: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviereviewsController],
            providers: [
                {
                    provide: MoviereviewsService,
                    useValue: mockMovieReviewService,
                },
            ],
        }).compile();

        controller = module.get<MoviereviewsController>(MoviereviewsController);
    });

    describe('POST /movie-reviews', () => {
        it('Should create a movie review', async () => {
            const createDto: CreateMovieReviewDomainDto = {
                title: 'Epic Adventure',
                notes: 'A breathtaking journey with stunning visuals.',
            };
            const result = await controller.createReview(createDto);
            expect(result).toEqual(
                expect.objectContaining({
                    title: 'Epic Adventure',
                    notes: 'A breathtaking journey with stunning visuals.',
                }),
            );
            expect(mockMovieReviewService.createReview).toHaveBeenCalledWith(
                createDto,
            );
        });
    });

    describe('GET /movie-reviews', () => {
        it('should return a paginated list of movie reviews', async () => {
            const queryDto: GetMovieReviewsQueryDto = {
                pageSize: 4,
                pageNumber: 1,
            };
            const result = await controller.getReviews(queryDto);
            expect(result).toEqual(
                expect.objectContaining({
                    data: expect.arrayContaining(dummyMovieReviews.slice(0, 4)),
                    total: dummyMovieReviews.length,
                    totalPages: expect.any(Number),
                    currentPage: queryDto.pageNumber,
                }),
            );
            expect(mockMovieReviewService.getReviews).toHaveBeenCalledWith(
                queryDto,
            );
        });
    });

    describe('GET /movie-reviews/:id', () => {
        it('should return a movie review for a given ID', async () => {
            const id = '1';
            const result = await controller.getReviewById(id);
            expect(result).toEqual(dummyMovieReviews[0]);
            expect(mockMovieReviewService.getReviewById).toHaveBeenCalledWith(
                id,
            );
        });

        it('should throw NotFoundException for an unknown ID', async () => {
            const unknownId = 'unknown-id';
            jest.spyOn(
                mockMovieReviewService,
                'getReviewById',
            ).mockImplementationOnce(async () => {
                throw new NotFoundException(
                    'Error getting review from database',
                );
            });

            expect(controller.getReviewById(unknownId)).rejects.toThrow(
                NotFoundException,
            );
            expect(mockMovieReviewService.getReviewById).toHaveBeenCalledWith(
                unknownId,
            );
        });
    });
    describe('DELETE /movie-reviews/:id', () => {
        it('should delete a movie review successfully', async () => {
            const reviewIdToDelete = '1';
            jest.spyOn(
                mockMovieReviewService,
                'deleteReviewById',
            ).mockResolvedValue(undefined);

            await expect(
                controller.deleteReviewById(reviewIdToDelete),
            ).resolves.toBeUndefined();
            expect(
                mockMovieReviewService.deleteReviewById,
            ).toHaveBeenCalledWith(reviewIdToDelete);
        });

        it('should throw NotFoundException when trying to delete a non-existing review', async () => {
            const nonExistingReviewId = 'non-existing-id';
            jest.spyOn(
                mockMovieReviewService,
                'deleteReviewById',
            ).mockImplementationOnce(async () => {
                throw new NotFoundException(
                    'Error deleting review from database',
                );
            });

            expect(
                controller.deleteReviewById(nonExistingReviewId),
            ).rejects.toThrow(NotFoundException);
            expect(
                mockMovieReviewService.deleteReviewById,
            ).toHaveBeenCalledWith(nonExistingReviewId);
        });
    });

    describe('PATCH /movie-reviews/:id', () => {
        it('should successfully update a movie review notes', async () => {
            const reviewId = '1';
            const updateDto: UpdateMovieReviewDto = { notes: 'Updated notes' };
            const updatedReview = { ...dummyMovieReviews[0], ...updateDto };

            jest.spyOn(
                mockMovieReviewService,
                'updateMovieReviewNotes',
            ).mockResolvedValue(updatedReview);

            const result = await controller.updateReviewById(
                reviewId,
                updateDto,
            );

            expect(result).toEqual(updatedReview);
            expect(
                mockMovieReviewService.updateMovieReviewNotes,
            ).toHaveBeenCalledWith(reviewId, updateDto);
        });
        it('should throw NotFoundException when trying to update a non-existing review', async () => {
            const nonExistingId = 'non-existing-id';
            const updateDto: UpdateMovieReviewDto = { notes: 'Updated notes' };

            jest.spyOn(
                mockMovieReviewService,
                'updateMovieReviewNotes',
            ).mockImplementation(async () => {
                throw new NotFoundException('Review not found on database');
            });

            expect(
                controller.updateReviewById(nonExistingId, updateDto),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
