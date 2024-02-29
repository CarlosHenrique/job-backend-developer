import { Module } from '@nestjs/common';
import { MoviereviewsController } from './moviereviews.controller';
import { MoviereviewsService } from './moviereviews.service';

@Module({
  controllers: [MoviereviewsController],
  providers: [MoviereviewsService]
})
export class MoviereviewsModule {}
