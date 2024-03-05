import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CreateMovieReviewDomainDto } from './dtos/create-movie-review.dto';
import {
    GetMovieReviewsQueryDto,
    PageResultDto,
} from './dtos/get-movie-reviews.dto';
import { MoviereviewsService, PageResult } from './moviereviews.service';
import { MovieReview } from './entities/movie-review';
import { UpdateMovieReviewDto } from './dtos/update-movie-review.dto';
import {
    ApiTags,
    ApiOkResponse,
    ApiParam,
    ApiNotFoundResponse,
    ApiBody,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { MovieReviewDto } from './dtos/movie-review-dto';
import {
    ConflictErrorDto,
    NotFoundErrorDto,
    RepositoryGenericErrorDto,
} from './dtos/error-response.dto';
@ApiTags('movie-reviews')
@Controller('movie-reviews')
export class MoviereviewsController {
    constructor(private readonly movieReviewService: MoviereviewsService) {}

    @Post()
    @ApiOkResponse({
        description: 'Retorna os detalhes da uma revisão criada.',
        type: MovieReviewDto,
    })
    @ApiConflictResponse({
        description: 'Conflito ao tentar criar uma revisão que já existe.',
        type: ConflictErrorDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno de servidor',
        type: RepositoryGenericErrorDto,
    })
    @ApiBody({
        description: 'Payload para atualização da revisão do filme',
        type: CreateMovieReviewDomainDto,
    })
    createReview(
        @Body()
        createMovieReviewDto: CreateMovieReviewDomainDto,
    ): Promise<MovieReview> {
        return this.movieReviewService.createReview(createMovieReviewDto);
    }

    @Get()
    @ApiOkResponse({
        description: 'Retorna uma lista paginada de revisões de filmes.',
        type: PageResultDto, // Use o DTO de resposta paginada aqui
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno de servidor',
        type: RepositoryGenericErrorDto,
    })
    getReviews(
        @Query()
        filter: GetMovieReviewsQueryDto,
    ): Promise<PageResult<MovieReview>> {
        return this.movieReviewService.getReviews(filter);
    }

    @Get('/:id')
    @ApiOkResponse({
        description:
            'Retorna os detalhes de uma revisão de filme específica pelo ID.',
        type: MovieReviewDto,
    })
    @ApiNotFoundResponse({
        description: 'Revisão do filme não encontrada.',
        type: NotFoundErrorDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno de servidor',
        type: RepositoryGenericErrorDto,
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID único da revisão de filme a ser buscada.',
        type: String,
    })
    getReviewById(@Param('id') id: string): Promise<MovieReview> {
        return this.movieReviewService.getReviewById(id);
    }

    @ApiOkResponse({
        description: 'Revisão de filme deletada com sucesso.',
    })
    @ApiNotFoundResponse({
        description: 'Revisão do filme não encontrada.',
        type: NotFoundErrorDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno de servidor',
        type: RepositoryGenericErrorDto,
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID único da revisão de filme a ser deletada.',
        type: String,
    })
    @Delete('/:id')
    deleteReviewById(@Param('id') id: string): Promise<void> {
        return this.movieReviewService.deleteReviewById(id);
    }

    @ApiOkResponse({
        description: 'Revisão de filme atualizada com sucesso.',
        type: MovieReviewDto,
    })
    @ApiNotFoundResponse({
        description: 'Revisão do filme não encontrada.',
        type: NotFoundErrorDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno de servidor',
        type: RepositoryGenericErrorDto,
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID único da revisão de filme a ser atualizada.',
        type: String,
    })
    @ApiBody({
        description: 'Payload para atualização da revisão do filme',
        type: UpdateMovieReviewDto,
    })
    @Patch('/:id')
    updateReviewById(
        @Param('id') id: string,
        @Body() updateMovieReviewDto: UpdateMovieReviewDto,
    ): Promise<MovieReview> {
        return this.movieReviewService.updateMovieReviewNotes(
            id,
            updateMovieReviewDto,
        );
    }
}
