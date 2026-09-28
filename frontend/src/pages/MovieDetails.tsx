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
    <div className="details-layout">
      <div className="details-poster">
        <img 
          src={movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster'} 
          alt={movie.titulo} 
          className="movie-poster"
        />
      </div>
      <div className="details-info">
        <h1 className="details-title">{movie.titulo} <span style={{color: 'var(--text-muted)'}}>{movie.ano_lancamento}</span></h1>
        
        {movie.diretor && (
          <div className="details-director">
            Directed by <strong>{movie.diretor}</strong>
          </div>
        )}
        
        <p className="details-synopsis">{movie.sinopse}</p>

        <div className="section-title">Add a Review</div>
        <form onSubmit={handleSubmitReview} className="review-form">
          <input 
            type="text" 
            placeholder="Your Name" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            required 
          />
          <div style={{ marginBottom: '1rem' }}>
            <label>Rating (1 to 5): </label>
            <input 
              type="number" 
              min="1" max="5" step="0.5" 
              value={nota} 
              onChange={(e) => setNota(parseFloat(e.target.value))} 
              style={{ width: '80px', display: 'inline', marginLeft: '10px' }}
              required 
            />
          </div>
          <textarea 
            placeholder="Write your review..." 
            rows={4} 
            value={comentario} 
            onChange={(e) => setComentario(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-log">Save</button>
        </form>

        <div className="section-title">Reviews</div>
        <div>
          {reviews.length === 0 ? <p>No reviews yet.</p> : (
            reviews.map(r => (
              <div key={r.sk_movie_review_id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>{r.nome}</strong> 
                  <span className="stars" style={{ marginLeft: '10px' }}>
                    {'★'.repeat(Math.round(r.nota))}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{r.comentario}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
