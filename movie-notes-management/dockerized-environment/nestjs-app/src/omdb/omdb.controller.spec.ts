import { Test, TestingModule } from '@nestjs/testing';
import { OmdbController } from './omdb.controller';

describe('OmdbController', () => {
  let controller: OmdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmdbController],
    }).compile();

    controller = module.get<OmdbController>(OmdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
