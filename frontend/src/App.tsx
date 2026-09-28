import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import LogMovieModal from './components/LogMovieModal';
import { userService } from './services/userService';
import './App.css';

function App() {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('activeUser');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleLogin = async (username: string) => {
    try {
      // Cria (ou recupera) o usuário no backend para perfil/watchlist.
      const user = await userService.loginOrCreate(username);
      setCurrentUser(user.username);
      localStorage.setItem('activeUser', user.username);
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Não foi possível conectar ao backend. Ele está rodando?');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('activeUser');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-wrapper">
      <header style={{ backgroundColor: '#14181c', borderBottom: '1px solid #2c3440', padding: '1.5rem 2rem', fontFamily: 'GraphikWeb, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="RottenBoxdbd"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00e054' }}
            />
            <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.05em', fontFamily: 'TiemposHeadlineWeb, Georgia, serif' }}>
              RottenBoxdbd
            </span>
          </Link>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" className="hover:text-white transition-colors" style={{ color: '#8b9bab', letterSpacing: '0.1em', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'none' }}>FILMS</Link>
            <Link to="/profile" className="hover:text-white transition-colors" style={{ color: '#8b9bab', letterSpacing: '0.1em', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'none' }}>PROFILE</Link>
            <Link to="/admin" className="hover:text-white transition-colors" style={{ color: '#8b9bab', letterSpacing: '0.1em', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'none' }}>ADMIN</Link>
            
            <button className="hover:text-white transition-colors" style={{ color: '#8b9bab', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              ⚲
            </button>

            <button 
              onClick={handleLogout}
              className="hover:text-white transition-colors" 
              style={{ color: '#8b9bab', letterSpacing: '0.1em', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              LOGOUT
            </button>
            
            <button 
              className="hover:bg-[#00c04b] transition-colors"
              onClick={() => setIsLogOpen(true)}
              style={{ backgroundColor: '#00e054', color: '#fff', padding: '0.5rem 1rem', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px' }}
            >
              + LOG
            </button>
          </nav>
        </div>
      </header>
      <main className="app-shell" style={{ backgroundColor: '#14181c', minHeight: 'calc(100vh - 72px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {isLogOpen && <LogMovieModal onClose={() => setIsLogOpen(false)} />}
    </div>
  );
}

export default App;
