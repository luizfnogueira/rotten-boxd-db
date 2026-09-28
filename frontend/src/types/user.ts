import type { Movie } from './movie';

export interface UserStats {
  films_watched: number;
  reviews_count: number;
  watchlist_count: number;
  average_rating: number | null;
}

export interface User {
  sk_user_id: string;
  username: string;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export interface UserProfile extends User {
  stats: UserStats;
}

export interface UserUpdateData {
  username?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
}

export interface UserReview {
  sk_movie_review_id: string;
  sk_movie_id: string;
  nome: string;
  nota: number;
  comentario: string;
  created_at: string;
  movie: Movie;
}

export interface WatchlistEntry {
  sk_watchlist_id: string;
  created_at: string;
  movie: Movie;
}
