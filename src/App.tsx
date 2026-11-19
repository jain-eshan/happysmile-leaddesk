import { BrowserRouter, NavLink, Route, Routes, Link } from 'react-router-dom';
import Overview from './pages/Overview';
import Patient from './pages/Patient';
import Desk from './pages/Desk';

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="HappySmile Lead Desk, overview">
            <span className="brand-mark" aria-hidden="true">
              H
            </span>
            <span>
              <span className="brand-name">HappySmile Lead Desk</span>
              <small>Concept on a Twenty2-style voice agent</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Screens">
            <NavLink to="/" end>
              Overview
            </NavLink>
            <NavLink to="/patient">1 · Patient</NavLink>
            <NavLink to="/desk">2 · Front desk</NavLink>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/desk" element={<Desk />} />
        <Route path="*" element={<Overview />} />
      </Routes>
      <footer className="disclaimer">
        Concept prototype by Eshan Jain (ISB PGP 2027) for the Twenty2 Product Manager case. HappySmile is fictional and all data is
        illustrative. Not an official Twenty2 or Shiprocket product. Price bands are modelled on public list prices from Indian dental
        chains.
      </footer>
    </BrowserRouter>
  );
}
