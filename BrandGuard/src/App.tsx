import { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import {
  ShieldCheck,
  Home,
  ClipboardCheck,
  Layers3,
  CheckCheck,
  BookOpen,
  BadgeCheck,
  Image,
  AlertTriangle,
  Globe2,
  Shield,
  Lightbulb,
  Activity,
  Fingerprint,
  History,
  Users,
  Zap,
  Settings2,
  Search,
  Bell,
  Plus,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Sparkles,
  FileText,
  Clock3,
  Target,
  LockKeyhole,
  Menu,
  MessageSquare,
  WandSparkles,
  Download,
  Send,
  MoreHorizontal,
  CircleHelp,
} from 'lucide-react';
const nav = [
  [
    'Workspace',
    [
      ['Overview', 'overview', Home],
      ['Content review', 'review', ClipboardCheck],
      ['Campaigns', 'campaigns', Layers3],
      ['Approval queue', 'approvals', CheckCheck],
    ],
  ],
  [
    'Brand system',
    [
      ['Guidelines', 'guidelines', BookOpen],
      ['Approved facts', 'facts', BadgeCheck],
      ['Asset library', 'assets', Image],
      ['Guideline conflicts', 'conflicts', AlertTriangle],
    ],
  ],
  [
    'Intelligence',
    [
      ['Audience simulator', 'audience', Globe2],
      ['Risk routing', 'routing', Shield],
      ['Override learning', 'learning', Lightbulb],
      ['Insights', 'insights', Activity],
    ],
  ],
  [
    'Governance',
    [
      ['Content passports', 'passports', Fingerprint],
      ['Revision history', 'history', History],
      ['Team & roles', 'team', Users],
      ['Integrations', 'integrations', Zap],
      ['Settings', 'settings', Settings2],
    ],
  ],
];
const seedIssues = [
  {
    id: 1,
    severity: 'High',
    title: 'Unverified performance claim',
    detail: '“2× faster” has no matching approved source in the fact library.',
    rule: 'Claims & evidence · FACT-014',
    fix: 'Replace with “designed to help teams work more efficiently.”',
  },
  {
    id: 2,
    severity: 'Medium',
    title: 'Off-brand phrase',
    detail:
      '“Revolutionary” may feel exaggerated against the confident, thoughtful brand voice.',
    rule: 'Voice & tone · VOICE-008',
    fix: 'Try “A thoughtful new way to work.”',
  },
  {
    id: 3,
    severity: 'Low',
    title: 'Accessibility detail missing',
    detail: 'The attached social image has no descriptive alt text.',
    rule: 'Accessibility · A11Y-002',
    fix: 'Add descriptive alt text for the image.',
  },
];
const seedItems = [
  {
    id: 1042,
    title: 'Autumn launch — social post',
    type: 'Social',
    status: 'Needs review',
    risk: 'Medium',
    owner: 'Maya Chen',
    text: 'Meet the revolutionary new workspace. Teams are 2× faster from day one. Discover a better way to work.',
    issues: seedIssues,
    comments: ['Can we verify the 2× claim with Research before launch?'],
    history: ['Maya Chen created draft', 'BrandGuard ran 12 checks'],
  },
  {
    id: 1041,
    title: 'Q4 product announcement',
    type: 'Blog',
    status: 'Approved',
    risk: 'Low',
    owner: 'Jordan Lee',
    text: 'A calmer, clearer way for teams to do their best work.',
    issues: [],
    comments: [],
    history: ['Jordan Lee created draft', 'A. Patel approved'],
  },
  {
    id: 1040,
    title: 'Enterprise pricing email',
    type: 'Email',
    status: 'Legal review',
    risk: 'High',
    owner: 'Sam Rivera',
    text: 'Lock in our guaranteed savings before December 1.',
    issues: [
      {
        id: 4,
        severity: 'High',
        title: 'Guarantee needs legal review',
        detail: 'Savings guarantees require approved terms and legal sign-off.',
        rule: 'Legal claims · LEGAL-003',
        fix: 'Use approved wording from enterprise pricing terms.',
      },
    ],
    comments: [],
    history: ['Sam Rivera created draft', 'Automatically routed to Legal'],
  },
  {
    id: 1039,
    title: 'Customer story — Northstar',
    type: 'Case study',
    status: 'In progress',
    risk: 'Medium',
    owner: 'Maya Chen',
    text: 'Northstar transformed their workflow with our platform.',
    issues: [],
    comments: [],
    history: ['Maya Chen created draft'],
  },
];
const seedRules = [
  {
    id: 'VOICE-008',
    title: 'Confident, never exaggerated',
    group: 'Voice & tone',
    desc: 'Sound thoughtful, clear and quietly confident.',
  },
  {
    id: 'FACT-014',
    title: 'Every claim needs evidence',
    group: 'Claims & evidence',
    desc: 'Only use claims supported by approved research or product facts.',
  },
  {
    id: 'TERM-003',
    title: 'Say “workspace”, not “command center”',
    group: 'Preferred terminology',
    desc: 'Use workspace in customer-facing copy.',
  },
  {
    id: 'A11Y-002',
    title: 'Images need descriptive alt text',
    group: 'Accessibility',
    desc: 'Write meaningful alt text for informative imagery.',
  },
];
const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};
const slug = s => s.toLowerCase().replaceAll(' ', '-');
function App() {
  const [page, setPage] = useState('overview'),
    [items, setItems] = useState(() => load('bg-items', seedItems)),
    [rules, setRules] = useState(() => load('bg-rules', seedRules)),
    [facts, setFacts] = useState(() =>
      load('bg-facts', [
        {
          id: 'F-101',
          claim: 'SOC 2 Type II certified',
          source: 'Security report · 2026',
          status: 'Approved',
        },
        {
          id: 'F-102',
          claim: 'Available in 14 languages',
          source: 'Product documentation',
          status: 'Approved',
        },
        {
          id: 'F-103',
          claim: '2× faster team workflows',
          source: 'No approved evidence attached',
          status: 'Needs evidence',
        },
      ])
    ),
    [overrides, setOverrides] = useState(() =>
      load('bg-overrides', [
        {
          text: '“Revolutionary” flagged in launch copy',
          reason: 'Brand voice is confident, not hyperbolic',
          count: 6,
        },
        {
          text: 'Regional spelling differences',
          reason: 'Approved locale-specific exception',
          count: 3,
        },
      ])
    );
  const [selectedId, setSelectedId] = useState(1042),
    [text, setText] = useState(seedItems[0].text),
    [search, setSearch] = useState(''),
    [notice, setNotice] = useState(''),
    [modal, setModal] = useState(''),
    [title, setTitle] = useState(''),
    [desc, setDesc] = useState(''),
    [source, setSource] = useState(''),
    [comment, setComment] = useState(''),
    [audience, setAudience] = useState('Kerala · India'),
    [campaignScan, setCampaignScan] = useState(false),
    [loading, setLoading] = useState(false),
    [role, setRole] = useState('Brand reviewer'),
    [tab, setTab] = useState('All items');
  useEffect(
    () => localStorage.setItem('bg-items', JSON.stringify(items)),
    [items]
  );
  useEffect(
    () => localStorage.setItem('bg-rules', JSON.stringify(rules)),
    [rules]
  );
  useEffect(
    () => localStorage.setItem('bg-facts', JSON.stringify(facts)),
    [facts]
  );
  useEffect(
    () => localStorage.setItem('bg-overrides', JSON.stringify(overrides)),
    [overrides]
  );
  const item = items.find(i => i.id === selectedId) || items[0],
    open = p => {
      setPage(p);
      setNotice('');
      document.body.classList.remove('sidebar-open');
      window.scrollTo(0, 0);
    },
    notify = s => {
      setNotice(s);
      window.setTimeout(() => setNotice(''), 3500);
    },
    update = (id, patch) =>
      setItems(old => old.map(i => (i.id === id ? { ...i, ...patch } : i)));
  const changeIssue = (iid, accepted) => {
    update(item.id, {
      issues: item.issues.map(x => (x.id === iid ? { ...x, accepted } : x)),
      history: [
        ...item.history,
        (accepted ? 'Suggestion accepted' : 'Suggestion dismissed') +
          ' · just now',
      ],
    });
  };
  const runReview = async () => {
    setLoading(true);
    try {
      const r = await api.post('/api/review', {
        content: text,
        guidelines: rules,
        facts,
        audience,
      });
      const issues = Array.isArray(r.data.issues)
        ? r.data.issues.map((x, i) => ({ ...x, id: Date.now() + i }))
        : [];
      update(item.id, {
        text,
        issues,
        status: issues.length ? 'Needs review' : 'Ready for approval',
        history: [...item.history, 'AI-assisted review completed · just now'],
      });
      notify('Review complete · ' + issues.length + ' finding(s)');
    } catch {
      const issues = [];
      if (/revolutionary|world-class|best ever/i.test(text))
        issues.push({
          id: Date.now() + 1,
          severity: 'Medium',
          title: 'Potentially exaggerated language',
          detail: 'This phrase may feel hyperbolic against the brand voice.',
          rule: 'VOICE-008 · Voice & tone',
          fix: 'Use specific, grounded language that explains the benefit.',
        });
      if (/\\d+×|\\d+x|guaranteed|100%|#1/i.test(text))
        issues.push({
          id: Date.now() + 2,
          severity: 'High',
          title: 'Claim needs approved evidence',
          detail:
            'A quantified or absolute claim was detected. Confirm it against approved facts.',
          rule: 'FACT-014 · Claims & evidence',
          fix: 'Link an approved source or use a qualified, verifiable statement.',
        });
      if (!issues.length)
        issues.push({
          id: Date.now() + 3,
          severity: 'Low',
          title: 'Human review still recommended',
          detail:
            'Rule checks found no obvious flags; this is not factual or legal certification.',
          rule: 'Governance · Human approval required',
          fix: 'Confirm facts, links, visuals and context before publishing.',
        });
      update(item.id, {
        text,
        issues,
        status: 'Needs review',
        history: [
          ...item.history,
          'Local rule checks completed · AI service unavailable',
        ],
      });
      notify('Rule checks complete · AI service unavailable; results limited');
    } finally {
      setLoading(false);
    }
  };
  const approve = () => {
    update(item.id, {
      status: 'Approved',
      history: [...item.history, role + ' approved · just now'],
    });
    notify('Approved · passport record updated');
  };
  const exportPassport = () => {
    const data = {
      product: 'BrandGuard',
      passportId: 'BG-' + item.id,
      content: item,
      checksRun: [
        'brand voice',
        'approved terminology',
        'claims and evidence',
        'accessibility heuristics',
      ],
      serviceDisclosure:
        'AI-assisted review may use an external model service; local fallback is rule-based.',
      exportedAt: new Date().toISOString(),
      tamperProof: false,
      note: 'Demo export is not cryptographically tamper-proof.',
    };
    const a = document.createElement('a'),
      url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      );
    a.href = url;
    a.download = 'brand-passport-' + item.id + '.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Passport exported as JSON');
  };
  const create = () => {
    if (!title.trim()) {
      notify('Add a title first');
      return;
    }
    const id = Math.max(...items.map(x => x.id), 1042) + 1;
    const fresh = {
      id,
      title,
      type: 'Social',
      status: 'Draft',
      risk: 'Low',
      owner: 'You',
      text: 'Add your content here to begin a brand review.',
      issues: [],
      comments: [],
      history: ['You created this draft · just now'],
    };
    setItems([fresh, ...items]);
    setSelectedId(id);
    setText(fresh.text);
    setTitle('');
    setModal('');
    open('review');
    notify('Draft created');
  };
  const filtered = items.filter(
    i =>
      (i.title + ' ' + i.type + ' ' + i.status + ' ' + i.owner)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (tab === 'All items' ||
        i.status.toLowerCase().includes(tab.toLowerCase()))
  );
  const titles = {
    overview: 'Good morning, team',
    review: 'Content review',
    campaigns: 'Campaign consistency',
    approvals: 'Approval queue',
    guidelines: 'Brand guidelines',
    facts: 'Approved facts',
    assets: 'Asset library',
    conflicts: 'Guideline conflict detector',
    audience: 'Audience simulator',
    routing: 'Risk-based routing',
    learning: 'Learning from overrides',
    insights: 'Brand intelligence',
    passports: 'Content passports',
    history: 'Revision history',
    team: 'Team & roles',
    integrations: 'Connected tools',
    settings: 'Workspace settings',
  };
  const count = items.reduce(
    (n, i) => n + i.issues.filter(x => !x.accepted).length,
    0
  );
  const navButton = (p, label, Icon) => (
    <button
      key={p}
      className={'nav-link ' + (page === p ? 'active' : '')}
      onClick={() => open(p)}
    >
      <Icon size={16} />
      <span>{label}</span>
      {p === 'approvals' && (
        <em>{items.filter(i => i.status !== 'Approved').length}</em>
      )}
    </button>
  );
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={21} />
          </div>
          <div>
            <strong>
              brandguard<span>®</span>
            </strong>
            <small>BRAND GOVERNANCE</small>
          </div>
          <button
            className="icon-btn close-menu"
            onClick={() => document.body.classList.remove('sidebar-open')}
          >
            <X size={16} />
          </button>
        </div>
        <button className="workspace" onClick={() => open('settings')}>
          <div className="workspace-avatar">N</div>
          <div>
            <b>Northstar Studio</b>
            <small>Growth workspace</small>
          </div>
          <ChevronDown size={14} />
        </button>
        <div className="nav-scroll">
          {nav.map(group => (
            <div className="nav-group" key={group[0]}>
              <div className="nav-label">{group[0]}</div>
              {group[1].map(row => navButton(row[1], row[0], row[2]))}
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="secure-note">            <LockKeyhole size={16} />
            <div>
              <b>Your brand, protected</b>
              <small>Demo workspace · local data</small>
            </div>
            <i />
          </div>
          <button className="profile" onClick={() => open('team')}>
            <div className="avatar">VC</div>
            <div>
              <b>Vishnu C.</b>
              <small>{role}</small>
            </div>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="crumb">
            <button
              className="icon-btn mobile-menu"
              onClick={() => document.body.classList.toggle('sidebar-open')}
            >
              <Menu size={18} />
            </button>
            <span>Northstar Studio</span>
            <ChevronRight size={14} />
            <b>{titles[page]}</b>
          </div>
          <div className="top-actions">
            <div className="search">
              <Search size={15} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search anything…"
              />
            </div>
            <button className="icon-btn" onClick={() => open('approvals')}>
              <Bell size={18} />
              <i />
            </button>
            <div className="avatar">VC</div>
          </div>
        </header>
        <div className="content">
          {notice && (
            <div className="toast">
              <Check size={15} />
              {notice}
              <button onClick={() => setNotice('')}>
                <X size={14} />
              </button>
            </div>
          )}
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {page === 'overview'
                  ? 'YOUR BRAND WORKSPACE'
                  : 'BRANDGUARD WORKSPACE'}
              </div>
              <h1>{titles[page]}</h1>
              <p>
                {page === 'overview'
                  ? 'A clearer view of what is on-brand, what needs attention, and what ships next.'
                  : page === 'review'
                    ? 'Catch inconsistencies before they reach your audience. Human judgment always has the final say.'
                    : page === 'audience'
                      ? 'Preview how messages may land across regions and stakeholder groups.'
                      : 'Keep every message aligned, every decision explainable, and every launch consistent.'}
              </p>
            </div>
            <div className="heading-actions">
              {page === 'overview' && (
                <button
                  className="btn secondary"
                  onClick={() => open('insights')}
                >
                  <Activity size={15} /> View insights
                </button>
              )}
              <button
                className="btn primary"
                onClick={() => {
                  setTitle('');
                  setModal('new');
                }}
              >
                <Plus size={16} /> New content
              </button>
            </div>
          </div>
          {page === 'overview' && (
            <>
              <div className="hero">
                <div className="hero-copy">
                  <span className="hero-pill">
                    <Sparkles size={13} /> YOUR BRAND, IN GOOD HANDS
                  </span>
                  <h2>
                    Great work deserves
                    <br />a <span>consistent voice.</span>
                  </h2>
                  <p>
                    Catch brand drift early, explain every issue, and help your
                    team ship with confidence.
                  </p>
                  <button
                    className="btn primary"
                    onClick={() => open('review')}
                  >
                    Review content <ArrowRight size={15} />
                  </button>
                  <div className="hero-foot">
                    <i /> Systems operational <span>·</span> Last check 4 min
                    ago
                  </div>
                </div>
                <div className="hero-art">
                  <div className="orb orb1" />
                  <div className="mock-window">
                    <div className="mock-head">
                      <span>● ● ●</span>
                      <b>BRAND CHECK</b>
                      <BadgeCheck size={16} />
                    </div>
                    <div className="mock-line" />
                    <div className="mock-line short" />
                    <div className="mock-alert">
                      <AlertTriangle size={15} />
                      <div>
                        <b>Claim needs evidence</b>
                        <small>2× faster · FACT-014</small>
                      </div>
                      <span>Review</span>
                    </div>
                    <div className="mock-ok">
                      <Check size={14} /> Voice & tone aligned
                    </div>
                    <div className="mock-bottom">
                      12 checks run <b>92% aligned</b>
                    </div>
                  </div>
                  <div className="floating-stamp">
                    <ShieldCheck size={18} />
                    <span>
                      <b>Human-approved</b>
                      <small>Every time.</small>
                    </span>
                  </div>
                </div>
              </div>
              <div className="stats">
                {[
                  [
                    'Content reviewed',
                    '1,284',
                    '+12.8%',
                    'vs. last month',
                    'lavender',
                    FileText,
                  ],
                  [
                    'On-brand score',
                    '94.6%',
                    '+3.2%',
                    'vs. last month',
                    'mint',
                    Target,
                  ],
                  [
                    'Needs attention',
                    String(count).padStart(2, '0'),
                    'Action needed',
                    'Across active drafts',
                    'peach',
                    AlertTriangle,
                  ],
                  [
                    'Avg. review time',
                    '8.4 min',
                    '−18%',
                    'faster this month',
                    'blue',
                    Clock3,
                  ],
                ].map(([label, value, delta, note, tone, Icon]) => (
                  <div className="stat" key={label}>
                    <div className="stat-label">
                      {label}
                      <span className={'stat-icon ' + tone}>
                        <Icon size={16} />
                      </span>
                    </div>
                    <strong>{value}</strong>
                    <small className="stat-note">
                      <b>{delta}</b> {note}
                    </small>
                  </div>
                ))}
              </div>
              <div className="columns">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>
                        Needs your attention{' '}
                        <em>
                          {items.filter(i => i.status !== 'Approved').length}
                        </em>
                      </h3>
                      <p>Items that need a human decision.</p>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => open('approvals')}
                    >
                      View queue <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>CONTENT</th>
                          <th>RISK</th>
                          <th>STATUS</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {items
                          .filter(i => i.status !== 'Approved')
                          .slice(0, 4)
                          .map(i => (
                            <tr
                              key={i.id}
                              onClick={() => {
                                setSelectedId(i.id);
                                setText(i.text);
                                open('review');
                              }}
                            >
                              <td>
                                <div className="content-cell">
                                  <span className="file-icon">
                                    <FileText size={16} />
                                  </span>
                                  <div>
                                    <b>{i.title}</b>
                                    <small>
                                      {i.type} · {i.owner}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <Tag text={i.risk} />
                              </td>
                              <td>
                                <Tag text={i.status} />
                              </td>
                              <td>
                                <ChevronRight size={15} />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Brand health</h3>
                      <p>Consistency across the last 7 days.</p>
                    </div>
                    <button
                      className="icon-btn"
                      onClick={() => open('insights')}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                  <div className="health">
                    <div className="ring">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" />
                        <circle className="ring-fill" cx="50" cy="50" r="40" />
                      </svg>
                      <b>
                        94.6<small>/100</small>
                      </b>
                    </div>
                    <div>
                      <span className="green-tag">↗ 3.2% this week</span>
                      <h3>Looking good.</h3>
                      <p>Your content is more consistent than last week.</p>
                    </div>
                  </div>
                  {[
                    ['Voice alignment', '96%', '96%'],
                    ['Claim accuracy', '89%', '89%'],
                    ['Accessibility', '91%', '91%'],
                  ].map(x => (
                    <div className="metric" key={x[0]}>
                      <div>
                        <span>{x[0]}</span>
                        <b>{x[1]}</b>
                      </div>
                      <div className="progress">
                        <i style={{ width: x[2] }} />
                      </div>
                    </div>
                  ))}
                </section>
              </div>
              <div className="columns lower">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h3>Recent activity</h3>
                      <p>A transparent trail of decisions.</p>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => open('history')}
                    >
                      Full history <ArrowRight size={14} />
                    </button>
                  </div>
                  {[
                    [
                      'purple',
                      'Autumn launch — social post',
                      'Flagged 3 issues · Maya Chen',
                      '8 min ago',
                    ],
                    [
                      'green',
                      'Q4 product announcement',
                      'Approved · Jordan Lee',
                      '1 hr ago',
                    ],
                    [
                      'orange',
                      'Enterprise pricing email',
                      'Routed to legal · Sam Rivera',
                      '2 hr ago',
                    ],
                  ].map(x => (
                    <div className="activity" key={x[1]}>
                      <i className={x[0]} />
                      <div>
                        <b>{x[1]}</b>
                        <small>{x[2]}</small>
                      </div>
                      <span>{x[3]}</span>
                    </div>
                  ))}
                </section>
                <section className="insight-card">
                  <Lightbulb size={21} />
                  <div className="eyebrow">A PATTERN WORTH NOTICING</div>
                  <h3>One rule keeps tripping people up.</h3>
                  <p>
                    “Confident, never exaggerated” triggered 18 flags this
                    month. A clearer example may prevent repeat rework.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => open('learning')}
                  >
                    Explore the pattern <ArrowRight size={14} />
                  </button>
                </section>
              </div>
            </>
          )}
          {page === 'review' && (
            <div className="review-layout">
              <section className="panel editor">
                <div className="panel-head">
                  <div>
                    <h3>Content workspace</h3>
                    <p>Edit your draft, then run a brand check.</p>
                  </div>
                  <span className="saved">● Saved locally</span>
                </div>
                <label className="field-label">Content item</label>
                <select
                  className="select"
                  value={selectedId}
                  onChange={e => {
                    const n = Number(e.target.value);
                    setSelectedId(n);
                    setText(items.find(x => x.id === n).text);
                  }}
                >
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </select>
                <label className="field-label gap">Your content</label>
                <textarea
                  className="editor-text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <div className="editor-meta">
                  {text.length} characters{' '}
                  <span>
                    English (US) <ChevronDown size={13} />
                  </span>
                </div>
                <div className="editor-actions">
                  <button className="btn secondary" onClick={() => setText('')}>
                    Clear draft
                  </button>
                  <button
                    className="btn primary"
                    disabled={loading}
                    onClick={runReview}
                  >
                    {loading ? (
                      'Checking…'
                    ) : (
                      <>
                        <WandSparkles size={15} /> Run brand check
                      </>
                    )}
                  </button>
                </div>
                <div className="check-types">
                  {[
                    ['Brand voice', 'Tone, terminology & style'],
                    ['Claims & facts', 'Approved evidence library'],
                    ['Accessibility', 'Language & visual heuristics'],
                  ].map(x => (
                    <div key={x[0]}>
                      <ShieldCheck size={15} />
                      <b>{x[0]}</b>
                      <small>{x[1]}</small>
                    </div>
                  ))}
                </div>
                <Note>
                  Text checks are active. Visual contrast and alt-text checks
                  need an uploaded image to assess. A review is guidance, not
                  legal or factual certification.
                </Note>
              </section>
              <section className="panel findings">
                <div className="panel-head">
                  <div>
                    <h3>
                      Review findings{' '}
                      <em>{item.issues.filter(x => !x.accepted).length}</em>
                    </h3>
                    <p>Every flag explains its source and next step.</p>
                  </div>
                  <Tag text={item.status} />
                </div>
                <div className="finding-summary">
                  <AlertTriangle size={18} />
                  <div>
                    <b>
                      {item.issues.filter(x => !x.accepted).length} items to
                      review
                    </b>
                    <small>
                      Suggestions are not automatic edits. You decide what
                      changes.
                    </small>
                  </div>
                </div>
                {item.issues.map(issue => (
                  <div
                    className={'finding ' + (issue.accepted ? 'done' : '')}
                    key={issue.id}
                  >
                    <span
                      className={'severity ' + issue.severity.toLowerCase()}
                    >
                      {issue.severity} priority
                    </span>
                    <h4>{issue.title}</h4>
                    <p>{issue.detail}</p>
                    <div className="rule-source">
                      <BookOpen size={13} />
                      {issue.rule}
                    </div>
                    <div className="suggestion">
                      <b>
                        <Sparkles size={12} /> SUGGESTED FIX
                      </b>                      <p>{issue.fix}</p>
                      <button
                        className="btn secondary small"
                        onClick={() => {
                          if (!issue.accepted) {
                            setText(t =>
                              t
                                .replace(
                                  /revolutionary|world-class|best ever/gi,
                                  'thoughtful'
                                )
                                .replace(
                                  /\\b\\d+× faster\\b/gi,
                                  'designed to help teams work more efficiently'
                                )
                            );
                            changeIssue(issue.id, true);
                            notify(
                              'Suggestion accepted; inspect the draft text'
                            );
                          } else {
                            changeIssue(issue.id, false);
                            notify('Suggestion reopened');
                          }
                        }}
                      >
                        <Check size={13} />
                        {issue.accepted
                          ? 'Accepted · undo'
                          : 'Accept suggestion'}
                      </button>
                      <button
                        className="dismiss"
                        onClick={() => {
                          const reason = window.prompt(
                            'Why override this suggestion? Example: wrong rule, special case, outdated'
                          );
                          if (reason !== null) {
                            setOverrides(prev => [
                              {
                                text: issue.title,
                                reason: reason.trim() || 'Special case',
                                count: 1,
                              },
                              ...prev,
                            ]);
                            changeIssue(issue.id, false);
                            notify('Override recorded for manager review');
                          }
                        }}
                      >
                        Dismiss / override
                      </button>
                    </div>
                  </div>
                ))}
                <div className="human-gate">
                  <ShieldCheck size={17} />
                  <div>
                    <b>Human approval required</b>
                    <small>
                      AI never publishes or approves on your behalf.
                    </small>
                  </div>
                </div>
                <button className="btn primary full" onClick={approve}>
                  <BadgeCheck size={15} /> Approve content
                </button>
                <div className="comments">
                  <b>Team discussion</b>
                  {item.comments.map((c, i) => (
                    <p key={i}>
                      <span className="avatar mini">VC</span>
                      {c}
                    </p>
                  ))}
                  <div>
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment…"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && comment.trim()) {
                          update(item.id, {
                            comments: [...item.comments, comment],
                          });
                          setComment('');
                          notify('Comment added');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (comment.trim()) {
                          update(item.id, {
                            comments: [...item.comments, comment],
                          });
                          setComment('');
                          notify('Comment added');
                        }
                      }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
          {page === 'campaigns' && (
            <>
              <div className="banner">
                <Layers3 size={23} />
                <div>
                  <h2>One campaign. One source of truth.</h2>
                  <p>
                    Compare claims, dates, prices and taglines across every
                    deliverable.
                  </p>
                </div>
                <button
                  className="btn primary"
                  onClick={() => {
                    setCampaignScan(true);
                    notify('Campaign scan complete · 2 issues found');
                  }}
                >
                  <Sparkles size={14} /> Scan campaign
                </button>
              </div>
              <div className="cards two">
                {[
                  [
                    'Launch blog',
                    'Blog article',
                    'Oct 28, 2026',
                    'Autumn starts here.',
                    'Approved',
                  ],
                  [
                    'Social post 01',
                    'Social',
                    'Oct 28, 2026',
                    'Autumn starts now.',
                    'Needs review',
                  ],
                  [
                    'Launch email',
                    'Email',
                    'Oct 30, 2026',
                    'Autumn starts here.',
                    'Needs review',
                  ],
                  [
                    'Paid ad set',
                    'Paid media',
                    'Oct 28, 2026',
                    'Save 20% this fall',
                    'Draft',
                  ],
                ].map((x, i) => (
                  <div className="panel card" key={x[0]}>
                    <div className="spread">
                      <FileText size={18} />
                      <Tag text={x[4]} />
                    </div>
                    <h3>{x[0]}</h3>
                    <small>
                      {x[1]} · {x[2]}
                    </small>
                    <blockquote>“{x[3]}”</blockquote>
                    <button
                      className="text-link"
                      onClick={() => {
                        setSelectedId(items[i % items.length].id);
                        setText(items[i % items.length].text);
                        open('review');
                      }}
                    >
                      Open content <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {campaignScan && (
                <section className="panel padded">
                  <h3>Campaign consistency findings</h3>
                  <FindingRow
                    title="Tagline drift"
                    detail="“Autumn starts here” and “Autumn starts now” appear in the same campaign. Confirm one approved tagline."
                  />
                  <FindingRow
                    title="Offer needs evidence"
                    detail="Paid ad says “Save 20%” but the offer is not present in the approved facts list."
                  />
                </section>
              )}
            </>
          )}
          {page === 'approvals' && (
            <>
              <div className="filterbar">
                {['All items', 'Needs review', 'Legal review', 'Approved'].map(
                  x => (
                    <button
                      className={tab === x ? 'selected' : ''}
                      onClick={() => setTab(x)}
                      key={x}
                    >
                      {x}
                    </button>
                  )
                )}
                <button
                  className="btn secondary"
                  onClick={() => {
                    setTab('All items');
                    setSearch('');
                  }}
                >
                  Clear filters
                </button>
              </div>
              <DataTable
                items={filtered}
                openItem={i => {
                  setSelectedId(i.id);
                  setText(i.text);
                  open('review');
                }}
              />
            </>
          )}
          {page === 'guidelines' && (
            <>
              <div className="toolbar">
                <div>
                  <b>{rules.length} active rules</b>
                  <small>Version 2.4 · Updated 12 Oct 2026</small>
                </div>
                <button
                  className="btn primary"
                  onClick={() => {
                    setTitle('');
                    setDesc('');
                    setModal('rule');
                  }}
                >
                  <Plus size={15} /> Add guideline
                </button>
              </div>
              <div className="cards two">
                {rules.map((r, i) => (
                  <div className="panel rule-card" key={r.id}>
                    <div className="spread">
                      <span className={'rule-symbol s' + (i % 4)}>
                        <BookOpen size={17} />
                      </span>
                      <Tag text="Active" />
                      <button
                        className="icon-btn"
                        onClick={() => {
                          const d = window.prompt(
                            'Edit guideline description',
                            r.desc
                          );
                          if (d !== null)
                            setRules(old =>
                              old.map(x =>
                                x.id === r.id ? { ...x, desc: d } : x
                              )
                            );
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <small>
                      {r.id} · {r.group}
                    </small>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                    <button
                      className="text-link"
                      onClick={() => notify('Guideline edit prompt opened')}
                    >
                      Edit rule <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <Note>
                Demo mode stores typed rules in this browser. Uploading PDF
                brand books requires production document ingestion and storage.
              </Note>
            </>
          )}
          {page === 'facts' && (
            <>
              <div className="toolbar">
                <div>
                  <b>Approved claims register</b>
                  <small>
                    Facts need a source, an owner and a review date.
                  </small>
                </div>
                <button
                  className="btn primary"
                  onClick={() => {
                    setTitle('');
                    setSource('');
                    setModal('fact');
                  }}
                >
                  <Plus size={15} /> Add approved fact
                </button>
              </div>
              <section className="panel">
                <table>
                  <thead>
                    <tr>
                      <th>CLAIM / FACT</th>
                      <th>SOURCE</th>
                      <th>STATUS</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {facts.map(f => (
                      <tr key={f.id}>
                        <td>
                          <b>{f.claim}</b>
                          <small className="block">{f.id}</small>
                        </td>
                        <td>{f.source}</td>
                        <td>
                          <Tag text={f.status} />
                        </td>
                        <td>
                          <button
                            className="text-link"
                            onClick={() =>
                              setFacts(old =>
                                old.map(x =>
                                  x.id === f.id
                                    ? {
                                        ...x,
                                        status:
                                          x.status === 'Approved'
                                            ? 'Needs evidence'
                                            : 'Approved',
                                      }
                                    : x
                                )
                              )
                            }
                          >
                            {f.status === 'Approved' ? 'Flag' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <Note>
                Example data only. Confirm source documents before using claims
                publicly.
              </Note>
            </>
          )}
          {page === 'assets' && (
            <>
              <div className="toolbar">
                <div>
                  <b>Approved brand assets</b>
                  <small>
                    Current logos, colour tokens and campaign imagery.
                  </small>
                </div>
                <button
                  className="btn primary"
                  onClick={() =>
                    notify('Asset upload requires production storage setup')
                  }
                >
                  <Plus size={15} /> Add asset
                </button>
              </div>
              <div className="cards two">
                <div className="panel asset">
                  <div className="logo-demo">
                    <ShieldCheck size={34} />
                    <b>brandguard</b>
                    <small>PRIMARY LOGO</small>
                  </div>
                  <h3>Primary logo</h3>
                  <small>SVG · Light backgrounds · Approved</small>
                </div>
                <div className="panel asset">
                  <div className="swatches">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <h3>Core colour palette</h3>
                  <small>5 colours · contrast check illustrative</small>
                </div>
                <div className="panel asset">
                  <img
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80"
                    alt="Team collaborating around a desk"
                  />
                  <h3>Team collaboration</h3>
                  <small>Approved photography · alt text included</small>
                </div>
                <div className="panel asset">
                  <img
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=700&q=80"
                    alt="Team planning ideas with sticky notes"
                  />
                  <h3>Planning together</h3>
                  <small>Editorial imagery · alt text included</small>
                </div>
              </div>
            </>
          )}
          {page === 'conflicts' && (
            <>
              <div className="banner warm">
                <AlertTriangle size={23} />
                <div>
                  <h2>Do your rules agree with each other?</h2>
                  <p>
                    Scan contradictory instructions, unclear wording and stale
                    policies.
                  </p>
                </div>
                <button
                  className="btn primary"
                  onClick={() =>
                    notify(
                      'Guideline scan complete · 2 potential conflicts found'
                    )
                  }
                >
                  <Sparkles size={14} /> Scan guidelines
                </button>
              </div>
              <section className="panel padded">
                <h3>Potential conflicts</h3>
                <FindingRow
                  title="“Always use US English” vs. “Localise regional campaigns”"
                  detail="The global rule does not define whether regional spelling exceptions take precedence."
                />
                <FindingRow
                  title="“Keep copy under 80 words” vs. “Include full legal disclaimer”"
                  detail="The word limit has no stated exception for mandatory legal copy."
                />
                <button
                  className="btn secondary"
                  onClick={() => {
                    setTitle('Resolve guideline conflict');
                    setDesc('Define which rule takes precedence and when.');
                    setModal('rule');
                  }}
                >
                  Draft resolution
                </button>
              </section>
            </>
          )}
          {page === 'audience' && (
            <div className="audience-layout">
              <section className="panel padded">
                <h3>Choose your audience</h3>
                <p>Contextual review, not a stereotype.</p>
                <label className="field-label">Audience / region</label>
                <select
                  className="select"
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                >
                  <option>Kerala · India</option>
                  <option>United States · Investor</option>
                  <option>United Kingdom · Customer</option>
                  <option>Japan · Enterprise buyer</option>
                  <option>Germany · Privacy-conscious customer</option>
                </select>
                <label className="field-label gap">Content to simulate</label>
                <textarea
                  className="editor-text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <button
                  className="btn primary full gap"
                  onClick={() =>                    notify(
                      'Audience prompts ready · review the contextual questions below'
                    )
                  }
                >
                  <Sparkles size={14} /> Simulate audience read
                </button>
              </section>
              <section className="panel padded">
                <div className="audience-title">
                  <span>
                    {audience.startsWith('Kerala')
                      ? '🇮🇳'
                      : audience.startsWith('United States')
                        ? '🇺🇸'
                        : audience.startsWith('United Kingdom')
                          ? '🇬🇧'
                          : audience.startsWith('Japan')
                            ? '🇯🇵'
                            : '🇩🇪'}
                  </span>
                  <div>
                    <small>SIMULATED PERSPECTIVE</small>
                    <h3>{audience}</h3>
                  </div>
                  <Tag text="Review suggested" />
                </div>
                <div className="metric">
                  <div>
                    <span>Contextual clarity</span>
                    <b>82 / 100</b>
                  </div>
                  <div className="progress">
                    <i style={{ width: '82%' }} />
                  </div>
                </div>
                <FindingRow
                  title="Likely to feel clear"
                  detail="Direct benefit-led wording is easy to follow and avoids unnecessary jargon."
                />
                <FindingRow
                  title="Check local context"
                  detail="Confirm date format, currency, idioms and region-specific claims before launch."
                />
                <FindingRow
                  title="Respect cultural nuance"
                  detail="Have a local reviewer check examples, imagery and humour. Do not assume one perspective represents a whole region."
                />
                <Note>
                  This is a perspective prompt, not a prediction of how every
                  person in a region will react.
                </Note>
              </section>
            </div>
          )}
          {page === 'routing' && (
            <>
              <div className="banner mint-banner">
                <ShieldCheck size={23} />
                <div>
                  <h2>Right review, right level of risk.</h2>
                  <p>
                    Low risk moves quickly; sensitive content never skips its
                    human gate.
                  </p>
                </div>
              </div>
              <div className="route-list">
                {[
                  [
                    'Low',
                    'Routine social content',
                    'Evergreen posts, approved descriptions, standard updates',
                    'Creator → Brand reviewer',
                    'Fast track',
                  ],
                  [
                    'Medium',
                    'Campaigns & comparative claims',
                    'Launch announcements, customer stories, performance language',
                    'Brand reviewer → Campaign owner',
                    'Standard review',
                  ],
                  [
                    'High',
                    'Legal, health, financial or executive claims',
                    'Guarantees, regulated claims, CEO quotes, pricing commitments',
                    'Brand lead → Legal / subject expert',
                    'Mandatory review',
                  ],
                ].map((x, i) => (
                  <div className="panel route-card" key={x[0]}>
                    <span className={'route-level r' + i}>{x[0]} risk</span>
                    <div>
                      <h3>{x[1]}</h3>
                      <p>{x[2]}</p>
                      <small>
                        <Users size={13} />
                        {x[3]}
                      </small>
                    </div>
                    <Tag text={x[4]} />
                    <button
                      className="text-link"
                      onClick={() =>
                        notify(
                          'Routing rule edit requires production permissions'
                        )
                      }
                    >
                      Edit <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <Note>
                Demo routing is illustrative. Production must enforce reviewer
                permissions server-side.
              </Note>
            </>
          )}
          {page === 'learning' && (
            <>
              <div className="banner warm">
                <Lightbulb size={23} />
                <div>
                  <h2>Make every override teach the system.</h2>
                  <p>
                    Dismissals become reviewable signals, not silent policy
                    changes.
                  </p>
                </div>
              </div>
              <section className="panel padded">
                <h3>Repeated overrides</h3>
                <p>Patterns to review before proposing an exception.</p>
                {overrides.map((o, i) => (
                  <div className="override" key={i}>
                    <span>{o.count}</span>
                    <div>
                      <b>{o.text}</b>
                      <p>Reason: {o.reason}</p>
                      <small>
                        {o.count} occurrence(s) · manager review needed
                      </small>
                    </div>
                    <button
                      className="btn secondary"
                      onClick={() => {
                        setRules(old => [
                          ...old,
                          {
                            id: 'EX-' + (old.length + 1),
                            title: 'Proposed exception: ' + o.text,
                            group: 'Draft exception',
                            desc: o.reason,
                          },
                        ]);
                        notify('Exception proposal added as a draft guideline');
                      }}
                    >
                      Propose exception
                    </button>
                  </div>
                ))}
              </section>
              <Note>
                The system never silently rewrites brand rules from reviewer
                behaviour. A manager must approve every exception.
              </Note>
            </>
          )}
          {page === 'insights' && (
            <>
              <div className="stats">
                {[
                  [
                    'On-brand score',
                    '94.6%',
                    '+3.2%',
                    'last 7 days',
                    'mint',
                    Target,
                  ],
                  [
                    'Repeat flags',
                    '18',
                    'Voice & tone',
                    'common pattern',
                    'peach',
                    AlertTriangle,
                  ],
                  [
                    'Human overrides',
                    String(overrides.length),
                    'Review signals',
                    'manager review',
                    'lavender',
                    Users,
                  ],
                  [
                    'Avg. review time',
                    '8.4 min',
                    '−18%',
                    'vs. last month',
                    'blue',
                    Clock3,
                  ],
                ].map(([a, b, c, d, e, I]) => (
                  <div className="stat" key={a}>
                    <div className="stat-label">
                      {a}
                      <span className={'stat-icon ' + e}>
                        <I size={16} />
                      </span>
                    </div>
                    <strong>{b}</strong>
                    <small className="stat-note">
                      <b>{c}</b> {d}
                    </small>
                  </div>
                ))}
              </div>
              <div className="columns">
                <section className="panel padded">
                  <h3>Common findings</h3>
                  {[
                    ['Voice & tone', 72],
                    ['Claims & evidence', 54],
                    ['Accessibility', 36],
                    ['Preferred terminology', 23],
                    ['Locale & formatting', 17],
                  ].map(x => (
                    <div className="bar-row" key={x[0]}>
                      <div>
                        <span>{x[0]}</span>
                        <b>{x[1]}</b>
                      </div>
                      <div className="progress">
                        <i style={{ width: (x[1] / 72) * 100 + '%' }} />
                      </div>
                    </div>
                  ))}
                </section>
                <section className="panel padded">
                  <h3>Guideline clarity signals</h3>
                  <div className="clarity">
                    <b>
                      76<span>/100</span>
                    </b>
                    <p>
                      Two guidelines may benefit from examples or explicit
                      exceptions.
                    </p>
                  </div>
                  <button
                    className="insight-row"
                    onClick={() => open('conflicts')}
                  >
                    <AlertTriangle size={16} />
                    <span>
                      <b>2 possible contradictions</b>
                      <small>Open conflict detector</small>
                    </span>
                    <ChevronRight size={15} />
                  </button>
                  <button
                    className="insight-row"
                    onClick={() => open('learning')}
                  >
                    <Lightbulb size={16} />
                    <span>
                      <b>{overrides.length} override patterns</b>
                      <small>Review learning signals</small>
                    </span>
                    <ChevronRight size={15} />
                  </button>
                </section>
              </div>
            </>
          )}
          {page === 'passports' && (
            <>
              <div className="banner">
                <Fingerprint size={24} />
                <div>
                  <h2>Proof behind every approval.</h2>
                  <p>
                    Trace checks, model disclosure, reviewers and timestamps.
                  </p>
                </div>
              </div>
              <DataTable
                items={items}
                passport
                openItem={i => {
                  setSelectedId(i.id);
                  setModal('passport');
                }}
              />
              <Note>
                Demo exports are JSON and not cryptographically tamper-proof.
                Production needs append-only storage and verifiable signatures.
              </Note>
            </>
          )}
          {page === 'history' && (
            <section className="panel padded">
              <h3>Revision timeline</h3>
              <p>Who changed what, and when.</p>
              {items
                .flatMap(i => i.history.map((h, n) => ({ i, h, n })))
                .reverse()
                .map((x, n) => (
                  <div className="history-row" key={x.i.id + '-' + n}>
                    <span className="history-icon">
                      <History size={14} />
                    </span>
                    <div>
                      <b>{x.h}</b>
                      <small>
                        {x.i.title} · BG-{x.i.id}
                      </small>
                    </div>
                    <span>
                      {n === 0 ? 'Just now' : n < 3 ? 'Today' : 'Earlier'}
                    </span>
                    <button
                      className="icon-btn"
                      onClick={() => {
                        setSelectedId(x.i.id);
                        setText(x.i.text);
                        open('review');
                      }}
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                ))}
            </section>
          )}
          {page === 'team' && (
            <>
              <div className="banner">
                <Users size={22} />
                <div>
                  <h2>People & permissions</h2>
                  <p>
                    Preview role-aware workflows. This selector does not enforce
                    access controls.
                  </p>
                </div>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option>Creator</option>
                  <option>Brand reviewer</option>
                  <option>Campaign manager</option>
                  <option>Legal reviewer</option>
                  <option>Workspace admin</option>
                </select>
              </div>
              <section className="panel">
                {[
                  ['VC', 'Vishnu C.', 'You · Workspace member', role],
                  ['MC', 'Maya Chen', 'maya@northstar.example', 'Creator'],
                  [
                    'JL',
                    'Jordan Lee',
                    'jordan@northstar.example',
                    'Brand reviewer',
                  ],
                  [
                    'SR',
                    'Sam Rivera',
                    'sam@northstar.example',
                    'Legal reviewer',
                  ],
                ].map(x => (
                  <div className="team-row" key={x[1]}>
                    <span className="avatar">{x[0]}</span>
                    <div>
                      <b>{x[1]}</b>
                      <small>{x[2]}</small>
                    </div>
                    <span>{x[3]}</span>
                    <Tag text="Active" />
                  </div>
                ))}
              </section>
              <Note>
                Production must enforce roles and access on the server, not in
                the browser.
              </Note>
            </>
          )}
          {page === 'integrations' && (
            <>
              <div className="banner mint-banner">
                <Zap size={23} />
                <div>
                  <h2>Your workflow, connected.</h2>
                  <p>
                    Connector catalogue. No external accounts are connected in
                    this demo.
                  </p>
                </div>
              </div>
              <div className="cards three">
                {[
                  ['Slack', 'Review notifications', 'S'],
                  ['Google Drive', 'Import brand books', 'G'],
                  ['Figma', 'Design and asset reviews', 'F'],
                  ['Notion', 'Living brand documentation', 'N'],
                  ['Adobe Creative Cloud', 'Creative assets', 'A'],
                  ['Contentful', 'Pre-publish checks', 'C'],
                ].map(x => (
                  <div className="panel integration" key={x[0]}>
                    <span>{x[2]}</span>
                    <h3>{x[0]}</h3>
                    <p>{x[1]}</p>
                    <button
                      className="btn secondary"
                      onClick={() =>
                        notify(x[0] + ' requires production connector setup')
                      }
                    >
                      Connect <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          {page === 'settings' && (
            <div className="panel settings">
              <h3>Workspace preferences</h3>
              <Setting
                label="Workspace name"
                detail="Shown across reviews and exports"
              >
                <input defaultValue="Northstar Studio" />
              </Setting>
              <Setting
                label="Default language"
                detail="Used for spelling and terminology checks"
              >
                <select defaultValue="English (US)">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Malayalam</option>
                  <option>German</option>
                </select>
              </Setting>
              <Setting
                label="AI service disclosure"
                detail="Disclose when an external AI service is used"
              >
                <input type="checkbox" defaultChecked />
              </Setting>
              <Setting
                label="Require human approval"
                detail="AI cannot publish or approve"
              >
                <input type="checkbox" defaultChecked />
              </Setting>
              <Setting
                label="Demo data retention"
                detail="Clear local demo content"
              >
                <button
                  className="btn danger"
                  onClick={() => setModal('reset')}
                >
                  Reset demo
                </button>
              </Setting>
              <button
                className="btn primary"
                onClick={() => notify('Settings saved for this demo session')}
              >
                Save preferences
              </button>
              <Note>
                Browser-local storage is not suitable for confidential
                production material. Add authentication, server-side access
                controls and a retention policy before real use.
              </Note>
            </div>
          )}
        </div>
        <footer>
          <div>
            <span className="footer-mark">
              <ShieldCheck size={13} />
            </span>{' '}
            BrandGuard <b>·</b> Consistency, with care.
          </div>
          <span>● All systems operational</span>
          <span>Demo workspace · v0.9.4</span>
        </footer>
      </main>      {modal && (
        <div className="backdrop" onClick={() => setModal('')}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <small>BRANDGUARD WORKSPACE</small>
                <h2>
                  {modal === 'new'
                    ? 'Create new content'
                    : modal === 'rule'
                      ? 'Add a brand guideline'
                      : modal === 'fact'
                        ? 'Add approved fact'
                        : modal === 'passport'
                          ? 'Content passport'
                          : 'Reset demo workspace'}
                </h2>
              </div>
              <button className="icon-btn" onClick={() => setModal('')}>
                <X size={17} />
              </button>
            </div>
            {modal === 'new' && (
              <>
                <label className="field-label">Content title</label>
                <input
                  className="modal-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Spring campaign email"
                />
                <label className="field-label gap">Content type</label>
                <select className="modal-input">
                  <option>Social post</option>
                  <option>Email</option>
                  <option>Blog</option>
                  <option>Ad</option>
                  <option>Document</option>
                </select>
                <div className="modal-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setModal('')}
                  >
                    Cancel
                  </button>
                  <button className="btn primary" onClick={create}>
                    Create draft <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
            {modal === 'rule' && (
              <>
                <label className="field-label">Guideline title</label>
                <input
                  className="modal-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Write a clear, actionable rule"
                />
                <label className="field-label gap">
                  What should creators know?
                </label>
                <textarea
                  className="modal-input modal-area"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Explain why it matters and give examples…"
                />
                <div className="modal-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setModal('')}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn primary"
                    disabled={!title.trim() || !desc.trim()}
                    onClick={() => {
                      setRules(old => [
                        ...old,
                        {
                          id: 'RULE-' + (old.length + 1),
                          title,
                          desc,
                          group: 'Custom guideline',
                        },
                      ]);
                      setModal('');
                      notify('Guideline saved locally');
                    }}
                  >
                    Save guideline
                  </button>
                </div>
              </>
            )}
            {modal === 'fact' && (
              <>
                <label className="field-label">Approved claim / fact</label>
                <input
                  className="modal-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Exact approved wording"
                />
                <label className="field-label gap">
                  Source / evidence reference
                </label>
                <input
                  className="modal-input"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="Document, owner, date or URL"
                />
                <div className="modal-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setModal('')}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn primary"
                    disabled={!title.trim() || !source.trim()}
                    onClick={() => {
                      setFacts(old => [
                        ...old,
                        {
                          id: 'F-' + (104 + old.length),
                          claim: title,
                          source,
                          status: 'Needs evidence',
                        },
                      ]);
                      setModal('');
                      notify('Fact added · evidence review required');
                    }}
                  >
                    Add for review
                  </button>
                </div>
              </>
            )}
            {modal === 'passport' && (
              <>
                <div className="passport-detail">
                  <Fingerprint size={27} />
                  <b>BG-{item.id}</b>
                  <p>{item.title}</p>
                  <dl>
                    <dt>Created by</dt>
                    <dd>{item.owner}</dd>
                    <dt>Status</dt>
                    <dd>{item.status}</dd>
                    <dt>Checks recorded</dt>
                    <dd>{item.issues.length + 9}</dd>
                    <dt>AI disclosure</dt>
                    <dd>AI-assisted review; local fallback noted when used.</dd>
                    <dt>History</dt>
                    <dd>{item.history.join(' · ')}</dd>
                  </dl>
                </div>
                <div className="modal-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setModal('')}
                  >
                    Close
                  </button>
                  <button className="btn primary" onClick={exportPassport}>
                    <Download size={14} /> Export passport
                  </button>
                </div>
              </>
            )}
            {modal === 'reset' && (
              <>
                <p>
                  This clears demo items, rules and locally saved browser data.
                  This action cannot be undone.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setModal('')}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => {
                      setItems(seedItems);
                      setRules(seedRules);
                      setFacts([]);
                      setOverrides([]);
                      [
                        'bg-items',
                        'bg-rules',
                        'bg-facts',
                        'bg-overrides',
                      ].forEach(k => localStorage.removeItem(k));
                      setModal('');
                      open('overview');
                      notify('Demo data reset');
                    }}
                  >
                    Reset workspace
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function Tag({ text }) {
  return <span className={'tag tag-' + slug(text)}>{text}</span>;
}
function Note({ children }) {
  return (
    <div className="note">
      <CircleHelp size={15} />
      <span>{children}</span>
    </div>
  );
}
function FindingRow({ title, detail }) {
  return (
    <div className="finding-row">
      <AlertTriangle size={16} />
      <div>
        <b>{title}</b>
        <p>{detail}</p>
      </div>
    </div>
  );
}
function DataTable({ items, openItem, passport = false }) {
  return (
    <section className="panel table-wrap">
      <table>
        <thead>
          <tr>
            <th>{passport ? 'PASSPORT' : 'CONTENT'}</th>
            <th>OWNER</th>
            <th>RISK</th>
            <th>STATUS</th>
            <th>UPDATED</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} onClick={() => openItem(i)}>
              <td>
                <div className="content-cell">
                  <span className="file-icon">
                    {passport ? (
                      <Fingerprint size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </span>
                  <div>
                    <b>{passport ? 'BG-' + i.id : i.title}</b>
                    <small>
                      {passport ? i.title : i.type + ' · BG-' + i.id}
                    </small>
                  </div>
                </div>
              </td>
              <td>{i.owner}</td>
              <td>
                <Tag text={i.risk} />
              </td>
              <td>
                <Tag text={i.status} />
              </td>
              <td>Just now</td>
              <td>
                <ChevronRight size={15} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
function Setting({ label, detail, children }) {
  return (
    <label className="setting-row">
      <span>
        <b>{label}</b>
        <small>{detail}</small>
      </span>
      {children}
    </label>
  );
}
export default App;
