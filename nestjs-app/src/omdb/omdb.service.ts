import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OmdbMovieResponse } from './entities/omdb';

@Injectable()
export class OmdbService {
    async searchMovies(title: string): Promise<OmdbMovieResponse> {
        try {
            const response = await axios.get<OmdbMovieResponse>(
                `${process.env.OMDB_URL}?apikey=${process.env.OMDB_APIKEY}&t=${title}`,
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}
