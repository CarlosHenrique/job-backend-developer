import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );
    const config = new DocumentBuilder()
        .setTitle('Documentação - Movie Reviews API')
        .setDescription(
            'API de revisões de filmes que permite aos usuários organizar anotações sobre filmes assistidos, integrando-se ao The Open Movie Database (OMDb) para enriquecer cada revisão com detalhes automáticos como data de lançamento e avaliação do IMDb. Funcionalidades incluem criar, listar, visualizar, atualizar e deletar revisões de filmes.',
        )
        .setVersion('1.0')
        .addTag('movie-reviews')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    await app.listen(3001);
}
bootstrap();
