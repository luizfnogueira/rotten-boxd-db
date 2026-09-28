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
  const [nota, setNota] = useState(5);
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
      setNota(5);
      setComentario('');
      loadMovie(); // refresh reviews and summary
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <img 
          src={movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster'} 
          alt={movie.titulo} 
          style={{ width: '100%', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', border: '1px solid #445566' }}
        />
        {movie.reviews_summary?.nota_media_usuarios && (
          <div style={{ marginTop: '15px', textAlign: 'center', background: '#2c3440', padding: '10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.8rem', color: '#8b9bab', textTransform: 'uppercase' }}>Ratings</div>
            <div style={{ fontSize: '1.5rem', color: '#00e054', fontWeight: 'bold' }}>
              {movie.reviews_summary.nota_media_usuarios.toFixed(1)} <span style={{fontSize: '1rem', color: '#8b9bab'}}>/ 5.0</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ flexGrow: 1 }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontFamily: 'serif' }}>
          {movie.titulo} <span style={{ fontSize: '1.2rem', color: '#8b9bab', fontWeight: 'normal', fontFamily: 'sans-serif' }}>{movie.ano_lancamento}</span>
        </h1>
        
        {movie.diretor && (
          <div style={{ fontSize: '1rem', color: '#8b9bab', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #445566' }}>
            Directed by <strong style={{ color: '#c0c9d1' }}>{movie.diretor}</strong>
          </div>
        )}
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#9ab' }}>
          {movie.sinopse}
        </p>

        {movie.genero && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {movie.genero.split(',').map((g, i) => (
              <span key={i} style={{ background: '#2c3440', color: '#8b9bab', padding: '4px 8px', borderRadius: '3px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {g.trim()}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px' }}>
          <h3 style={{ textTransform: 'uppercase', color: '#8b9bab', fontSize: '0.9rem', borderBottom: '1px solid #445566', paddingBottom: '5px' }}>Add a Review</h3>
          <form onSubmit={handleSubmitReview} style={{ background: '#2c3440', padding: '20px', borderRadius: '4px', marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b9bab', marginBottom: '5px' }}>Your Name</label>
                <input 
                  type="text" 
                  style={{ background: '#1b2228', border: '1px solid #445566', color: '#fff', padding: '8px', borderRadius: '3px' }}
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b9bab', marginBottom: '5px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '2px', fontSize: '1.5rem', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      onClick={() => setNota(star)}
                      style={{ color: star <= nota ? '#00e054' : '#445566' }}
                    >★</span>
                  ))}
                </div>
              </div>
            </div>
            <textarea 
              placeholder="Write your review..." 
              style={{ width: '100%', background: '#1b2228', border: '1px solid #445566', color: '#fff', padding: '10px', borderRadius: '3px', minHeight: '80px', marginBottom: '15px' }}
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} 
              required 
            />
            <div style={{ textAlign: 'right' }}>
              <button type="submit" style={{ background: '#00e054', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '3px', fontWeight: 'bold', cursor: 'pointer' }}>Save Review</button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h3 style={{ textTransform: 'uppercase', color: '#8b9bab', fontSize: '0.9rem', borderBottom: '1px solid #445566', paddingBottom: '5px' }}>Reviews</h3>
          <div style={{ marginTop: '15px' }}>
            {reviews.length === 0 ? <p style={{ color: '#8b9bab' }}>No reviews yet. Be the first!</p> : (
              reviews.map(r => (
                <div key={r.sk_movie_review_id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #2c3440', display: 'flex', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#445566', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>
                    {r.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#8b9bab' }}>
                      Review by <strong style={{ color: '#fff' }}>{r.nome}</strong>
                    </div>
                    <div style={{ color: '#00e054', fontSize: '1.2rem', margin: '5px 0' }}>
                      {'★'.repeat(Math.round(r.nota))}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8b9bab', marginBottom: '10px' }}>
                      Watched on {new Date(r.created_at || Date.now()).toLocaleDateString()}
                    </div>
                    <p style={{ color: '#c0c9d1', lineHeight: '1.5', margin: 0 }}>{r.comentario}</p>
                    <div style={{ marginTop: '15px', color: '#8b9bab', fontSize: '0.8rem', cursor: 'pointer' }}>
                      ♥ Like review
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
