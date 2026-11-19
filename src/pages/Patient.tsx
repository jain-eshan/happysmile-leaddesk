import { useEffect, useState } from 'react';
import { scenarios } from '../data';
import type { PhoneView } from '../data';

function channelLabel(view: PhoneView): { name: string; meta: string } {
  switch (view.kind) {
    case 'form':
      return { name: 'happysmile.in', meta: 'Website enquiry form' };
    case 'thanks':
      return { name: 'happysmile.in', meta: 'After you submit' };
    case 'whatsapp':
      return { name: 'HappySmile Dental ✓', meta: 'WhatsApp business account' };
    case 'incoming':
      return { name: 'Incoming call', meta: 'Phone' };
    case 'call':
      return { name: 'On a call', meta: 'Recorded for quality' };
  }
}

function Screen({ view }: { view: PhoneView }) {
  switch (view.kind) {
    case 'form':
      return (
        <div className="site">
          <h3>Book a free consultation</h3>
          {(
            [
              ['Treatment', view.treatment],
              ['Name', view.name],
              ['Phone', view.phone],
              ['Clinic', view.clinic],
              ['Anything we should know?', view.note],
            ] as const
          ).map(([k, v]) => (
            <div className="field" key={k}>
              <span className="k">{k}</span>
              <div className="v">{v}</div>
            </div>
          ))}
          <div className="consent">
            <i aria-hidden="true">✓</i>
            <span>HappySmile may call and WhatsApp me about this enquiry, including through its AI assistant. Calls may be recorded.</span>
          </div>
          <div className="fake-btn">Request a call back</div>
        </div>
      );
    case 'thanks':
      return (
        <div className="thanks">
          <span className="tag ok" style={{ alignSelf: 'flex-start' }}>
            <span className="dot" aria-hidden="true" /> Enquiry received
          </span>
          <h3>We’ll call you {view.eta}.</h3>
          <div className="caller-card">
            <div className="avatar" aria-hidden="true">
              M
            </div>
            <div>
              <b>{view.agent} from HappySmile</b>
              <div className="muted" style={{ fontSize: 13 }}>
                Calling from <span className="tabular">{view.number}</span>
              </div>
            </div>
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Not a good time? Choose what works for you.
          </div>
          {view.options.map((o) => (
            <div key={o} className={'opt' + (o === view.picked ? ' on' : '')}>
              {o === view.picked ? '✓ ' : ''}
              {o}
            </div>
          ))}
          <div className="muted" style={{ fontSize: 12, marginTop: 'auto' }}>
            We’ll also send this on WhatsApp so you can save the number.
          </div>
        </div>
      );
    case 'whatsapp':
      return (
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
      );
    case 'incoming':
      return (
        <div className="incoming">
          <div>
            <div className="big" aria-hidden="true">
              H
            </div>
            <h3>{view.label}</h3>
            <div className="verified">✓ Verified business</div>
            <div className="reason">Call reason: {view.reason}</div>
          </div>
          <div className="call-btns" aria-hidden="true">
            <span style={{ background: '#b42318' }}>Decline</span>
            <span style={{ background: '#15803d' }}>Accept</span>
          </div>
        </div>
      );
    case 'call':
      return (
        <div className="call">
          <div className="call-head">
            <b>{view.title}</b>
            <small className="tabular">{view.duration}</small>
            <div className="wave" aria-hidden="true">
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
  const last = sc.steps.length - 1;
  const step = sc.steps[Math.min(idx, last)];
  const ch = channelLabel(step.phone);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, last));
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last]);

  return (
    <main className="page" id="main">
      <div className="screen-head">
        <div>
          <span className="tag accent">Screen 1 · The moment someone asks to be contacted</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 14 }}>What the patient sees</h1>
          <p>Pick a patient, then step through what reaches their phone and what the system does behind it.</p>
        </div>
      </div>

      <div className="chips" role="group" aria-label="Choose a patient journey" style={{ marginBottom: 16 }}>
        {scenarios.map((s) => (
          <button key={s.id} className="chip" aria-pressed={s.id === sid} onClick={() => {
              setSid(s.id);
              setIdx(0);
            }}>
            {s.tab}
          </button>
        ))}
      </div>

      <div className="card persona-bar">
        <b>{sc.persona}</b>
        <span className="tag dark">Playbook: {sc.playbook}</span>
        <p>{sc.summary}</p>
      </div>

      <div className="journey">
        <section className="stage" aria-label="Patient's phone">
          <div className="device">
            <div className="channel">
              <b>{ch.name}</b>
              <span>{ch.meta}</span>
              <span className="tabular">{step.at}</span>
            </div>
            <Screen view={step.phone} />
          </div>
          <div className="stage-note">
            <span className="ok-mark" aria-hidden="true">
              ✓
            </span>
            <span>{step.solves}</span>
          </div>
          <div className="stage-nav">
            <button className="btn light sm" onClick={() => setIdx(Math.max(idx - 1, 0))} disabled={idx === 0}>
              Previous step
            </button>
            <span className="tabular" aria-live="polite">
              {idx + 1} / {sc.steps.length}
            </span>
            <button className="btn sm" onClick={() => setIdx(Math.min(idx + 1, last))} disabled={idx === last}>
              Next step
            </button>
          </div>
        </section>

        <div className="side">
          <div className="card step-card">
            <div className="row">
              <span className="eyebrow tabular">
                Step {idx + 1} of {sc.steps.length} · {step.at}
              </span>
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

          <nav className="card steps" aria-label="Steps in this journey">
            <div className="eyebrow">This journey</div>
            <ol>
              {sc.steps.map((s, i) => (
                <li key={s.label + i}>
                  <button
                    className="step-btn"
                    aria-current={i === idx ? 'step' : undefined}
                    data-state={i < idx ? 'done' : i === idx ? 'current' : 'todo'}
                    onClick={() => setIdx(i)}
                  >
                    <span className="circle">{i < idx ? '✓' : i + 1}</span>
                    <span className="step-name">{s.label}</span>
                    <span className="step-time">{s.at}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </main>
  );
}
