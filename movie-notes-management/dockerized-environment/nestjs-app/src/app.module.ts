import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviereviewsModule } from './moviereviews/moviereviews.module';
import { OmdbModule } from './omdb/omdb.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_DOCKER_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: true
  }),
    MoviereviewsModule, OmdbModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
