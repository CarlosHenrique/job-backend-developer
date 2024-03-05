/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { MovieReviewDto } from './movie-review-dto';
export enum SortDirectionEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}
export class GetMovieReviewsQueryDto {
    @ApiPropertyOptional({
        example: SortDirectionEnum.ASC,
        description:
            'Ordena as revisões pela data de lançamento. Valores aceitos: ASC (ascendente), DESC (descendente).',
        enum: SortDirectionEnum,
    })
    @IsOptional()
    @IsEnum(SortDirectionEnum)
    sortRelease?: SortDirectionEnum;

    @ApiPropertyOptional({
        example: SortDirectionEnum.DESC,
        description:
            'Ordena as revisões pela avaliação. Valores aceitos: ASC (ascendente), DESC (descendente).',
        enum: SortDirectionEnum,
    })
    @IsOptional()
    @IsEnum(SortDirectionEnum)
    sortRating?: SortDirectionEnum;

    @ApiPropertyOptional({
        example: 'The Matrix',
        description:
            'Termo de pesquisa para filtrar as revisões pelo título do filme.',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        example: 4,
        description: 'Número de revisões por página. O padrão é 4.',
        type: Number,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize: number = 4;

    @ApiPropertyOptional({
        example: 1,
        description: 'Número da página atual para a paginação. O padrão é 1.',
        type: Number,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageNumber: number = 1;
}

export class PageResultDto {
    @ApiProperty({ type: [MovieReviewDto] })
    data: MovieReviewDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    currentPage: number;
}
