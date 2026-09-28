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
    <div>
      <div className="section-title">Popular Films</div>
      
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Find a film..." 
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset page on new search
        }}
      />

      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.sk_movie_id} movie={movie} />
        ))}
      </div>

      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
