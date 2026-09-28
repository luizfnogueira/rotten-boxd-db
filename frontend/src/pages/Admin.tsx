import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import type { Movie, MovieCreateData } from '../types/movie';

export default function Admin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const size = 50;

  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [url_poster, setUrlPoster] = useState('');
  const [diretor, setDiretor] = useState('');

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: MovieCreateData = {
        id_filme: Date.now().toString(),
        titulo,
        ano_lancamento: parseInt(ano) || undefined,
        url_poster,
        diretor,
      };
      await movieService.createMovie(data);
      setTitulo('');
      setAno('');
      setUrlPoster('');
      setDiretor('');
      loadMovies();
    } catch (error) {
      console.error('Error creating movie:', error);
    }
  };

  return (
    <div>
      <div className="section-title">Log a New Film</div>
      <form onSubmit={handleCreate} className="review-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input type="text" placeholder="Title" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <input type="number" placeholder="Year" value={ano} onChange={e => setAno(e.target.value)} />
        <input type="text" placeholder="Poster URL" value={url_poster} onChange={e => setUrlPoster(e.target.value)} />
        <input type="text" placeholder="Director" value={diretor} onChange={e => setDiretor(e.target.value)} />
        <button type="submit" className="btn-log" style={{ gridColumn: 'span 2' }}>+ Log Film</button>
      </form>

      <div className="section-title">Manage Films</div>
      
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
