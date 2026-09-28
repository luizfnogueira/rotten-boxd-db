import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster';

  return (
    <Link to={`/movie/${movie.sk_movie_id}`} className="group flex flex-col gap-2 no-underline cursor-pointer">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md border border-gray-700/50 shadow-md group-hover:border-[#00e054] transition-colors duration-200">
        <img 
          src={posterUrl} 
          alt={movie.titulo} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-[#00e054] transition-colors duration-200 line-clamp-2">
          {movie.titulo}
        </h3>
      </div>
    </Link>
  );
}
