import { api } from './api';
import type { User, UserProfile, UserReview, UserUpdateData, WatchlistEntry } from '../types/user';

export const userService = {
  async loginOrCreate(username: string): Promise<User> {
    const response = await api.post<User>('/users', { username });
    return response.data;
  },

  async getProfile(username: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/users/${encodeURIComponent(username)}`);
    return response.data;
  },

  async updateProfile(username: string, data: UserUpdateData): Promise<User> {
    const response = await api.put<User>(`/users/${encodeURIComponent(username)}`, data);
    return response.data;
  },

  async getUserReviews(username: string): Promise<UserReview[]> {
    const response = await api.get<UserReview[]>(`/users/${encodeURIComponent(username)}/reviews`);
    return response.data;
  },

  async getWatchlist(username: string): Promise<WatchlistEntry[]> {
    const response = await api.get<WatchlistEntry[]>(`/users/${encodeURIComponent(username)}/watchlist`);
    return response.data;
  },

  async addToWatchlist(username: string, sk_movie_id: string): Promise<WatchlistEntry> {
    const response = await api.post<WatchlistEntry>(
      `/users/${encodeURIComponent(username)}/watchlist/${sk_movie_id}`
    );
    return response.data;
  },

  async removeFromWatchlist(username: string, sk_movie_id: string): Promise<void> {
    await api.delete(`/users/${encodeURIComponent(username)}/watchlist/${sk_movie_id}`);
  },
};
