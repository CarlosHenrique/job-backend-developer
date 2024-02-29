import { Module } from '@nestjs/common';
import { MoviereviewsModule } from './moviereviews/moviereviews.module';
import { OmdbModule } from './omdb/omdb.module';

@Module({
  imports: [MoviereviewsModule, OmdbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
