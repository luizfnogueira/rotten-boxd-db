import { api } from './api';
import type { Movie, MovieDetail, MovieCreateData, MovieUpdateData, PaginatedMovies, Review, ReviewCreateData } from '../types/movie';

export const movieService = {
  async getMovies(title = '', page = 1, size = 20): Promise<PaginatedMovies> {
    const response = await api.get<PaginatedMovies>('/movies', {
      params: { title: title || undefined, page, size },
    });
    return response.data;
  },

  async getMovieById(sk_movie_id: string): Promise<MovieDetail> {
    const response = await api.get<MovieDetail>(`/movies/${sk_movie_id}`);
    return response.data;
  },

  async createMovie(data: MovieCreateData): Promise<Movie> {
    const response = await api.post<Movie>('/movies', data);
    return response.data;
  },

  async updateMovie(sk_movie_id: string, data: MovieUpdateData): Promise<Movie> {
    const response = await api.put<Movie>(`/movies/${sk_movie_id}`, data);
    return response.data;
  },

  async deleteMovie(sk_movie_id: string): Promise<void> {
    await api.delete(`/movies/${sk_movie_id}`);
  },

  async addReview(sk_movie_id: string, data: ReviewCreateData): Promise<Review> {
    const response = await api.post<Review>(`/movies/${sk_movie_id}/reviews`, data);
    return response.data;
  },
};
