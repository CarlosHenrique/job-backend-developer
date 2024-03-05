import { ApiProperty } from '@nestjs/swagger';
export class ConflictErrorDto {
    @ApiProperty({ example: 409 })
    statusCode: number;

    @ApiProperty({ example: 'Conflict' })
    error: string;

    @ApiProperty({ example: 'A review for this movie already exists.' })
    message: string;
}

export class NotFoundErrorDto {
    @ApiProperty({ example: 404 })
    statusCode: number;

    @ApiProperty({ example: 'Not Found' })
    error: string;

    @ApiProperty({ example: 'Review not found on database.' })
    message: string;
}

export class RepositoryGenericErrorDto {
    @ApiProperty({ example: 500 })
    statusCode: number;

    @ApiProperty({ example: 'Internal Server Error' })
    error: string;

    @ApiProperty({ example: 'Error accessing the database.' })
    message: string;
}
