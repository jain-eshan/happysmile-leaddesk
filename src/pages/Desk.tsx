import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { experiment, kpis, leads, priceBands, statusMeta } from '../data';
import type { Lead, LeadStatus } from '../data';
import { Icon, ic, initials } from '../icons';

type Filter = 'all' | LeadStatus;
type Clinic = 'All' | 'Sector 29' | 'Golf Course Rd';

const filters: { id: Filter; label: string }[] = [
  { id: 'needs_you', label: 'Needs you' },
  { id: 'at_risk', label: 'At risk' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'no_answer', label: 'No answer' },
  { id: 'booked', label: 'Booked' },
  { id: 'all', label: 'All' },
];

const matches = (l: Lead, f: Filter) => f === 'all' || l.status === f || (f === 'booked' && l.status === 'whatsapp_only');

function Rules({ onClose }: { onClose: () => void }) {
  const [rules, setRules] = useState<Record<string, boolean>>({
    clinical: true,
    price: true,
    implants: true,
    human: true,
    confused: true,
    disclosureTest: true,
    cleaningWa: true,
    teenParent: true,
    aligners: true,
    implantsPb: true,
    pain: true,
  });
  const flip = (k: string) => setRules((r) => ({ ...r, [k]: !r[k] }));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const row = (k: string, label: string, note?: string) => (
    <div className="toggle-row" key={k}>
      <span id={'lbl-' + k}>
        {label}
        {note && <small className="row-note">{note}</small>}
      </span>
      <button className="switch" role="switch" aria-checked={note ? false : rules[k]} aria-labelledby={'lbl-' + k} disabled={!!note} onClick={() => flip(k)} />
    </div>
  );
  const fixed = (label: string, value: ReactNode) => (
    <div className="toggle-row">
      <span>{label}</span>
      {value}
    </div>
  );
  return (
    <>
      <button className="drawer-bg" aria-label="Close rules" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="rules-h">
        <div className="drawer-head">
          <div>
            <p className="crumb">Owned by the front-desk lead</p>
            <h2 id="rules-h">Rules</h2>
          </div>
          <button className="icon-btn" onClick={onClose} autoFocus aria-label="Close rules">
            <Icon d={ic.close} size={20} />
          </button>
        </div>
        <p className="muted">No workflow builder in the pilot. These are the only settings, and the front-desk lead signs them off.</p>

        <section className="rule">
          <h3>Calling hours</h3>
          {fixed('Call window', <b>9:00 am to 9:00 pm</b>)}
          {fixed('Outside the window', <b>WhatsApp now, call at chosen time</b>)}
          {fixed('Attempts before stopping', <b>3 calls over 24 h</b>)}
        </section>

        <section className="rule">
          <h3>Hand to the front desk when</h3>
          {row('clinical', 'Patient asks a clinical question')}
          {row('price', 'Patient negotiates on price')}
          {row('implants', 'Implant or full-arch lead (a person closes)')}
          {row('human', 'Patient asks for a person')}
          {row('confused', 'Agent misunderstands twice')}
        </section>

        <section className="rule">
          <h3>Playbooks</h3>
          {row('aligners', 'Aligners and braces')}
          {row('implantsPb', 'Implants (a person closes)')}
          {row('pain', 'Tooth pain (book first, ask later)')}
          {row('teenParent', 'Teen braces: invite both parents, prefer weekends')}
          {row('cleaningWa', 'Cleaning: WhatsApp only, no call')}
          {row('wedding', 'Wedding smile (date-bound)', 'Next phase, not in the pilot')}
        </section>

        <section className="rule">
          <h3>AI disclosure</h3>
          {fixed('Never deny being AI when asked', <span className="pill accent">Always on</span>)}
          {row('disclosureTest', 'Test: say it upfront on 50% of calls')}
        </section>

        <section className="rule">
          <h3>Approved price bands</h3>
          <p className="muted small">The agent may only say these.</p>
          <div className="table-wrap">
            <table className="table compact">
              <thead>
                <tr>
                  <th>Treatment</th>
                  <th>Band</th>
                  <th>Extras said upfront</th>
                  <th>EMI</th>
                </tr>
              </thead>
              <tbody>
                {priceBands.map((p) => (
                  <tr key={p.treatment}>
                    <td>{p.treatment}</td>
                    <td className="tabular">{p.band}</td>
                    <td className="muted">{p.extras}</td>
                    <td>{p.emi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted small">Final price always after the exam. Signed off by the clinical lead.</p>
        </section>
      </aside>
    </>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="fact">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function Detail({ lead }: { lead: Lead }) {
  const s = statusMeta[lead.status];
  return (
    <section className="card detail" id="lead-detail" aria-label={'Lead ' + lead.name}>
      <div className="detail-top">
        <span className="avatar lg" aria-hidden="true">
          {initials(lead.name)}
        </span>
        <div className="detail-id">
          <div className="pills">
            <span className={'pill ' + s.tone}>{s.label}</span>
            <span className="pill grey">{lead.group}</span>
            <span className="muted small tabular">{lead.id}</span>
          </div>
          <h2>{lead.name}</h2>
          <p className="muted small">
            {lead.treatment} · {lead.clinic} · {lead.source} · enquired {lead.enquired}
          </p>
        </div>
      </div>
      <div className="detail-actions">
        <button className="btn primary">
          <Icon d={ic.call} size={16} />
          Call {lead.name.match(/via \w+ (\w+)\)/)?.[1] ?? lead.name.split(' ')[0]}
        </button>
        <button className="btn">
          <Icon d={ic.chat} size={16} />
          Send WhatsApp
        </button>
        <button className="btn">
          <Icon d={ic.check} size={16} />
          Mark as handled
        </button>
      </div>

      <div className="next-box">
        <Icon d={ic.bolt} size={18} />
        <div>
          <span className="label">Next best action · {lead.reason}</span>
          <p>{lead.next}</p>
        </div>
      </div>

      <dl className="facts">
        <Fact k="Decider" v={lead.decider} />
        <Fact k="Main worry" v={lead.worry} />
        <Fact k="Value" v={lead.value} />
        <Fact k="First contact" v={lead.firstContact} />
        <Fact k="Booking" v={lead.slot ?? 'Not booked'} />
        <Fact k="Credited to" v={lead.credited} />
      </dl>

      <div className="summary">
        <span className="label">What the patient already told us</span>
        <p>{lead.summary}</p>
        <p className="muted small">Language: {lead.language}. Open with this so the patient never repeats themselves.</p>
      </div>

      {lead.transcript.length > 0 && (
        <div className="summary">
          <span className="label">From the call</span>
          <div className="snip">
            {lead.transcript.map((l, i) => (
              <div key={i} className={'line ' + l.who}>
                <div className="who">{l.who === 'agent' ? 'Meera (AI)' : l.name ?? 'Patient'}</div>
                <div className="txt">{l.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function Desk() {
  const [clinic, setClinic] = useState<Clinic>('All');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<string>('L-2041');
  const [rulesOpen, setRulesOpen] = useState(false);

  const scoped = useMemo(() => leads.filter((l) => clinic === 'All' || l.clinic === clinic), [clinic]);
  const visible = useMemo(() => scoped.filter((l) => matches(l, filter)).sort((a, b) => b.priority - a.priority), [scoped, filter]);
  const lead = scoped.find((l) => l.id === selected) ?? visible[0] ?? scoped[0];

  const tiles = [
    { icon: ic.inbox, l: 'Enquiries today', v: String(kpis.enquiries), s: `${kpis.aiGroup} AI-first · ${kpis.control} control` },
    { icon: ic.clock, l: 'Median time to first contact', v: kpis.medianFirstContact, s: `Control: ${kpis.controlFirstContact}` },
    { icon: ic.call, l: 'Calls answered', v: kpis.answered, s: 'With WhatsApp heads-up and verified ID' },
    { icon: ic.calendar, l: 'Booked a consult', v: kpis.bookedAi, s: `Control: ${kpis.bookedControl}` },
    { icon: ic.people, l: 'Handoff wait (median)', v: kpis.queueWait, s: 'Target under 30 min' },
  ];

  return (
    <main className="page" id="main">
      <header className="page-head">
        <div>
          <p className="crumb">Screen 2 · What HappySmile sees afterwards</p>
          <h1>Front desk · Today</h1>
          <p className="sub">Every enquiry in one place, ranked by what needs a person now.</p>
        </div>
        <div className="head-actions">
          <span className="pill warn">Pilot · illustrative data</span>
          <div className="seg" role="group" aria-label="Clinic">
            {(['All', 'Sector 29', 'Golf Course Rd'] as const).map((c) => (
              <button key={c} aria-pressed={clinic === c} onClick={() => setClinic(c)}>
                {c}
              </button>
            ))}
          </div>
          <button className="btn" onClick={() => setRulesOpen(true)}>
            <Icon d={ic.tune} size={16} />
            Open rules
          </button>
        </div>
      </header>

      <section className="kpis" aria-label="Today in numbers">
        {tiles.map((t) => (
          <div className="card stat" key={t.l}>
            <span className="stat-icon">
              <Icon d={t.icon} size={18} />
            </span>
            <span className="stat-l">{t.l}</span>
            <b className="stat-v">{t.v}</b>
            <span className="stat-s">{t.s}</span>
          </div>
        ))}
      </section>

      <div className="desk">
        <section className="card queue" aria-labelledby="queue-h">
          <div className="card-h">
            <h2 id="queue-h">Queue</h2>
            <span className="muted small">Sorted by priority</span>
          </div>
          <div className="filters" role="group" aria-label="Filter the queue">
            {filters.map((f) => (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className="count">{scoped.filter((l) => matches(l, f.id)).length}</span>
              </button>
            ))}
          </div>
          {visible.length === 0 && <div className="empty">Nothing waiting here. Choose All to see every enquiry.</div>}
          <ul className="lead-list">
            {visible.map((l) => {
              const s = statusMeta[l.status];
              return (
                <li key={l.id}>
                  <button
                    className="lead"
                    aria-current={lead && l.id === lead.id ? 'true' : undefined}
                    onClick={() => {
                      setSelected(l.id);
                      if (window.matchMedia('(max-width: 1100px)').matches) document.getElementById('lead-detail')?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    <span className="avatar" aria-hidden="true">
                      {initials(l.name)}
                    </span>
                    <span className="lead-main">
                      <span className="lead-top">
                        <span className="nm">{l.name}</span>
                        <span className={'pill ' + s.tone}>{s.label}</span>
                      </span>
                      <span className="why">{l.reason}</span>
                      <span className="meta">
                        {l.treatment} · {l.clinic} · <span className="tabular">{l.enquired}</span>
                        <span className="prio tabular" title="Priority score">
                          P{l.priority}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {lead && <Detail lead={lead} />}
      </div>

      <section className="card exp" aria-labelledby="exp-h">
        <div className="card-h">
          <div>
            <h2 id="exp-h">
              <Icon d={ic.flask} size={18} />
              AI-first vs today’s process
            </h2>
            <p className="muted small">Pilot week 2 · 20% of enquiries randomly kept on the current 4 to 6 hour callback</p>
          </div>
          <span className="legend">
            <i className="sw ai" /> AI-first <i className="sw ctl" /> Control
          </span>
        </div>
        <div className="exp-grid">
          {experiment.map((e, i) => {
            const key = i === experiment.length - 1;
            return (
              <div className={'exp-row' + (key ? ' key' : '')} key={e.metric}>
                <div className="exp-metric">
                  {key && <span className="pill accent">Success metric</span>}
                  <b>{e.metric}</b>
                </div>
                <div className="bars">
                  <div className="bar">
                    <div className="track">
                      <div className="fill" style={{ width: `${e.ai}%` }} />
                    </div>
                    <b className="tabular">
                      {e.ai}
                      {e.unit}
                    </b>
                  </div>
                  <div className="bar ctl">
                    <div className="track">
                      <div className="fill" style={{ width: `${e.control}%` }} />
                    </div>
                    <span className="tabular">
                      {e.control}
                      {e.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="muted small">Share of calls the AI completes without a human is deliberately not shown: chasing it cuts the handoffs that close implant leads.</p>
      </section>

      {rulesOpen && <Rules onClose={() => setRulesOpen(false)} />}
    </main>
  );
}
