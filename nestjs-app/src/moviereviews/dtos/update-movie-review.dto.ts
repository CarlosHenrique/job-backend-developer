import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateMovieReviewDto {
    @ApiProperty({
        example:
            'Uma obra intrigante de ilusionismo combinada com um enredo cheio de reviravoltas.',
        description:
            'Notas pessoais ou comentários sobre o filme ou série, incluindo opinião crítica ou pontos de destaque.',
    })
    @IsString()
    @IsNotEmpty()
    notes: string;
}
