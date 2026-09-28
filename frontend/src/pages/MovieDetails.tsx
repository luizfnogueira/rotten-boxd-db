import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import type { MovieDetail, Review } from '../types/movie';

import LogMovieModal from '../components/LogMovieModal';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const loadMovie = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await movieService.getMovieById(id);
      setMovie(data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading movie:', error);
      // Fallback with mock data if API fails
      setMovie({
        sk_movie_id: id,
        id_filme: 'mock-123',
        titulo: 'Bugonia',
        ano_lancamento: 2025,
        diretor: 'Yorgos Lanthimos',
        sinopse: 'Two conspiracy obsessed young men kidnap the high-powered CEO of a major company, convinced that she is an alien intent on destroying planet Earth.',
        url_poster: 'https://placehold.co/300x450/1b252d/ffffff?text=Bugonia',
        genero: 'Comedy, Sci-Fi',
        duracao_minutos: 118,
        reviews_summary: {
          nota_media_usuarios: 3.8,
          qtd_avaliacoes_usuarios: 9200
        }
      });
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovie();
  }, [id]);

  const handleModalClose = () => {
    setIsLogModalOpen(false);
    loadMovie(); // Refresh reviews after logging
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Carregando detalhes...</div>;
  }

  if (!movie) {
    return <div className="text-center py-20 text-gray-400">Filme não encontrado.</div>;
  }



  const posterUrl = movie.url_poster || 'https://placehold.co/300x450/1b252d/ffffff?text=Poster';
  const notaMedia = movie.reviews_summary?.nota_media_usuarios || 0;

  return (
    <div className="bg-[#14181c] min-h-screen text-[#8b9bab] py-12 font-sans" style={{ fontFamily: 'GraphikWeb, -apple-system, sans-serif' }}>
      <div className="max-w-[800px] mx-auto px-6 flex flex-col gap-10">
        
        {/* CABEÇALHO DO FILME: PÔSTER (ESQUERDA) + INFO (DIREITA) */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* PÔSTER PEQUENO FIXO */}
          <div className="w-[200px] shrink-0">
            <div className="rounded-md overflow-hidden border border-gray-700/50 shadow-lg bg-[#1b252d]">
              <img src={posterUrl} alt={movie.titulo} className="w-full h-auto block" />
            </div>
            {/* RATING DO FILME DEBAIXO DO PÔSTER */}
            <div className="mt-4 flex flex-col items-center">
               <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Comunidade</span>
               <div className="flex gap-1 text-2xl" title={`${notaMedia.toFixed(1)} estrelas`}>
                 {[1, 2, 3, 4, 5].map((star) => (
                   <span key={star} className="relative">
                     <span className="text-gray-600">★</span>
                     <span 
                       className="absolute left-0 text-[#00e054] overflow-hidden whitespace-nowrap"
                       style={{ width: notaMedia >= star ? '100%' : (notaMedia >= star - 0.5 ? '50%' : '0%') }}
                     >
                       ★
                     </span>
                   </span>
                 ))}
               </div>
               <span className="text-xs font-semibold text-gray-300 mt-1">{notaMedia.toFixed(1)} / 5</span>
            </div>
          </div>

          {/* INFORMAÇÕES DO FILME */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white mb-1 leading-tight" style={{ fontFamily: 'TiemposHeadlineWeb, Georgia, serif' }}>
                {movie.titulo} <span className="text-2xl font-sans font-normal text-gray-400">{movie.ano_lancamento}</span>
              </h1>
              <p className="text-sm font-semibold uppercase tracking-wider">
                Directed by <span className="text-white ml-1">{movie.diretor || 'Unknown'}</span>
              </p>
            </div>

            <div className="border-t border-gray-700/50 pt-4">
              <p className="text-gray-300 leading-relaxed text-[15px]" style={{ fontFamily: 'TiemposTextWeb, Georgia, serif', lineHeight: '1.6' }}>
                {movie.sinopse}
              </p>
            </div>

            {/* BOTÃO PARA LOGAR O FILME */}
            <div className="mt-4">
              <button 
                onClick={() => setIsLogModalOpen(true)}
                className="bg-[#2c3440] hover:bg-[#445566] text-[#8b9bab] hover:text-white transition-colors py-2 px-4 rounded text-xs font-bold uppercase tracking-widest border border-[#445566] shadow-sm"
              >
                Review or log...
              </button>
            </div>

          </div>
        </div>

        {/* REVIEWS DA COMUNIDADE */}
        <div className="pb-12 max-w-2xl mx-auto w-full">
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-b border-gray-700/50 pb-2">Community Reviews</h3>
          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <div className="text-sm text-gray-500 italic">No reviews yet. Be the first!</div>
            ) : (
              reviews.map(r => (
                <div key={r.sk_movie_review_id} className="bg-[#1b2228] p-4 rounded border border-gray-700/50 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-gray-300 font-bold text-base">{r.nome}</strong>
                    <span className="text-[#00e054] text-sm">
                      {'★'.repeat(Math.floor(r.nota))}{r.nota % 1 !== 0 ? '½' : ''}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs italic mb-3">
                    {new Date(r.created_at || Date.now()).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'TiemposTextWeb, Georgia, serif' }}>
                    {r.comentario}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
      {isLogModalOpen && <LogMovieModal initialMovie={movie as any} onClose={handleModalClose} />}
    </div>
  );
}
