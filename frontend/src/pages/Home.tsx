import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../types/movie';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 18;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getMovies(search, page, size);
        setMovies(data.items);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    // Debounce search a bit
    const timeoutId = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timeoutId);
  }, [search, page]);

  const totalPages = Math.ceil(total / size);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between border-b border-gray-700/50 pb-4 mb-8">
        <h2 className="text-xl text-gray-300 font-serif tracking-wide uppercase">Populares</h2>
        
        <div className="relative">
          <input 
            type="text" 
            className="bg-[#1b2228] border border-gray-700/50 rounded-full px-5 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00e054] w-64 transition-colors" 
            placeholder="Procurar filme..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mt-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
        {movies.map(movie => (
          <MovieCard key={movie.sk_movie_id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-700/50">
        <button 
          className="px-4 py-2 bg-transparent text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wider"
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}>
          Anterior
        </button>
        <span className="text-[#8b9bab] text-xs uppercase tracking-widest">
          {page} <span className="mx-1">/</span> {totalPages}
        </span>
        <button 
          className="px-4 py-2 bg-transparent text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wider"
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
}
