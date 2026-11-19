import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { scenarios } from '../data';
import type { PhoneView, Scenario, WaMessage } from '../data';

// Material icon paths, drawn inline so the phone views look like the real apps.
const ic = {
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  video: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
  call: 'M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z',
  callEnd: 'M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z',
  more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  reply: 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z',
  link: 'M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
  ticks: 'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z',
  smile: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
  clip: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
  camera: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z',
  mic: 'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
  check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
};

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

function Verified() {
  return (
    <span className="wa-verified" aria-label="Verified business">
      <Icon d={ic.check} size={10} />
    </span>
  );
}

// WhatsApp formatting: *bold* and the clinic's own links.
function waText(t: string): ReactNode[] {
  return t.split(/(\*[^*\n]+\*|happysmile\.in\/\S+)/g).map((p, i) =>
    p.length > 2 && p.startsWith('*') && p.endsWith('*') ? (
      <b key={i}>{p.slice(1, -1)}</b>
    ) : p.startsWith('happysmile.in/') ? (
      <span key={i} className="wa-link">
        {p}
      </span>
    ) : (
      p
    ),
  );
}

type WaGroup = { day: string; messages: WaMessage[] };
type WaItem = { kind: 'date'; label: string } | { kind: 'msg'; m: WaMessage; tail: boolean; quote?: string };

// One WhatsApp thread per journey: every WhatsApp step up to now, with date chips and tapped replies.
function waItems(thread: WaGroup[], today: string): WaItem[] {
  const items: WaItem[] = [];
  let lastDay = '';
  let lastFrom = '';
  const push = (m: WaMessage, quoted?: WaMessage) => {
    items.push({ kind: 'msg', m, tail: m.from !== lastFrom, quote: quoted?.text.split('\n')[0].replace(/\*/g, '') });
    lastFrom = m.from;
  };
  for (const g of thread) {
    if (g.day !== lastDay) {
      items.push({ kind: 'date', label: g.day === today ? 'Today' : g.day });
      lastDay = g.day;
      lastFrom = '';
    }
    g.messages.forEach((m, i) => {
      const prev = g.messages[i - 1];
      push(m, m.from === 'patient' && prev?.picked ? prev : undefined);
      if (m.picked && g.messages[i + 1]?.from !== 'patient') push({ from: 'patient', text: m.picked, time: m.time }, m);
    });
  }
  return items;
}

function WhatsApp({ thread, today }: { thread: WaGroup[]; today: string }) {
  const items = waItems(thread, today);
  return (
    <div className="wa">
      <div className="wa-head">
        <Icon d={ic.back} size={22} />
        <span className="wa-avatar" aria-hidden="true">
          H
        </span>
        <div className="wa-title">
          <b>
            <span className="wa-name">HappySmile Dental</span> <Verified />
          </b>
          <small>Business account</small>
        </div>
        <Icon d={ic.video} size={22} />
        <Icon d={ic.call} size={20} />
        <Icon d={ic.more} size={22} />
      </div>
      <div className="wa-body">
        {items.map((it, i) =>
          it.kind === 'date' ? (
            <div key={i} className="wa-chips">
              <span className="wa-date">{it.label}</span>
              {i === 0 && <span className="wa-notice">This business uses a secure service from Meta to manage this chat. Tap to learn more.</span>}
            </div>
          ) : (
            <div key={i} className={'wa-msg ' + (it.m.from === 'clinic' ? 'in' : 'out') + (it.tail ? ' tail' : '')}>
              <div className="wa-bubble">
                {it.quote && (
                  <div className="wa-quote">
                    <b>HappySmile Dental</b>
                    <span>{it.quote}</span>
                  </div>
                )}
                <div className="wa-text">{waText(it.m.text)}</div>
                {it.m.footer && <div className="wa-footer">{it.m.footer}</div>}
                <span className="wa-meta">
                  {it.m.time}
                  {it.m.from === 'patient' && (
                    <span className="wa-ticks" aria-label="Read">
                      <Icon d={ic.ticks} size={16} />
                    </span>
                  )}
                </span>
              </div>
              {it.m.buttons && (
                <div className="wa-qr">
                  {it.m.buttons.map((b) => (
                    <span key={b}>
                      <Icon d={/^Open/.test(b) ? ic.link : ic.reply} size={16} />
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>
      <div className="wa-input" aria-hidden="true">
        <div className="wa-field">
          <Icon d={ic.smile} size={22} />
          <span>Message</span>
          <Icon d={ic.clip} size={21} />
          <Icon d={ic.camera} size={21} />
        </div>
        <span className="wa-mic">
          <Icon d={ic.mic} size={22} />
        </span>
      </div>
    </div>
  );
}

function channelLabel(view: PhoneView): { name: string; meta: string } {
  switch (view.kind) {
    case 'form':
      return { name: 'happysmile.in', meta: 'Existing enquiry form' };
    case 'thanks':
      return { name: 'happysmile.in', meta: 'After you submit' };
    case 'whatsapp':
      return { name: 'WhatsApp', meta: 'Business chat' };
    case 'incoming':
      return { name: 'Phone', meta: 'Ringing' };
    case 'call':
      return { name: 'On a call', meta: 'Recorded for quality' };
  }
}

function Screen({ view, thread }: { view: PhoneView; thread: WaGroup[] }) {
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
      return <WhatsApp thread={thread} today={view.day ?? 'Today'} />;
    case 'incoming':
      return (
        <div className="incoming">
          <div>
            <div className="inc-label">Incoming call</div>
            <div className="big" aria-hidden="true">
              H
            </div>
            <h3>{view.label}</h3>
            <div className="inc-num tabular">{view.number}</div>
            <div className="verified">
              <Verified /> Verified business
            </div>
            <div className="reason">
              <small>Reason for call</small>
              {view.reason}
            </div>
          </div>
          <div className="call-btns" aria-hidden="true">
            <div>
              <span className="decline">
                <Icon d={ic.callEnd} size={28} />
              </span>
              Decline
            </div>
            <div>
              <span className="accept">
                <Icon d={ic.call} size={26} />
              </span>
              Answer
            </div>
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

function threadUpTo(sc: Scenario, idx: number): WaGroup[] {
  return sc.steps.slice(0, idx + 1).flatMap((st) => (st.phone.kind === 'whatsapp' ? [{ day: st.phone.day ?? 'Today', messages: st.phone.messages }] : []));
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
            <Screen view={step.phone} thread={threadUpTo(sc, idx)} />
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
              <span className="tag ok">Solves · {step.solves}</span>
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
