import { MovieReview } from "../entities/movie-review";

export function mapToMovieReview(apiResponse: any, notes: string): MovieReview {
    const movieReview = new MovieReview();
    movieReview.title = apiResponse.Title;
    movieReview.notes = notes;
    movieReview.genre = apiResponse.Genre;
    movieReview.year = apiResponse.Year;
    movieReview.directors = apiResponse.Director.split(', ');
    movieReview.actors = apiResponse.Actors.split(', ');
    movieReview.runtime = apiResponse.Runtime;
    movieReview.rated = apiResponse.Rated;
    movieReview.ratings = apiResponse.Ratings.map((rating: { Source: string; Value: string; }) => `${rating.Source}: ${rating.Value}`); // Mapeando para o formato de string esperado
    movieReview.metascore = apiResponse.Metascore;
    movieReview.imdbRating = apiResponse.imdbRating;
    movieReview.imdbVotes = apiResponse.imdbVotes;
    movieReview.country = apiResponse.Country;



    return movieReview;
}