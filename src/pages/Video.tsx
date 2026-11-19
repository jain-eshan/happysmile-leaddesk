import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, ic } from '../icons';

// The web copy of the walkthrough lives in public/media (added once the final cut is ready).
const SRC = '/media/lead-desk-demo.mp4';
const POSTER = '/media/lead-desk-demo.jpg';
const PAGE = 'https://happysmile-leaddesk.vercel.app/video';

export function DemoPlayer() {
  return (
    <video className="player" controls preload="metadata" playsInline poster={POSTER}>
      <source src={SRC} type="video/mp4" />
      Your browser cannot play this video. <a href={SRC}>Download it instead</a>.
    </video>
  );
}

export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link', PAGE);
    }
  };
  return (
    <>
      <button className="btn" onClick={copy} aria-live="polite">
        <Icon d={copied ? ic.check : ic.copy} size={16} />
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <a className="btn" href={'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(PAGE)} target="_blank" rel="noreferrer">
        <Icon d={ic.link} size={16} />
        Share on LinkedIn
      </a>
    </>
  );
}

export default function Video() {
  return (
    <main className="page" id="main">
      <header className="page-head">
        <div>
          <p className="crumb">Twenty2 PM case · HappySmile Dental</p>
          <h1>Demo video</h1>
          <p className="sub">The problem, four patient journeys and the front desk, in one walkthrough with voice and captions.</p>
        </div>
        <div className="head-actions">
          <ShareButtons />
        </div>
      </header>

      <section className="card video-card" aria-label="Walkthrough video">
        <DemoPlayer />
      </section>

      <section className="next-row" aria-label="Try the prototype yourself">
        <Link to="/patient" className="card next-link">
          <span className="stat-icon">
            <Icon d={ic.phoneDevice} size={18} />
          </span>
          <span>
            <b>Screen 1 · Patient view</b>
            <small>Step through the four patients yourself</small>
          </span>
          <Icon d={ic.arrowRight} size={18} />
        </Link>
        <Link to="/desk" className="card next-link">
          <span className="stat-icon">
            <Icon d={ic.inbox} size={18} />
          </span>
          <span>
            <b>Screen 2 · Front desk</b>
            <small>Open the queue, the handoffs and the experiment</small>
          </span>
          <Icon d={ic.arrowRight} size={18} />
        </Link>
      </section>
    </main>
  );
}
