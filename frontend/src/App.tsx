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
      <header className="bg-[#14181c] border-b border-[#2c3440] py-3 px-8 text-white text-xs font-semibold tracking-wider font-sans">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-4 h-4 rounded-full bg-[#ff8000]"></span>
              <span className="w-4 h-4 rounded-full bg-[#00e054]"></span>
              <span className="w-4 h-4 rounded-full bg-[#40bcf4]"></span>
            </span>
            <span className="text-2xl font-bold font-serif tracking-tight ml-2">RottenBoxd</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/profile" className="flex items-center gap-2 hover:text-white text-gray-300 uppercase">
              <div className="w-6 h-6 rounded-full bg-gray-500 overflow-hidden">
                <img src="https://placehold.co/100x100/1b252d/ffffff?text=U" alt="User" className="w-full h-full object-cover" />
              </div>
              PIBEBRABO 
              <span className="text-[10px]">▼</span>
            </Link>
            
            <Link to="/" className="hover:text-white text-gray-300">FILMS</Link>
            <Link to="/lists" className="hover:text-white text-gray-300">LISTS</Link>
            <Link to="/members" className="hover:text-white text-gray-300">MEMBERS</Link>
            <Link to="/admin" className="hover:text-white text-gray-300">ADMIN</Link>
            
            <button className="text-gray-300 hover:text-white text-lg ml-2">
              ⚲
            </button>
            
            <button 
              className="bg-[#00e054] hover:bg-[#00c04b] text-white px-4 py-1.5 rounded flex items-center gap-2 ml-2 transition-colors font-bold"
              onClick={() => setIsLogOpen(true)}
            >
              + LOG
            </button>
          </div>
        </div>
      </header>
      <main className="app-container">
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
