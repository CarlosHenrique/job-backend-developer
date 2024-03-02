import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmdbModule } from 'src/omdb/omdb.module';
import { MovieReview } from './entities/movie-review';
import { MoviereviewsController } from './moviereviews.controller';
import { MoviereviewsService } from './moviereviews.service';
@Module({
  imports: [TypeOrmModule.forFeature([MovieReview]), OmdbModule],
  controllers: [MoviereviewsController],
  providers: [MoviereviewsService,]
})
export class MoviereviewsModule { }
