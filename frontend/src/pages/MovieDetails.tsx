import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import type { MovieDetail, Review } from '../types/movie';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Review form state
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState(5.0);
  const [comentario, setComentario] = useState('');

  const loadMovie = async () => {
    if (!id) return;
    try {
      const data = await movieService.getMovieById(id);
      setMovie(data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading movie:', error);
    }
  };

  useEffect(() => {
    loadMovie();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await movieService.addReview(id, { nome, nota, comentario });
      setNome('');
      setNota(5.0);
      setComentario('');
      loadMovie();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!movie) return <div className="state-message">Carregando detalhes...</div>;

  return (
    <section className="panel-grid">
      <aside className="panel left-panel">
        <div className="movie-card-poster-wrap" style={{ marginBottom: '20px' }}>
          <img 
            src={movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster'} 
            alt={movie.titulo} 
            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 8px 18px rgba(0,0,0,0.3)', display: 'block' }}
          />
          {movie.reviews_summary?.nota_media_usuarios != null && (
            <div className="movie-card-score" style={{ fontSize: '1rem', padding: '8px 12px', right: '-10px', bottom: '-10px' }}>
              {movie.reviews_summary.nota_media_usuarios.toFixed(1)}
            </div>
          )}
        </div>
        <div className="panel-header" style={{ marginTop: '20px' }}>
          <h3>Estatísticas</h3>
        </div>
        <p className="panel-helper">
          {movie.reviews_summary?.qtd_avaliacoes_usuarios || 0} avaliações na comunidade.
        </p>
      </aside>

      <div className="panel right-panel" style={{ gridColumn: 'span 2' }}>
        <div className="diary-header-row" style={{ marginBottom: '16px' }}>
          <h3>{movie.titulo}</h3>
          <span className="diary-year">{movie.ano_lancamento}</span>
        </div>
        
        {movie.diretor && (
          <div className="diary-meta-row" style={{ marginBottom: '20px' }}>
            <span style={{ color: 'var(--letterboxd-text-soft)' }}>Dirigido por</span> <strong>{movie.diretor}</strong>
          </div>
        )}
        
        <p style={{ lineHeight: '1.7', color: 'var(--letterboxd-text)', marginBottom: '20px' }}>
          {movie.sinopse}
        </p>

        {movie.genero && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {movie.genero.split(',').map((g, i) => (
              <span key={i} className="ghost-button">
                {g.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="panel" style={{ marginBottom: '40px', background: 'rgba(10, 16, 20, 0.45)' }}>
          <h3 style={{ marginBottom: '16px' }}>Adicionar uma Avaliação</h3>
          <form onSubmit={handleSubmitReview}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Seu nome"
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
                style={{ flex: 1, minWidth: '200px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--letterboxd-text-soft)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>Nota:</span>
                <div style={{ display: 'flex', gap: '4px', cursor: 'pointer', position: 'relative' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} style={{ position: 'relative', width: '24px', height: '24px' }}>
                      <span style={{ position: 'absolute', fontSize: '1.5rem', color: 'rgba(255,255,255,0.22)', lineHeight: '24px' }}>★</span>
                      <span style={{ position: 'absolute', fontSize: '1.5rem', color: 'var(--letterboxd-green)', lineHeight: '24px', overflow: 'hidden', width: nota >= star ? '100%' : (nota >= star - 0.5 ? '50%' : '0%') }}>★</span>
                      <div 
                        style={{ position: 'absolute', left: 0, width: '50%', height: '100%', zIndex: 10 }}
                        onClick={() => setNota(star - 0.5)}
                      />
                      <div 
                        style={{ position: 'absolute', right: 0, width: '50%', height: '100%', zIndex: 10 }}
                        onClick={() => setNota(star)}
                      />
                    </div>
                  ))}
                </div>
                <span style={{ color: 'var(--letterboxd-green)', fontWeight: 'bold' }}>{nota.toFixed(1)}</span>
              </div>
            </div>
            <textarea 
              placeholder="Escreva sua resenha..." 
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} 
              required 
              style={{ marginBottom: '16px' }}
            />
            <div style={{ textAlign: 'right' }}>
              <button type="submit" className="primary-button">Salvar Resenha</button>
            </div>
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '20px' }}>Resenhas da Comunidade</h3>
          <div className="user-reviews-grid">
            {reviews.length === 0 ? (
              <div className="empty-section">
                Nenhuma resenha ainda. Seja o primeiro!
              </div>
            ) : (
              reviews.map(r => (
                <div key={r.sk_movie_review_id} className="user-review-card">
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--letterboxd-white)', fontWeight: 'bold', flexShrink: 0 }}>
                    {r.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-review-body">
                    <div className="user-review-header">
                      <h3>{r.nome}</h3>
                    </div>
                    <div className="user-review-meta">
                      <span className="user-review-score">{'★'.repeat(Math.floor(r.nota))}{r.nota % 1 !== 0 ? '½' : ''}</span>
                      <span>Assistido em {new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p className="user-review-comment">{r.comentario}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
