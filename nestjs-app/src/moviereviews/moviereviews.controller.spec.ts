import { Test, TestingModule } from '@nestjs/testing';
import { MoviereviewsController } from './moviereviews.controller';

describe('MoviereviewsController', () => {
    let controller: MoviereviewsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviereviewsController],
        }).compile();

        controller = module.get<MoviereviewsController>(MoviereviewsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
