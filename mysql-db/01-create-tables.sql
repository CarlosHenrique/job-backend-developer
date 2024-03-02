USE DOCKERIZED;
CREATE TABLE movie_reviews(
   id  VARCHAR(255) NOT NULL,
   title VARCHAR(255) NOT NULL,
   notes TEXT NOT NULL,
   genre VARCHAR(255) NOT NULL,
   year VARCHAR(4) NOT NULL,
   directors JSON NOT NULL,
   actors JSON NOT NULL,
   runtime VARCHAR(10) NOT NULL,
   rated VARCHAR(10) NOT NULL,
   ratings JSON NOT NULL,
   metascore VARCHAR(3) NOT NULL,
   imdbRating VARCHAR(4) NOT NULL,
   imdbVotes VARCHAR(255) NOT NULL,
   country VARCHAR(255) NOT NULL,
   released VARCHAR(255) NOT NULL
);