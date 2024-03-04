import { OmdbMovieResponse } from '../../omdb/entities/omdb';
import { MovieReview } from '../entities/movie-review';

export function mapToMovieReview(
    apiResponse: OmdbMovieResponse,
    notes: string,
): MovieReview {
    const movieReview = new MovieReview();
    movieReview.title = apiResponse.Title;
    movieReview.notes = notes;
    movieReview.genre = apiResponse.Genre;
    movieReview.year = apiResponse.Year;
    movieReview.directors = apiResponse.Director.split(', ');
    movieReview.actors = apiResponse.Actors.split(', ');
    movieReview.runtime = apiResponse.Runtime;
    movieReview.rated = apiResponse.Rated;
    movieReview.ratings = apiResponse.Ratings.map(
        (rating) => `${rating.Source}: ${rating.Value}`,
    );
    movieReview.metascore = apiResponse.Metascore;
    movieReview.imdbRating = apiResponse.imdbRating;
    movieReview.imdbVotes = apiResponse.imdbVotes;
    movieReview.country = apiResponse.Country;
    movieReview.released = new Date(apiResponse.Released).toISOString();

    return movieReview;
}
