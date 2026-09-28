import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';

export default function Admin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const size = 50;

  const loadMovies = async () => {
    try {
      const data = await movieService.getMovies('', page, size);
      setMovies(data.items);
    } catch (error) {
      console.error('Error fetching admin movies:', error);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este filme?')) {
      try {
        await movieService.deleteMovie(id);
        loadMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  return (
    <div>
      <div className="section-title">Admin Panel - Manage Films</div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Year</th>
            <th>Director</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.sk_movie_id}>
              <td style={{ color: 'var(--text-muted)' }}>{movie.sk_movie_id.slice(0, 8)}...</td>
              <td>{movie.titulo}</td>
              <td>{movie.ano_lancamento}</td>
              <td>{movie.diretor}</td>
              <td>
                <button style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '0.2rem 0.5rem', cursor: 'pointer', borderRadius: '4px' }} onClick={() => handleDelete(movie.sk_movie_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
