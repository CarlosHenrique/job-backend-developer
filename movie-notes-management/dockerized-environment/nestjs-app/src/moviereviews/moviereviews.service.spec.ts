import { Test, TestingModule } from '@nestjs/testing';
import { MoviereviewsService } from './moviereviews.service';

describe('MoviereviewsService', () => {
  let service: MoviereviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviereviewsService],
    }).compile();

    service = module.get<MoviereviewsService>(MoviereviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
