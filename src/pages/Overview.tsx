import { Link } from 'react-router-dom';

const flow = [
  { t: 'Enquiry lands', d: 'Form, Meta ad or Google lead. Capture stays as it is. Returning patients are matched by phone.' },
  { t: 'Heads-up first', d: 'A WhatsApp from HappySmile names the caller and the number, and lets the patient pick a time.' },
  { t: 'Call in 5 minutes', d: 'Within calling hours, from a declared branded number. After 9 pm: WhatsApp now, call at the chosen time.' },
  { t: 'Useful, unhurried call', d: 'A playbook per treatment. Approved price bands and EMI. Two real slots at the nearest branches.' },
  { t: 'Handoff or booking', d: 'Routine consults get booked. Implant, clinical and price questions go to the front desk with a summary.' },
];

const personas = [
  { n: 'Aligners · 22 to 32', w: 'Decides and pays, often on EMI', k: 'Ignores unknown numbers at work. Wants price and evening slots.' },
  { n: 'Implants · 50+', w: 'Adult child researches and pays', k: 'Decider not on the call. Surprise extras like the 3D scan.' },
  { n: 'Tooth pain', w: 'Self, today', k: 'Any delay. The nearest local dentist sees them first.' },
  { n: 'Teen braces', w: 'Both parents', k: 'School and office hours. The other parent is not in the loop.' },
  { n: 'Wedding smile', w: 'Patient and family', k: 'Slow first contact when intent peaks. A fixed date.' },
  { n: 'Cleaning', w: 'Self, price-shopping', k: 'Calls feel like spam. Highest no-show risk. WhatsApp only.' },
];

export default function Overview() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <div className="eyebrow">Twenty2 PM case · HappySmile Dental</div>
          <h1 style={{ marginTop: 14 }}>Every enquiry gets a trusted, useful conversation in 5 minutes.</h1>
          <p className="hero-lead">
            HappySmile pays for about 300 enquiries a day across 12 clinics. The front desk calls back 4 to 6 hours later and 30% book.
            Lead Desk is an AI first responder plus a front-desk queue: the agent makes first contact and books routine consults, and the team
            closes the high-value ones with full context.
          </p>
          <div className="hero-actions">
            <Link to="/patient" className="pill">
              Screen 1 · What the patient sees
            </Link>
            <Link to="/desk" className="pill ghost">
              Screen 2 · What HappySmile sees
            </Link>
          </div>
        </div>
        <div className="stat-stack">
          <div className="card stat">
            <b>300</b>
            <span>enquiries a day, at roughly ₹100 to ₹300 each in ad spend</span>
          </div>
          <div className="card stat">
            <b>4 to 6 h</b>
            <span>before the front desk calls back, after walk-ins and billing</span>
          </div>
          <div className="card stat">
            <b>30%</b>
            <span>book today. About 210 paid enquiries a day do not</span>
          </div>
          <div className="card stat">
            <b>79%</b>
            <span>of Indians avoid business calls from unknown numbers (Truecaller x TTBS, 2026)</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>How it works</h2>
          <p>Speed alone does not convert. The call has to be answered, trusted and useful, and someone has to own the lead afterwards.</p>
        </div>
        <div className="flow">
          {flow.map((f, i) => (
            <div className="card" key={f.t}>
              <div className="num">0{i + 1}</div>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Who is on the other end</h2>
          <p>Each treatment brings a different person, a different decider and a different reason to drop off. The agent runs a playbook per treatment, not one script.</p>
        </div>
        <div className="persona-grid">
          {personas.map((p) => (
            <div className="card persona" key={p.n}>
              <h3>{p.n}</h3>
              <dl>
                <dt>Who decides</dt>
                <dd>{p.w}</dd>
                <dt>What loses the lead</dt>
                <dd>{p.k}</dd>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>The first 4 weeks</h2>
          <p>Two pilot clinics in Gurugram. 20% of enquiries stay on today's process so the lift is measured, not assumed.</p>
        </div>
        <div className="two-col">
          <div className="card list-card">
            <h3>Shipping</h3>
            <ul>
              <li>WhatsApp heads-up, then a call within 5 minutes in calling hours</li>
              <li>Hindi, English and Hinglish; returning patients recognised</li>
              <li>Playbooks: aligners and braces, implants, tooth pain. Cleaning on WhatsApp only</li>
              <li>Clinic-approved price bands and EMI; never medical advice</li>
              <li>Two slots across nearby branches, on the right specialist's days</li>
              <li>Reply-to-confirm on WhatsApp, reminders, at-risk flags</li>
              <li>Front-desk queue with summaries and credit to the coordinator</li>
            </ul>
          </div>
          <div className="card list-card">
            <h3>Not doing yet</h3>
            <ul>
              <li>A general workflow builder (rules live in one settings panel)</li>
              <li>Personas guessed from age or gender</li>
              <li>All 12 clinics, inbound calls, payments</li>
              <li>Writing back to patient records</li>
            </ul>
            <h3 style={{ marginTop: 22 }}>How we measure it</h3>
            <ul>
              <li>
                <b>Success:</b> consults that actually happened per 100 enquiries, against the control group
              </li>
              <li>
                <b>Ignored on purpose:</b> share of calls the AI completes alone. Chasing it cuts the handoffs that close implant leads
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Three people, three answers</h2>
        </div>
        <div className="three-col">
          <div className="card stake">
            <div className="eyebrow">Operations head</div>
            <div className="quote">"Leads we call within 5 minutes convert 3x better."</div>
            <p>Agreed on speed. But 3x on a 30% base would be 90%, so part of it is which leads got called fast. The control group measures the real effect.</p>
          </div>
          <div className="card stake">
            <div className="eyebrow">Founder</div>
            <div className="quote">"It should sound so human nobody realises."</div>
            <p>Agreed on the goal: a call that feels like his own team. We get there with fast replies and natural Hinglish. The agent never denies being AI when asked, and we test upfront disclosure.</p>
          </div>
          <div className="card stake">
            <div className="eyebrow">Front-desk lead</div>
            <div className="quote">"Every lead should still go to my team."</div>
            <p>The wait is the leak, so leads cannot wait. But her team owns the patient: every lead in her queue, the high-value ones handed over with context, bookings credited to her coordinators.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>
            The two screens
          </div>
          <h2 style={{ marginTop: 8 }}>Walk through four real patient journeys, then see the front desk's day.</h2>
        </div>
        <div className="hero-actions" style={{ marginTop: 0 }}>
          <Link to="/patient" className="pill">
            Open screen 1
          </Link>
          <Link to="/desk" className="pill ghost">
            Open screen 2
          </Link>
        </div>
      </section>
    </main>
  );
}
