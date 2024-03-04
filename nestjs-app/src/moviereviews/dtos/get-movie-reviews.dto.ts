/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';

export enum SortDirectionEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class GetMovieReviewsQueryDto {
    @IsOptional()
    @IsEnum(SortDirectionEnum)
    sortRelease?: SortDirectionEnum;

    @IsOptional()
    @IsEnum(SortDirectionEnum)
    sortRating?: SortDirectionEnum;

    @IsOptional()
    @IsString()
    search?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize: number = 4;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageNumber: number = 1;
}
