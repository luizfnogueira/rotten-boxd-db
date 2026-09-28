import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#333', color: 'white' }}>
        <Link to="/" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>Catálogo</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Gerenciamento</Link>
      </nav>
      <main style={{ padding: '2rem' }}>
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
