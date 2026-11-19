import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { scenarios } from '../data';
import type { PhoneView, Scenario, WaMessage } from '../data';
import { Icon, ic, initials } from '../icons';

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

function channelLabel(view: PhoneView): { icon: string; name: string } {
  switch (view.kind) {
    case 'form':
      return { icon: ic.dashboard, name: 'HappySmile website' };
    case 'thanks':
      return { icon: ic.dashboard, name: 'HappySmile website' };
    case 'whatsapp':
      return { icon: ic.chat, name: 'WhatsApp' };
    case 'incoming':
      return { icon: ic.call, name: 'Phone, ringing' };
    case 'call':
      return { icon: ic.call, name: 'Phone, on a call' };
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
          <span className="pill ok" style={{ alignSelf: 'flex-start' }}>
            Enquiry received
          </span>
          <h3>We’ll call you {view.eta}.</h3>
          <div className="caller-card">
            <div className="avatar" aria-hidden="true">
              M
            </div>
            <div>
              <b>{view.agent} from HappySmile</b>
              <div className="muted">
                Calling from <span className="tabular">{view.number}</span>
              </div>
            </div>
          </div>
          <div className="muted">Not a good time? Choose what works for you.</div>
          {view.options.map((o) => (
            <div key={o} className={'opt' + (o === view.picked ? ' on' : '')}>
              {o === view.picked ? '✓ ' : ''}
              {o}
            </div>
          ))}
          <div className="muted small" style={{ marginTop: 'auto' }}>
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

// "1:12:04  Enquiry received" -> time and text. Lines without a time keep the whole text.
function splitEvent(e: string) {
  const m = e.match(/^(.+?)\s{2,}(.+)$/);
  return m ? { t: m[1], x: m[2] } : { t: '', x: e };
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
      <header className="page-head">
        <div>
          <p className="crumb">Screen 1 · The moment someone asks to be contacted</p>
          <h1>Patient view</h1>
          <p className="sub">Pick a patient, then step through what reaches their phone and what the system does behind it.</p>
        </div>
      </header>

      <div className="tabs" role="group" aria-label="Choose a patient">
        {scenarios.map((s) => (
          <button
            key={s.id}
            className="tab"
            aria-pressed={s.id === sid}
            onClick={() => {
              setSid(s.id);
              setIdx(0);
            }}
          >
            {s.tab}
          </button>
        ))}
      </div>

      <section className="card persona" aria-label="Patient">
        <span className="avatar lg" aria-hidden="true">
          {initials(sc.persona)}
        </span>
        <div>
          <b>{sc.persona}</b>
          <p>{sc.summary}</p>
        </div>
        <span className="pill accent">Playbook: {sc.playbook}</span>
      </section>

      <div className="journey">
        <nav className="card steps" aria-label="Steps in this journey">
          <div className="card-h">
            <h2>Journey</h2>
            <span className="muted tabular">
              {idx + 1} of {sc.steps.length}
            </span>
          </div>
          <ol>
            {sc.steps.map((s, i) => (
              <li key={s.label + i}>
                <button
                  className="step-btn"
                  aria-current={i === idx ? 'step' : undefined}
                  data-state={i < idx ? 'done' : i === idx ? 'current' : 'todo'}
                  onClick={() => setIdx(i)}
                >
                  <span className="circle">{i < idx ? <Icon d={ic.check} size={14} /> : i + 1}</span>
                  <span className="step-name">{s.label}</span>
                  <span className="step-time tabular">{s.at}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="step-nav">
            <button className="btn" onClick={() => setIdx(Math.max(idx - 1, 0))} disabled={idx === 0}>
              <Icon d={ic.chevronLeft} size={18} />
              Previous
            </button>
            <button className="btn primary" onClick={() => setIdx(Math.min(idx + 1, last))} disabled={idx === last}>
              Next step
              <Icon d={ic.chevronRight} size={18} />
            </button>
          </div>
          <p className="hint">Or use the left and right arrow keys.</p>
        </nav>

        <section className="stage" aria-label="What the patient sees on their phone">
          <div className="stage-label">
            <Icon d={ch.icon} size={16} />
            {ch.name}
            <span className="tabular">{step.at}</span>
          </div>
          <div className="device">
            <Screen view={step.phone} thread={threadUpTo(sc, idx)} />
          </div>
        </section>

        <section className="card step-card" aria-live="polite">
            <span className="crumb tabular">
              Step {idx + 1} of {sc.steps.length} · {step.at}
            </span>
            <h2>{step.label}</h2>
            <p>{step.why}</p>
            <div className="solves">
              <Icon d={ic.checkCircle} size={16} />
              <span>
                <b>Solves:</b> {step.solves}
              </span>
            </div>
          </section>

          <section className="card sys-card" aria-labelledby="sys-h">
            <div className="card-h">
              <h2 id="sys-h">What the system did</h2>
            </div>
            <ul className="events">
              {step.events.map((e) => {
                const { t, x } = splitEvent(e);
                return (
                  <li key={e}>
                    <Icon d={ic.checkCircle} size={16} />
                    <span>{x}</span>
                    {t && <time className="tabular">{t}</time>}
                  </li>
                );
              })}
            </ul>
          </section>
      </div>
    </main>
  );
}
