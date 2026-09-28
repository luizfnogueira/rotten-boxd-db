import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Use a placeholder if poster is missing
  const posterUrl = movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster';

  return (
    <Link to={`/movies/${movie.sk_movie_id}`} className="movie-card">
      <img src={posterUrl} alt={movie.titulo} className="movie-poster" />
      <div className="movie-meta">
        <span className="stars">
          {movie.media_avaliacoes ? '★'.repeat(Math.round(movie.media_avaliacoes)) : ''}
        </span>
      </div>
    </Link>
  );
}
