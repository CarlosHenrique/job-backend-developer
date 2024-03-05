import { OmitType } from '@nestjs/mapped-types';
import { MovieReview } from '../entities/movie-review';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMovieReviewDomainDto {
    @ApiProperty({
        example: 'Now you see me',
        description:
            'O título do filme ou série para a qual a revisão está sendo criada.',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        example:
            'Uma obra intrigante de ilusionismo combinada com um enredo cheio de reviravoltas.',
        description:
            'Notas pessoais ou comentários sobre o filme ou série, incluindo opinião crítica ou pontos de destaque.',
    })
    @IsNotEmpty()
    @IsString()
    notes: string;
}

export class CreateMovieArgs extends OmitType(MovieReview, ['id']) {}
