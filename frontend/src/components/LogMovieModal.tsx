import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';
import './modal.css';

interface Props {
  onClose: () => void;
}

export default function LogMovieModal({ onClose }: Props) {
  const [step, setStep] = useState<'search' | 'log'>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [review, setReview] = useState('');
  const [rating, setRating] = useState('3.5');
  const [name, setName] = useState('User');

  useEffect(() => {
    if (query.length > 2) {
      movieService.getMovies(query, 1, 5).then(data => setResults(data.items));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setStep('log');
  };

  const handleSave = async () => {
    if (selectedMovie) {
      await movieService.addReview(selectedMovie.sk_movie_id, {
        nome: name,
        nota: parseFloat(rating),
        comentario: review
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-left">
            {step === 'log' ? (
              <>
                <button className="btn-back" onClick={() => setStep('search')}>{'< BACK'}</button>
                <h3 className="modal-title">I watched...</h3>
              </>
            ) : (
              <h3 className="modal-title">Log a film...</h3>
            )}
          </div>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        {step === 'search' ? (
          <div className="modal-body" style={{ flexDirection: 'column' }}>
            <input 
              type="text" 
              className="modal-textarea" 
              style={{ minHeight: '40px', marginBottom: 0 }}
              placeholder="Name of film..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <div className="modal-search-results">
              {results.map(movie => (
                <div key={movie.sk_movie_id} className="modal-search-item" onClick={() => handleSelect(movie)}>
                  <img src={movie.url_poster || 'https://via.placeholder.com/40x60'} alt={movie.titulo} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{movie.titulo}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8b9bab' }}>{movie.ano_lancamento} • {movie.diretor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <img src={selectedMovie?.url_poster || 'https://via.placeholder.com/150x225'} alt="Poster" className="modal-poster" />
              <div className="modal-form">
                <h2 className="modal-movie-title">
                  {selectedMovie?.titulo} <span>{selectedMovie?.ano_lancamento}</span>
                </h2>
                <div className="modal-checks">
                  <label><input type="checkbox" defaultChecked /> Watched on <span>{new Date().toLocaleDateString()}</span></label>
                  <label><input type="checkbox" /> I've watched this before</label>
                </div>
                
                <textarea 
                  className="modal-textarea"
                  placeholder="Add a review..."
                  value={review}
                  onChange={e => setReview(e.target.value)}
                />

                <div className="modal-meta-row">
                  <div className="modal-input-group">
                    <label>Tags</label>
                    <input type="text" className="modal-tags-input" placeholder="eg. netflix" />
                  </div>
                  
                  <div className="modal-input-group">
                    <label>Rating</label>
                    <div style={{ display: 'flex', gap: '2px', fontSize: '1.8rem', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          onClick={() => setRating(star.toString())}
                          style={{ color: star <= parseFloat(rating) ? '#00e054' : '#445566' }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="modal-input-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      className="modal-tags-input" 
                      style={{ width: '120px' }} 
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={handleSave}>Save</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
