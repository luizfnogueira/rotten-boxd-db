import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster';

  return (
    <Link to={`/movie/${movie.sk_movie_id}`} className="group flex flex-col gap-2 no-underline cursor-pointer">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md border border-gray-700/50 shadow-md group-hover:border-[#00e054] transition-colors duration-200 bg-[#1b252d]">
        {!imgError ? (
          <img 
            src={posterUrl} 
            alt={movie.titulo} 
            className="w-full h-full object-cover" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl mb-2 text-gray-500">📷</span>
            <span className="text-xs text-gray-400 font-semibold line-clamp-3">{movie.titulo}</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-[#00e054] transition-colors duration-200 line-clamp-2">
          {movie.titulo}
        </h3>
      </div>
    </Link>
  );
}
