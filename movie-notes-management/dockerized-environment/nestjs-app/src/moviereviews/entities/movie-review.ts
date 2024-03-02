import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'movie_reviews' })
export class MovieReview {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string

    @Column()
    notes: string

    @Column()
    genre: string;

    @Column()
    year: string;

    @Column({ type: 'simple-json' })
    directors: string[];

    @Column({ type: 'simple-json' })
    actors: string[];

    @Column()
    runtime: string;

    @Column()
    rated: string;

    @Column({ type: 'simple-json' })
    ratings: string[];

    @Column()
    metascore: string;

    @Column()
    imdbRating: string;

    @Column()
    imdbVotes: string;

    @Column()
    country: string;
}