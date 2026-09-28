import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import type { Movie, MovieCreateData } from '../types/movie';

export default function Admin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const size = 50;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [url_poster, setUrlPoster] = useState('');
  const [diretor, setDiretor] = useState('');
  const [genero, setGenero] = useState('');
  const [sinopse, setSinopse] = useState('');

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

  const handleEdit = (movie: Movie) => {
    setEditingId(movie.sk_movie_id);
    setTitulo(movie.titulo);
    setAno(movie.ano_lancamento?.toString() || '');
    setUrlPoster(movie.url_poster || '');
    setDiretor(movie.diretor || '');
    setGenero(movie.genero || '');
    setSinopse(movie.sinopse || '');
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: MovieCreateData = {
        id_filme: editingId || Date.now().toString(),
        titulo,
        ano_lancamento: parseInt(ano) || undefined,
        url_poster,
        diretor,
        genero,
        sinopse
      };
      
      if (editingId) {
        await movieService.updateMovie(editingId, data);
        setEditingId(null);
      } else {
        await movieService.createMovie(data);
      }
      
      setTitulo('');
      setAno('');
      setUrlPoster('');
      setDiretor('');
      setGenero('');
      setSinopse('');
      loadMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  return (
    <div>
      <div className="section-title">{editingId ? 'Edit Film' : 'Log a New Film'}</div>
      <form onSubmit={handleCreateOrUpdate} className="review-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input type="text" placeholder="Title" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <input type="number" placeholder="Year" value={ano} onChange={e => setAno(e.target.value)} />
        <input type="text" placeholder="Director" value={diretor} onChange={e => setDiretor(e.target.value)} />
        <input type="text" placeholder="Genre" value={genero} onChange={e => setGenero(e.target.value)} />
        <input type="text" placeholder="Poster URL" value={url_poster} onChange={e => setUrlPoster(e.target.value)} style={{ gridColumn: 'span 2' }} />
        <textarea placeholder="Synopsis" value={sinopse} onChange={e => setSinopse(e.target.value)} style={{ gridColumn: 'span 2' }} rows={3} />
        <button type="submit" className="btn-log" style={{ gridColumn: 'span 2' }}>
          {editingId ? 'Update Film' : '+ Log Film'}
        </button>
      </form>

      <div className="section-title">Manage Films</div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Director</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.sk_movie_id}>
              <td>{movie.titulo}</td>
              <td>{movie.ano_lancamento}</td>
              <td>{movie.diretor}</td>
              <td>
                <button style={{ background: 'transparent', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '0.2rem 0.5rem', cursor: 'pointer', borderRadius: '4px', marginRight: '5px' }} onClick={() => handleEdit(movie)}>
                  Edit
                </button>
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
