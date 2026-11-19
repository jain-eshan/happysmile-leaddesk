import { BrowserRouter, NavLink, Route, Routes, Link } from 'react-router-dom';
import Overview from './pages/Overview';
import Patient from './pages/Patient';
import Desk from './pages/Desk';
import { Icon, ic } from './icons';
import { leads } from './data';

const needsYou = leads.filter((l) => l.status === 'needs_you').length;

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="shell">
        <aside className="sidebar">
          <Link to="/" className="brand" aria-label="HappySmile Lead Desk, overview">
            <span className="brand-mark" aria-hidden="true">
              H
            </span>
            <span>
              <span className="brand-name">HappySmile Lead Desk</span>
              <small>Concept on a Twenty2-style voice agent</small>
            </span>
          </Link>

          <div className="workspace">
            <span className="ws-dot" aria-hidden="true" />
            <div>
              <b>Gurugram pilot</b>
              <small>Sector 29 · Golf Course Rd</small>
            </div>
          </div>

          <nav className="side-nav" aria-label="Pages">
            <span className="nav-group">Case</span>
            <NavLink to="/" end>
              <Icon d={ic.dashboard} size={18} />
              <span>Overview</span>
            </NavLink>
            <span className="nav-group">Product</span>
            <NavLink to="/patient">
              <Icon d={ic.phoneDevice} size={18} />
              <span>Patient view</span>
              <small className="nav-hint">Screen 1</small>
            </NavLink>
            <NavLink to="/desk">
              <Icon d={ic.inbox} size={18} />
              <span>Front desk</span>
              <small className="nav-hint">Screen 2</small>
              <span className="nav-count" aria-label={`${needsYou} need you`}>
                {needsYou}
              </span>
            </NavLink>
          </nav>

          <div className="side-foot">
            <b>Twenty2 PM case</b>
            <span>Concept by Eshan Jain, ISB PGP 2027</span>
          </div>
        </aside>

        <div className="main">
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
        </div>
      </div>
    </BrowserRouter>
  );
}
