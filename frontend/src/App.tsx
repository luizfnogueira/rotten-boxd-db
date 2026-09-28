import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile';
import LogMovieModal from './components/LogMovieModal';
import './App.css';

function App() {
  const [isLogOpen, setIsLogOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <header className="bg-[#14181c] border-b border-[#2c3440] py-6 px-8 text-white text-xs font-semibold tracking-wider font-sans">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-4 h-4 rounded-full bg-[#ff8000]"></span>
              <span className="w-4 h-4 rounded-full bg-[#00e054]"></span>
              <span className="w-4 h-4 rounded-full bg-[#40bcf4]"></span>
            </span>
            <span className="text-2xl font-bold font-serif tracking-tight ml-2">RottenBoxdbd</span>
          </div>
          
          <nav className="flex items-center gap-6 md:gap-8">
            <Link to="/" className="hover:text-white text-gray-300 tracking-widest text-[11px] mr-6">FILMS</Link>
            <Link to="/admin" className="hover:text-white text-gray-300 tracking-widest text-[11px] mr-6">ADMIN</Link>
            
            <button className="text-gray-300 hover:text-white text-lg mr-4">
              ⚲
            </button>
            
            <button 
              className="bg-[#00e054] hover:bg-[#00c04b] text-white px-4 py-2 rounded flex items-center gap-2 transition-colors font-bold tracking-wider"
              onClick={() => setIsLogOpen(true)}
            >
              + LOG
            </button>
          </nav>
        </div>
      </header>
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
      
      {isLogOpen && <LogMovieModal onClose={() => setIsLogOpen(false)} />}
    </div>
  );
}

export default App;
