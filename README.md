# Dockerized Movie Reviews API

## Introdução

Este projeto é uma implementação da API de revisões de filmes, desenvolvida como parte do teste prático para Backend da Dolado. A API permite organizar anotações sobre filmes assistidos, integrando-se ao The Open Movie Database (OMDb) para enriquecer as revisões com detalhes como data de lançamento e avaliação do IMDb.

## Experiência de Desenvolvimento

Desenvolver esta API foi experiência incrível que me permitiu aprofundar meus conhecimentos em NestJS, Docker, e integração com APIs externas. Houveram alguns desafios, o primeiro foi utilizar o nestjs com a insfraestrutura do rest, já que só havia utilizando com graphQL, outro desafio foi utilizar MySQL e TypeORM, essa foi a primeira vez que utilizei, tive que dar uma estudada em como configurar o container e como configurar o typeorm no projeto. Falando um pouco sobre testes, meu contato com testes é bem recente e esssa foi a primeira vez que tive que criar/configurar testes do zero.

## Decisões Técnicas

Utilizei as recomendações de tecnologias que haviam na descrição do teste, tentei aplicar os partners que conhecia, talvez algumas coisas tenham passado batido, mas no geral foi tranquilo.

## Estrutura do Projeto

- `mysql-db/`: Contém os entrypoints e configurações necessárias para inicializar o container do MySQL.
- `nestjs-app/`: A aplicação NestJS desenvolvida para gerenciar revisões de filmes.
  - `test/`: Contém os testes de integração da aplicação, validando o comportamento esperado das rotas e serviços.
  - `src/`: Código-fonte principal da aplicação.
    - `moviereviews/`: Módulo responsável pela lógica de revisões de filmes.
        - `dtos/`: Data Transfer Objects usados para transferir dados entre as camadas da aplicação.
        - `entities/`: Entidades que representam tabelas no banco de dados para revisões de filmes.
        - `mappers/`: Mapeadores que transformam dados de uma forma para outra, como de respostas de APIs externas para entidades do banco de dados.
        - `controller/`: Controladores que gerenciam as requisições HTTP relacionadas às revisões de filmes.
        - `service/`: Serviços que contêm a lógica de negócios específica para o gerenciamento de revisões de filmes.
        - `module/`: Módulo NestJS que agrupa todos os componentes relacionados às revisões de filmes.
        - `controller-unit-test/`: Testes unitários para os controladores, assegurando que eles respondem como esperado.
        - `service-unit-test/`: Testes unitários para os serviços, validando a lógica de negócios.
    - `omdb/`: Módulo responsável pela integração com o The Open Movie Database (OMDb).
        - `entities/`: Entidades relacionadas aos dados obtidos do OMDB, se necessário.
        - `controller/`: Controlador para gerenciar requisições que envolvem a interação com o OMDB.
        - `service/`: Serviço que implementa a lógica de negócios para a comunicação com o OMDB.
        - `module/`: Módulo NestJS que encapsula a funcionalidade de integração com o OMDB.

## Como Rodar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados.

### Instruções
1. **Utilize o script start para rodar a aplicação:**
     ```sh
    npm run start
    ```
**OU**
1. **Construir a imagem do back-end:**

    ```sh
    npm run build:back
    ```

2. **Iniciar o Banco de Dados:**

    ```sh
    npm run start:db
    ```

    Aguarde alguns instantes até que o banco de dados esteja totalmente inicializado.

3. **Iniciar a Aplicação Backend:**

    ```sh
    npm run start:back
    ```

    A aplicação NestJS e o banco de dados MySQL serão iniciados, e a aplicação estará acessível localmente.

4. **Parar a Aplicação:**

    Para parar todos os serviços, execute:

    ```sh
    npm run stop
    ```

5. **Limpar os volumes:**

    Caso queira remover todos os volumes e dados:

    ```sh
    npm run clean
    ```

## Documentação da API

Após iniciar a aplicação, a documentação da API estará disponível em `/docs` graças à integração com o Swagger.
