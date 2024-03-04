import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMovieReviewDto {
    @IsString()
    @IsNotEmpty()
    notes: string;
}
