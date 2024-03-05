import { ApiProperty } from '@nestjs/swagger';

export class MovieReviewDto {
    @ApiProperty({ example: 'uuid-example-1234' })
    id: string;

    @ApiProperty({ example: 'The Matrix' })
    title: string;

    @ApiProperty({ example: 'Great movie with groundbreaking visuals.' })
    notes: string;

    @ApiProperty({ example: 'Action, Sci-Fi' })
    genre: string;

    @ApiProperty({ example: '1999' })
    year: string;

    @ApiProperty({ example: ['Lana Wachowski', 'Lilly Wachowski'] })
    directors: string[];

    @ApiProperty({ example: ['Keanu Reeves', 'Laurence Fishburne'] })
    actors: string[];

    @ApiProperty({ example: '136 min' })
    runtime: string;

    @ApiProperty({ example: 'R' })
    rated: string;

    @ApiProperty({ example: [{ source: 'IMDb', value: '8.7/10' }] })
    ratings: string[];

    @ApiProperty({ example: '73' })
    metascore: string;

    @ApiProperty({ example: '8.7' })
    imdbRating: string;

    @ApiProperty({ example: '1,617,727' })
    imdbVotes: string;

    @ApiProperty({ example: 'USA' })
    country: string;

    @ApiProperty({ example: '1999-03-31' })
    released: string;
}
