import { useEffect, useMemo, useState } from 'react';
import { experiment, kpis, leads, priceBands, statusMeta } from '../data';
import type { Lead, LeadStatus } from '../data';

type Filter = 'all' | LeadStatus;

const filters: { id: Filter; label: string }[] = [
  { id: 'needs_you', label: 'Needs you' },
  { id: 'at_risk', label: 'At risk' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'no_answer', label: 'No answer' },
  { id: 'booked', label: 'Booked' },
  { id: 'all', label: 'All' },
];

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
  });
  const flip = (k: string) => setRules((r) => ({ ...r, [k]: !r[k] }));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const Row = ({ k, label }: { k: string; label: string }) => (
    <div className="toggle-row">
      <span id={'lbl-' + k}>{label}</span>
      <button className="switch" role="switch" aria-checked={rules[k]} aria-labelledby={'lbl-' + k} onClick={() => flip(k)} />
    </div>
  );
  return (
    <>
      <button className="drawer-bg" aria-label="Close rules" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Rules">
        <div className="drawer-head">
          <div>
            <div className="eyebrow">Settings · owned by the front-desk lead</div>
            <h2 style={{ marginTop: 6 }}>Rules</h2>
          </div>
          <button className="btn light sm" onClick={onClose} autoFocus>
            Close rules
          </button>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          No workflow builder in the pilot. These are the only knobs, and the front-desk lead signs them off.
        </p>

        <div className="card rule">
          <h3>Calling hours</h3>
          <div className="toggle-row">
            <span>Call window</span>
            <b>9:00 am to 9:00 pm</b>
          </div>
          <div className="toggle-row">
            <span>Outside the window</span>
            <b>WhatsApp now, call at chosen time</b>
          </div>
          <div className="toggle-row">
            <span>Attempts before stopping</span>
            <b>3 calls over 24 h</b>
          </div>
        </div>

        <div className="card rule">
          <h3>Hand to the front desk when</h3>
          <Row k="clinical" label="Patient asks a clinical question" />
          <Row k="price" label="Patient negotiates on price" />
          <Row k="implants" label="Implant or full-arch lead (human closes)" />
          <Row k="human" label="Patient asks for a person" />
          <Row k="confused" label="Agent misunderstands twice" />
        </div>

        <div className="card rule">
          <h3>Playbooks</h3>
          <div className="toggle-row">
            <span>Aligners and braces · Implants · Tooth pain</span>
            <span className="tag ok">Live</span>
          </div>
          <Row k="teenParent" label="Teen braces: invite both parents, prefer weekends" />
          <Row k="cleaningWa" label="Cleaning: WhatsApp only, no call" />
          <div className="toggle-row">
            <span>Wedding smile (date-bound)</span>
            <span className="tag grey">Next</span>
          </div>
        </div>

        <div className="card rule">
          <h3>AI disclosure</h3>
          <div className="toggle-row">
            <span>Never deny being AI when asked</span>
            <span className="tag dark">Always on</span>
          </div>
          <Row k="disclosureTest" label="Test: say it upfront on 50% of calls" />
        </div>

        <div className="card rule">
          <h3>Approved price bands (the agent may only say these)</h3>
          <div className="table-wrap">
          <table className="bands">
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
                  <td>{p.band}</td>
                  <td className="muted">{p.extras}</td>
                  <td>{p.emi}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            Final price always after the exam. Signed off by the clinical lead.
          </p>
        </div>
      </aside>
    </>
  );
}

function Detail({ lead }: { lead: Lead }) {
  const s = statusMeta[lead.status];
  return (
    <div className="card detail">
      <div className="detail-top">
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={'tag ' + s.tone}>{s.label}</span>
            <span className="tag grey">{lead.group}</span>
            <span className="muted" style={{ fontSize: 13 }}>
              {lead.id}
            </span>
          </div>
          <h2>{lead.name}</h2>
          <div className="muted" style={{ fontSize: 14 }}>
            {lead.treatment} · {lead.clinic} · {lead.source} · enquired {lead.enquired}
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn sm">Call {lead.name.split(' ')[0]}</button>
          <button className="btn light sm">Send WhatsApp</button>
          <button className="btn light sm">Mark as handled</button>
        </div>
      </div>

      <div className="next-box">
        <div className="eyebrow">Next best action · {lead.reason}</div>
        <p>{lead.next}</p>
      </div>

      <div className="facts">
        <div className="fact">
          <div className="k">Decider</div>
          <div className="v">{lead.decider}</div>
        </div>
        <div className="fact">
          <div className="k">Main worry</div>
          <div className="v">{lead.worry}</div>
        </div>
        <div className="fact">
          <div className="k">Value</div>
          <div className="v">{lead.value}</div>
        </div>
        <div className="fact">
          <div className="k">First contact</div>
          <div className="v">{lead.firstContact}</div>
        </div>
        <div className="fact">
          <div className="k">Booking</div>
          <div className="v">{lead.slot ?? 'Not booked'}</div>
        </div>
        <div className="fact">
          <div className="k">Credited to</div>
          <div className="v">{lead.credited}</div>
        </div>
      </div>

      <div className="summary">
        <div className="eyebrow">What the patient already told us</div>
        <p>{lead.summary}</p>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
          Language: {lead.language}. Open with this so the patient never repeats themselves.
        </p>
      </div>

      {lead.transcript.length > 0 && (
        <div>
          <div className="eyebrow">From the call</div>
          <div className="snip">
            {lead.transcript.map((l, i) => (
              <div key={i} className={'line ' + l.who} style={{ maxWidth: '100%' }}>
                <div className="who">{l.who === 'agent' ? 'Meera (AI)' : l.name ?? 'Patient'}</div>
                <div className="txt">{l.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Desk() {
  const [clinic, setClinic] = useState<'All' | 'Sector 29' | 'Golf Course Rd'>('All');
  const [filter, setFilter] = useState<Filter>('needs_you');
  const [selected, setSelected] = useState<string>('L-2041');
  const [rulesOpen, setRulesOpen] = useState(false);

  const scoped = useMemo(() => leads.filter((l) => clinic === 'All' || l.clinic === clinic), [clinic]);
  const visible = useMemo(
    () => scoped.filter((l) => filter === 'all' || l.status === filter || (filter === 'booked' && l.status === 'whatsapp_only')).sort((a, b) => b.priority - a.priority),
    [scoped, filter],
  );
  const count = (f: Filter) => scoped.filter((l) => f === 'all' || l.status === f || (f === 'booked' && l.status === 'whatsapp_only')).length;
  const lead = scoped.find((l) => l.id === selected) ?? visible[0] ?? scoped[0];

  return (
    <main className="page" id="main">
      <div className="screen-head">
        <div>
          <span className="tag accent">Screen 2 · What HappySmile sees afterwards</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 14 }}>Front-desk queue</h1>
          <p>Every enquiry in one place, ranked by what needs a person now. The agent books routine consults; your team closes the rest.</p>
        </div>
        <div className="desk-controls">
          <div className="seg">
            {(['All', 'Sector 29', 'Golf Course Rd'] as const).map((c) => (
              <button key={c} aria-pressed={clinic === c} onClick={() => setClinic(c)}>
                {c}
              </button>
            ))}
          </div>
          <button className="btn light sm" onClick={() => setRulesOpen(true)}>
            Open rules
          </button>
          <span className="tag warn">Pilot · illustrative data</span>
        </div>
      </div>

      <div className="kpis">
        <div className="card kpi">
          <div className="l">Enquiries today</div>
          <div className="v">{kpis.enquiries}</div>
          <div className="c">
            {kpis.aiGroup} AI-first · {kpis.control} control
          </div>
        </div>
        <div className="card kpi">
          <div className="l">Median time to first contact</div>
          <div className="v">{kpis.medianFirstContact}</div>
          <div className="c">Control: {kpis.controlFirstContact}</div>
        </div>
        <div className="card kpi">
          <div className="l">Calls answered</div>
          <div className="v">{kpis.answered}</div>
          <div className="c">With WhatsApp heads-up + verified ID</div>
        </div>
        <div className="card kpi">
          <div className="l">Booked a consult</div>
          <div className="v">{kpis.bookedAi}</div>
          <div className="c">Control: {kpis.bookedControl}</div>
        </div>
        <div className="card kpi">
          <div className="l">Handoff wait (median)</div>
          <div className="v">{kpis.queueWait}</div>
          <div className="c">Target under 30 min</div>
        </div>
      </div>

      <div className="desk">
        <div className="card queue">
          <div className="queue-tabs" role="group" aria-label="Filter the queue">
            {filters.map((f) => (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className="count">{count(f.id)}</span>
              </button>
            ))}
          </div>
          {visible.length === 0 && <div className="empty">Nothing waiting here. Switch to All to see every enquiry.</div>}
          <ul className="lead-list">
          {visible.map((l) => {
            const s = statusMeta[l.status];
            return (
              <li key={l.id}>
              <button className="lead" aria-current={lead && l.id === lead.id ? 'true' : undefined} onClick={() => setSelected(l.id)}>
                <div className="top">
                  <span className="nm">{l.name}</span>
                  <span className={'tag ' + s.tone}>{s.label}</span>
                </div>
                <div className="why">{l.reason}</div>
                <div className="meta">
                  <span>{l.treatment}</span>
                  <span>{l.clinic}</span>
                  <span>{l.enquired}</span>
                  <span className="prio">Priority {l.priority}</span>
                </div>
              </button>
              </li>
            );
          })}
          </ul>
        </div>

        <div>
          {lead && <Detail lead={lead} />}
          <div className="card exp">
            <div className="exp-head">
              <div>
                <div className="eyebrow">Experiment · pilot week 2</div>
                <h3 style={{ marginTop: 4 }}>AI-first vs today's process</h3>
              </div>
              <span className="muted" style={{ fontSize: 12.5 }}>
                20% of enquiries randomly kept on the current callback
              </span>
            </div>
            {experiment.map((e, i) => (
              <div className={'exp-row' + (i === experiment.length - 1 ? ' key' : '')} key={e.metric}>
                <div className="metric" style={{ fontSize: 14 }}>{e.metric}</div>
                <div className="bars">
                  <div className="bar">
                    <span>AI-first</span>
                    <div className="track">
                      <div className="fill" style={{ width: `${e.ai}%` }} />
                    </div>
                    <b>
                      {e.ai}
                      {e.unit}
                    </b>
                  </div>
                  <div className="bar ctl">
                    <span className="muted">Control</span>
                    <div className="track">
                      <div className="fill" style={{ width: `${e.control}%` }} />
                    </div>
                    <span>
                      {e.control}
                      {e.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>
              The last row is the success metric. Share of calls handled without a human is deliberately not shown.
            </p>
          </div>
        </div>
      </div>

      {rulesOpen && <Rules onClose={() => setRulesOpen(false)} />}
    </main>
  );
}
