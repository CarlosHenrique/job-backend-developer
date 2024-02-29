import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class OmdbService {
  async searchMovies(title: string): Promise<AxiosResponse> {
    try {
      const response = await axios.get(
        `${process.env.OMDB_URL}?apikey=${process.env.OMDB_APIKEY}&t=${title}`,
      );
      const rawOmbdResponse = response.data;

      return response.data;
    } catch (err) {
      throw err;
    }
  }
}
