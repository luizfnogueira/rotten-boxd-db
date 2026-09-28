import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';
import LogMovieModal from './components/LogMovieModal';
import './App.css';

function App() {
  const [isLogOpen, setIsLogOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo">
          <span className="dots"><span className="dot orange"></span><span className="dot green"></span><span className="dot blue"></span></span>
          <span className="title">RottenBoxd</span>
        </div>
        <div className="nav-links">
          <Link to="/">Filmes</Link>
          <Link to="/admin">Admin</Link>
          <button className="btn-log" onClick={() => setIsLogOpen(true)}>+ Log</button>
        </div>
      </header>
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      
      {isLogOpen && <LogMovieModal onClose={() => setIsLogOpen(false)} />}
    </div>
  );
}

export default App;
