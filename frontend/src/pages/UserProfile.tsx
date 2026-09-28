import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { starString } from '../components/StarRating';
import type { UserProfile as Profile, UserReview, WatchlistEntry } from '../types/user';

const DEFAULT_AVATAR = '/logo.png';

type Tab = 'reviews' | 'watchlist';

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [tab, setTab] = useState<Tab>('reviews');
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formUsername, setFormUsername] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formLocation, setFormLocation] = useState('');

  const navigate = useNavigate();
  const activeUser = localStorage.getItem('activeUser');

  const loadAll = useCallback(async (username: string) => {
    try {
      const [profileData, reviewsData, watchlistData] = await Promise.all([
        userService.getProfile(username),
        userService.getUserReviews(username),
        userService.getWatchlist(username),
      ]);
      setProfile(profileData);
      setReviews(reviewsData);
      setWatchlist(watchlistData);
      setFormUsername(profileData.username);
      setFormBio(profileData.bio || '');
      setFormLocation(profileData.location || '');
      setError(null);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Não foi possível carregar o perfil. O backend está rodando?');
    }
  }, []);

  useEffect(() => {
    if (!activeUser) {
      navigate('/');
      return;
    }
    loadAll(activeUser);
  }, [activeUser, navigate, loadAll]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !formUsername.trim()) return;
    try {
      const updated = await userService.updateProfile(profile.username, {
        username: formUsername.trim(),
        bio: formBio,
        location: formLocation,
      });
      localStorage.setItem('activeUser', updated.username);
      setIsEditing(false);
      loadAll(updated.username);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Não foi possível salvar (o username pode já estar em uso).');
    }
  };

  const handleRemoveFromWatchlist = async (sk_movie_id: string) => {
    if (!profile) return;
    try {
      await userService.removeFromWatchlist(profile.username, sk_movie_id);
      setWatchlist(list => list.filter(e => e.movie.sk_movie_id !== sk_movie_id));
      setProfile(p => p ? { ...p, stats: { ...p.stats, watchlist_count: p.stats.watchlist_count - 1 } } : p);
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  if (error) {
    return <div className="text-center py-20 text-gray-400">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-gray-400">Carregando perfil...</div>;
  }

  const stats = profile.stats;

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-12 text-[#9ab] font-sans pb-20">

      {/* CABEÇALHO DO PERFIL */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-[#2c3440]">
        <div className="flex items-center gap-6">
          <img
            src={profile.avatar_url || DEFAULT_AVATAR}
            alt={profile.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#2c3440] shadow-lg"
          />
          {!isEditing ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h1 className="text-white text-3xl font-bold font-serif m-0">{profile.username}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[#8b9bab] hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors bg-[#2c3440] hover:bg-[#445566] px-3 py-1.5 rounded"
                >
                  Edit Profile
                </button>
              </div>
              {profile.bio && <p className="text-sm text-[#8b9bab] m-0">{profile.bio}</p>}
              {profile.location && (
                <p className="text-xs text-[#667788] m-0">📍 {profile.location}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-2">
              <input
                type="text"
                value={formUsername}
                onChange={e => setFormUsername(e.target.value)}
                className="bg-[#cdd8e4] text-[#14181c] px-3 py-1.5 rounded font-bold outline-none w-64"
                placeholder="Username"
                required
              />
              <input
                type="text"
                value={formBio}
                onChange={e => setFormBio(e.target.value)}
                className="bg-[#cdd8e4] text-[#14181c] px-3 py-1.5 rounded outline-none w-64 text-sm"
                placeholder="Bio"
                maxLength={500}
              />
              <input
                type="text"
                value={formLocation}
                onChange={e => setFormLocation(e.target.value)}
                className="bg-[#cdd8e4] text-[#14181c] px-3 py-1.5 rounded outline-none w-64 text-sm"
                placeholder="Localização"
                maxLength={120}
              />
              <div className="flex gap-2 mt-1">
                <button type="submit" className="bg-[#00e054] hover:bg-[#00c04b] transition-colors text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormUsername(profile.username);
                    setFormBio(profile.bio || '');
                    setFormLocation(profile.location || '');
                  }}
                  className="bg-[#445566] hover:bg-[#556677] transition-colors text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* MÉTRICAS */}
        <div className="flex divide-x divide-[#2c3440] text-center">
          {[
            { value: stats.films_watched, label: 'Films' },
            { value: stats.reviews_count, label: 'Reviews' },
            { value: stats.watchlist_count, label: 'Watchlist' },
            { value: stats.average_rating != null ? stats.average_rating.toFixed(1) : '—', label: 'Avg Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6">
              <div className="text-white text-2xl font-bold font-serif leading-none">{value}</div>
              <div className="text-[#667788] text-[10px] font-bold tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABAS */}
      <div className="flex gap-6 mt-6 border-b border-[#2c3440]">
        {([['reviews', `Reviews (${reviews.length})`], ['watchlist', `Watchlist (${watchlist.length})`]] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-[12px] font-bold tracking-widest uppercase transition-colors bg-transparent border-0 cursor-pointer ${
              tab === key ? 'text-white border-b-2 border-[#00e054]' : 'text-[#8b9bab] hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* REVIEWS DO USUÁRIO */}
      {tab === 'reviews' && (
        <div className="mt-8 flex flex-col gap-4">
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">Você ainda não avaliou nenhum filme.</div>
          ) : (
            reviews.map(r => (
              <div key={r.sk_movie_review_id} className="bg-[#1b2228] p-4 rounded border border-[#2c3440] flex gap-4">
                <Link to={`/movie/${r.movie.sk_movie_id}`} className="shrink-0">
                  <img
                    src={r.movie.url_poster || 'https://placehold.co/60x90/1b252d/ffffff?text=?'}
                    alt={r.movie.titulo}
                    className="w-[60px] h-[90px] object-cover rounded border border-[#2c3440]"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Link to={`/movie/${r.movie.sk_movie_id}`} className="text-white font-serif font-bold text-lg no-underline hover:text-[#00e054] transition-colors">
                      {r.movie.titulo} <span className="text-sm text-gray-500 font-sans font-normal">{r.movie.ano_lancamento}</span>
                    </Link>
                    <span className="text-[#00e054]">{starString(r.nota)}</span>
                  </div>
                  <p className="text-gray-500 text-xs italic mt-1 mb-2">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed m-0">{r.comentario}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* WATCHLIST */}
      {tab === 'watchlist' && (
        <div className="mt-8">
          {watchlist.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">
              Sua watchlist está vazia. Adicione filmes pela página de cada filme!
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1.5rem' }}>
              {watchlist.map(entry => (
                <div key={entry.sk_watchlist_id} className="relative group">
                  <Link to={`/movie/${entry.movie.sk_movie_id}`}>
                    <img
                      src={entry.movie.url_poster || 'https://placehold.co/120x180/1b252d/ffffff?text=?'}
                      alt={entry.movie.titulo}
                      className="w-full aspect-[2/3] object-cover rounded border border-[#2c3440] group-hover:border-[#00e054] transition-colors"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWatchlist(entry.movie.sk_movie_id)}
                    title="Remover da watchlist"
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
                  >
                    ✕
                  </button>
                  <div className="text-center text-xs text-gray-300 mt-1 line-clamp-2">{entry.movie.titulo}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
