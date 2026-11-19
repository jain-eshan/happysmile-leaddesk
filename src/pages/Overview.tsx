import { Link } from 'react-router-dom';
import { Icon, ic } from '../icons';

const stats = [
  { icon: ic.inbox, v: '300', l: 'Enquiries a day', s: '₹100 to ₹300 each in ad spend' },
  { icon: ic.clock, v: '4 to 6 h', l: 'Until the front desk calls back', s: 'After walk-ins and billing' },
  { icon: ic.calendar, v: '30%', l: 'Book a consult today', s: 'About 210 paid enquiries a day do not book' },
  { icon: ic.call, v: '79%', l: 'Ignore calls from unknown business numbers', s: 'Truecaller x TTBS, July 2026' },
];

const flow = [
  { t: 'Enquiry lands', d: 'Website form, Meta or Google lead form, unchanged. Returning patients matched by phone.' },
  { t: 'Heads-up first', d: 'A WhatsApp names the caller and number, discloses the AI, and lets the patient pick a time.' },
  { t: 'Call in 5 minutes', d: 'Inside 9 am to 9 pm, from a declared number. After hours: WhatsApp now, call at the chosen time.' },
  { t: 'Useful call', d: 'A playbook per treatment, approved price bands and EMI, two real slots at nearby branches.' },
  { t: 'Booked or handed over', d: 'Routine consults get booked. Implant, clinical and price questions go to the front desk with a summary.' },
];

const personas = [
  { n: 'Aligners', a: '22 to 32', w: 'Self, often on EMI', k: 'Ignores unknown numbers at work; wants price and evening slots', h: 'Heads-up, call at her chosen time, price band and EMI', s: 'Live', tone: 'ok' },
  { n: 'Implants', a: '50+', w: 'Adult child researches and pays', k: 'Decider not on the call; surprise extras like the 3D scan', h: 'Scan cost said upfront, family summary, human closes', s: 'Live', tone: 'ok' },
  { n: 'Tooth pain', a: '', w: 'Self, today', k: 'Any delay; the nearest local dentist sees them first', h: 'Book first, ask later: two earliest slots nearby', s: 'Live', tone: 'ok' },
  { n: 'Teen braces', a: '', w: 'Both parents', k: 'School and office hours; other parent not in the loop', h: 'Weekend slots, summary to forward', s: 'Live', tone: 'ok' },
  { n: 'Wedding smile', a: '', w: 'Patient and family', k: 'Slow first contact; a fixed date', h: 'Date-backwards plan', s: 'Next phase', tone: 'grey' },
  { n: 'Cleaning', a: '', w: 'Self, price-shopping', k: 'Calls feel like spam', h: 'WhatsApp only, no call', s: 'WhatsApp only', tone: 'info' },
];

const stakeholders = [
  {
    who: 'Operations head',
    q: 'Leads we call within 5 minutes convert 3x better. So call everyone faster.',
    a: 'Agreed on speed. But 3x on a 30% base would be 90%, so part of the 3x is which leads got called fast. A 20% control group measures the real effect.',
  },
  {
    who: 'Founder',
    q: 'The AI should sound so human that nobody realises it is AI.',
    a: 'Agreed on the goal: a call that feels like his own team, through fast replies and natural Hinglish. The agent never denies being AI when asked, and we test saying it upfront.',
  },
  {
    who: 'Front-desk lead',
    q: 'Every lead should still go to my team. I do not trust a bot with patients.',
    a: 'Leads cannot wait for her team, because the wait is the leak. But her team owns the patient: every lead in her queue, high-value ones handed over with context, bookings credited to her coordinators.',
  },
];

export default function Overview() {
  return (
    <main className="page" id="main">
      <header className="page-head">
        <div>
          <p className="crumb">Twenty2 PM case · HappySmile Dental</p>
          <h1>Overview</h1>
          <p className="sub">An AI first responder plus a front-desk queue, for a 12-clinic dental chain.</p>
        </div>
        <div className="head-actions">
          <Link to="/patient" className="btn">
            Open patient view
          </Link>
          <Link to="/desk" className="btn primary">
            Open front desk
          </Link>
        </div>
      </header>

      <section className="card thesis" aria-labelledby="thesis-h">
        <div>
          <span className="label">The bet</span>
          <h2 id="thesis-h">Every enquiry gets a trusted, useful conversation in 5 minutes.</h2>
        </div>
        <p>
          HappySmile pays for about 300 enquiries a day. The front desk calls back 4 to 6 hours later and 30% book. Speed alone will not fix
          it: the call has to be answered, trusted and useful, and someone has to own the lead afterwards.
        </p>
      </section>

      <section className="stat-grid" aria-label="The problem in numbers">
        {stats.map((s) => (
          <div className="card stat" key={s.l}>
            <span className="stat-icon">
              <Icon d={s.icon} size={18} />
            </span>
            <span className="stat-l">{s.l}</span>
            <b className="stat-v">{s.v}</b>
            <span className="stat-s">{s.s}</span>
          </div>
        ))}
      </section>

      <section className="card" aria-labelledby="flow-h">
        <div className="card-h">
          <h2 id="flow-h">How it works</h2>
          <span className="muted">From form to booking</span>
        </div>
        <ol className="flow">
          {flow.map((f, i) => (
            <li key={f.t}>
              <span className="flow-n">{i + 1}</span>
              <b>{f.t}</b>
              <p>{f.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card" aria-labelledby="who-h">
        <div className="card-h">
          <h2 id="who-h">Who is on the other end</h2>
          <span className="muted">One playbook per treatment, not one script</span>
        </div>
        <div className="table-wrap">
          <table className="table stack">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Who decides</th>
                <th>What loses the lead</th>
                <th>What Lead Desk does</th>
                <th>Pilot</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((p) => (
                <tr key={p.n}>
                  <td>
                    <b>{p.n}</b>
                    {p.a && <span className="cell-sub">{p.a}</span>}
                  </td>
                  <td data-label="Who decides">{p.w}</td>
                  <td data-label="What loses the lead">{p.k}</td>
                  <td data-label="What Lead Desk does">{p.h}</td>
                  <td>
                    <span className={'pill ' + p.tone}>{p.s}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid-3" aria-label="The first 4 weeks">
        <div className="card">
          <div className="card-h">
            <h2>Shipping in 4 weeks</h2>
          </div>
          <p className="card-note">Two pilot clinics in Gurugram: Sector 29 and Golf Course Road.</p>
          <ul className="checks">
            {[
              'WhatsApp heads-up, then a call within 5 minutes',
              'Hindi, English and Hinglish; returning patients recognised',
              'Playbooks: aligners and braces, implants, tooth pain',
              'Clinic-approved price bands and EMI, never medical advice',
              'Two real slots across nearby branches',
              'Reply-to-confirm, reminders, at-risk flags',
              'Front-desk queue with summaries and coordinator credit',
              'TRAI A2P declaration and a 20% control group',
            ].map((t) => (
              <li key={t}>
                <Icon d={ic.checkCircle} size={16} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-h">
            <h2>Not doing yet</h2>
          </div>
          <ul className="checks no">
            {[
              'A general workflow builder (rules live in one settings panel)',
              'Personas guessed from age or gender',
              'All 12 clinics',
              'Inbound calls',
              'Payments',
              'Writing back to patient records',
            ].map((t) => (
              <li key={t}>
                <Icon d={ic.block} size={16} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-h">
            <h2>How we measure it</h2>
          </div>
          <div className="metric-box ok">
            <span className="label">Success metric</span>
            <b>Consults that actually happened per 100 enquiries</b>
            <span>AI-first group against the control group</span>
          </div>
          <div className="metric-box">
            <span className="label">Ignored on purpose</span>
            <b>Share of calls the AI completes without a human</b>
            <span>Chasing it would cut the handoffs that close implant leads</span>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="stake-h">
        <div className="card-h">
          <h2 id="stake-h">Three people, three answers</h2>
        </div>
        <div className="stake-grid">
          {stakeholders.map((s) => (
            <div className="stake" key={s.who}>
              <span className="label">{s.who}</span>
              <blockquote>“{s.q}”</blockquote>
              <p>
                <b>Our answer: </b>
                {s.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="next-row" aria-label="Open the two screens">
        <Link to="/patient" className="card next-link">
          <span className="stat-icon">
            <Icon d={ic.phoneDevice} size={18} />
          </span>
          <span>
            <b>Screen 1 · Patient view</b>
            <small>Four patients, step by step, from form to booking</small>
          </span>
          <Icon d={ic.arrowRight} size={18} />
        </Link>
        <Link to="/desk" className="card next-link">
          <span className="stat-icon">
            <Icon d={ic.inbox} size={18} />
          </span>
          <span>
            <b>Screen 2 · Front desk</b>
            <small>The queue, the handoffs and the experiment</small>
          </span>
          <Icon d={ic.arrowRight} size={18} />
        </Link>
      </section>
    </main>
  );
}
