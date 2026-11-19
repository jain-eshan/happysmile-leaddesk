import { useEffect, useState } from 'react';
import { scenarios } from '../data';
import type { PhoneView } from '../data';

function StatusBar({ time }: { time: string }) {
  return (
    <div className="statusbar">
      <span>{time}</span>
      <span>5G ▮▮▮</span>
    </div>
  );
}

function Screen({ view, time }: { view: PhoneView; time: string }) {
  switch (view.kind) {
    case 'form':
      return (
        <>
          <StatusBar time={view.time} />
          <div className="site">
            <div className="site-header">
              <span>HappySmile Dental</span>
              <small className="muted">happysmile.in</small>
            </div>
            <h3 style={{ marginBottom: 14 }}>Book a free consultation</h3>
            <div className="field">
              <label>Treatment</label>
              <div>{view.treatment}</div>
            </div>
            <div className="field">
              <label>Name</label>
              <div>{view.name}</div>
            </div>
            <div className="field">
              <label>Phone</label>
              <div>{view.phone}</div>
            </div>
            <div className="field">
              <label>Clinic</label>
              <div>{view.clinic}</div>
            </div>
            <div className="field">
              <label>Anything we should know?</label>
              <div>{view.note}</div>
            </div>
            <div className="consent">
              <i />
              <span>HappySmile may call and WhatsApp me about this enquiry, including through its AI assistant. Calls may be recorded.</span>
            </div>
            <button className="btn-full">Submit</button>
          </div>
        </>
      );
    case 'thanks':
      return (
        <>
          <StatusBar time={time} />
          <div className="thanks">
            <div className="site-header" style={{ marginBottom: 0 }}>
              <span>HappySmile Dental</span>
              <span className="tag green">Received</span>
            </div>
            <h3>Thanks. We will call you {view.eta}.</h3>
            <div className="caller-card">
              <div className="avatar">M</div>
              <div>
                <b>{view.agent} from HappySmile</b>
                <div className="muted" style={{ fontSize: 13 }}>
                  Calling from {view.number}
                </div>
              </div>
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              Not a good time? Choose what works for you.
            </div>
            {view.options.map((o) => (
              <div key={o} className={'opt' + (o === view.picked ? ' on' : '')}>
                {o}
              </div>
            ))}
            <div className="muted" style={{ fontSize: 11.5, marginTop: 'auto' }}>
              We will also send this on WhatsApp so you can save the number.
            </div>
          </div>
        </>
      );
    case 'whatsapp':
      return (
        <>
          <StatusBar time={view.messages[0]?.time ?? time} />
          <div className="wa-top">
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 15 }}>
              H
            </div>
            <div>
              <b>HappySmile Dental ✓</b>
              <small>Business account</small>
            </div>
          </div>
          <div className="wa-body">
            {view.messages.map((m, i) => (
              <div key={i} className={'bubble ' + m.from}>
                {m.text}
                <time>{m.time}</time>
                {m.buttons && (
                  <div className="wa-btns">
                    {m.buttons.map((b) => (
                      <span key={b} className={b === m.picked ? 'on' : ''}>
                        {b === m.picked ? '✓ ' : ''}
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      );
    case 'incoming':
      return (
        <>
          <div className="incoming">
            <div>
              <div className="big-avatar">H</div>
              <h3>{view.label}</h3>
              <div className="verified">✓ Verified business</div>
              <div className="reason">Call reason: {view.reason}</div>
            </div>
            <div className="call-btns">
              <span style={{ background: '#b42318' }}>Decline</span>
              <span style={{ background: '#16a34a' }}>Accept</span>
            </div>
          </div>
        </>
      );
    case 'call':
      return (
        <div className="call">
          <StatusBar time={time} />
          <div className="call-head">
            <b>{view.title}</b>
            <small>{view.duration} · recorded for quality</small>
            <div className="wave">
              {Array.from({ length: 14 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
              ))}
            </div>
          </div>
          <div className="transcript">
            {view.lines.map((l, i) => (
              <div key={i} className={'line ' + l.who}>
                {l.who !== 'system' && <div className="who">{l.who === 'agent' ? 'Meera (AI)' : l.name ?? 'Patient'}</div>}
                <div className="txt">{l.text}</div>
                {l.note && <div className="note">✓ {l.note}</div>}
              </div>
            ))}
          </div>
        </div>
      );
  }
}

export default function Patient() {
  const [sid, setSid] = useState(scenarios[0].id);
  const [idx, setIdx] = useState(0);
  const sc = scenarios.find((s) => s.id === sid)!;
  const step = sc.steps[idx];

  useEffect(() => setIdx(0), [sid]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, sc.steps.length - 1));
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sc.steps.length]);

  return (
    <main className="page">
      <div className="journey-head">
        <div>
          <div className="eyebrow">Screen 1 · The moment a person asks to be contacted</div>
          <h2 style={{ marginTop: 8 }}>What the patient sees</h2>
        </div>
        <div className="tabs">
          {scenarios.map((s) => (
            <button key={s.id} className={s.id === sid ? 'on' : ''} onClick={() => setSid(s.id)}>
              {s.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="card persona-bar">
        <b>{sc.persona}</b>
        <span className="tag dark">Playbook: {sc.playbook}</span>
        <p>{sc.summary}</p>
      </div>

      <div className="journey">
        <div>
          <div className="phone">
            <div className="notch" />
            <div className="screen">
              <Screen view={step.phone} time={step.at} />
            </div>
          </div>
          <div className="stepper">
            <button className="pill small white" onClick={() => setIdx(Math.max(idx - 1, 0))} disabled={idx === 0}>
              Back
            </button>
            <div className="dots">
              {sc.steps.map((s, i) => (
                <button key={s.label + i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} aria-label={s.label} />
              ))}
            </div>
            <button className="pill small" onClick={() => setIdx(Math.min(idx + 1, sc.steps.length - 1))} disabled={idx === sc.steps.length - 1}>
              Next
            </button>
          </div>
        </div>

        <div className="behind">
          <div className="card step-title">
            <div className="row">
              <span className="eyebrow">
                Step {idx + 1} of {sc.steps.length} · {step.at}
              </span>
              <span className="tag green">{step.solves}</span>
            </div>
            <h2>{step.label}</h2>
            <p>{step.why}</p>
          </div>
          <div className="card events">
            <div className="eyebrow">Behind the scenes</div>
            <ol>
              {step.events.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ol>
          </div>
          <div className="card timeline">
            <div className="eyebrow">This journey</div>
            <ol>
              {sc.steps.map((s, i) => (
                <li key={s.label + i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)}>
                  <span>{s.at}</span>
                  <b>{s.label}</b>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
