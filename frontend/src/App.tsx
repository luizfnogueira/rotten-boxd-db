import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <header className="topbar">
        <Link to="/" className="brand">
          <div className="brand-dots">
            <div className="dot orange"></div>
            <div className="dot green"></div>
            <div className="dot blue"></div>
          </div>
          RottenBoxd
        </Link>
        <div className="nav-links">
          <Link to="/">Filmes</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/admin" className="btn-log" style={{textDecoration: 'none'}}>+ Log</Link>
        </div>
      </header>
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
