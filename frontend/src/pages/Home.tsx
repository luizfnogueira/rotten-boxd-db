import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../types/movie';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 15; // 3 linhas completas de 5 filmes

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mt-6" style={{ gap: '2rem' }}>
        {movies.map(movie => (
          <MovieCard key={movie.sk_movie_id} movie={movie} />
        ))}
      </div>
      {movies.length === 0 && (
        <div className="text-center py-16 text-gray-500 italic">Nenhum filme encontrado.</div>
      )}

      <div className="flex justify-center items-center gap-8 mt-16 pt-8 border-t border-[#2c3440] pb-12">
        <button 
          className="flex items-center gap-2 px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200"
          style={{
             backgroundColor: page === 1 ? 'transparent' : '#2c3440',
             color: page === 1 ? '#455566' : '#fff',
             border: page === 1 ? '1px solid #2c3440' : '1px solid #455566',
             cursor: page === 1 ? 'not-allowed' : 'pointer',
             boxShadow: page === 1 ? 'none' : '0 4px 6px rgba(0,0,0,0.2)',
             opacity: page === 1 ? 0.5 : 1
          }}
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
          onMouseOver={(e) => { if (page !== 1) e.currentTarget.style.backgroundColor = '#455566' }}
          onMouseOut={(e) => { if (page !== 1) e.currentTarget.style.backgroundColor = '#2c3440' }}
        >
          ← Anterior
        </button>

        <span className="text-[#8b9bab] text-xs uppercase tracking-widest">
          {page} <span className="mx-1">/</span> {totalPages}
        </span>

        <button 
          className="flex items-center gap-2 px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200"
          style={{
             backgroundColor: page >= totalPages ? 'transparent' : '#2c3440',
             color: page >= totalPages ? '#455566' : '#fff',
             border: page >= totalPages ? '1px solid #2c3440' : '1px solid #455566',
             cursor: page >= totalPages ? 'not-allowed' : 'pointer',
             boxShadow: page >= totalPages ? 'none' : '0 4px 6px rgba(0,0,0,0.2)',
             opacity: page >= totalPages ? 0.5 : 1
          }}
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}
          onMouseOver={(e) => { if (page < totalPages) e.currentTarget.style.backgroundColor = '#455566' }}
          onMouseOut={(e) => { if (page < totalPages) e.currentTarget.style.backgroundColor = '#2c3440' }}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
