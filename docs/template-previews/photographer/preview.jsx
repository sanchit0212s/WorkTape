/* Preview variants as React components (babel-compiled).
   Uses mock data from mock-data.js. Each variant reads the same data shape. */

const { useState, useEffect, useRef } = React;

// ── Contract helpers (mirror the real ones) ──
const bioText = (p) => p.ai_bio || (p.bio_bullets?.length ? p.bio_bullets.join(' ') : null);
const desc = (pr) => pr.ai_description || pr.description || null;
const heroHeadline = (p) => p.custom_headline || p.display_name;

// ── Social icon renderer (lucide-alike via inline SVG) ──
const SocialIcon = ({ k, size = 16 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (k) {
    case 'instagram': return (<svg {...common}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>);
    case 'twitter':   return (<svg {...common}><path d="M4 4l7 8-7 8h2l6-7 5 7h5l-8-9 7-7h-2l-6 6-5-6z"/></svg>);
    case 'linkedin':  return (<svg {...common}><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v7M7 7.5v.01M11 17v-4a2 2 0 014 0v4M11 10v7"/></svg>);
    case 'github':    return (<svg {...common}><path d="M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1-.1-1.4-.5-2 3-.3 6-1.5 6-6.5a5 5 0 00-1.4-3.5 4.6 4.6 0 00-.1-3.5s-1.1-.3-3.5 1.3a12 12 0 00-6 0C7.1 1.7 6 2 6 2a4.6 4.6 0 00-.1 3.5A5 5 0 004.5 9c0 5 3 6.2 6 6.5-.4.6-.5 1-.5 2V21"/></svg>);
    case 'dribbble':  return (<svg {...common}><circle cx="12" cy="12" r="10"/><path d="M8 2.5C12 6 15.5 11 17.5 21.5M22 12c-8 0-14 2-18 6M2.5 8C6 8 14 8.5 20 4.5"/></svg>);
    case 'behance':   return (<svg {...common}><path d="M2 5h6a3 3 0 010 6H2zM2 11h7a3 3 0 010 6H2zM15 6h5M13 14h8a3 3 0 00-6-4 3 3 0 00-2 4z"/></svg>);
    case 'youtube':   return (<svg {...common}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>);
    case 'website':   return (<svg {...common}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>);
    case 'email':     return (<svg {...common}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>);
    default:          return (<svg {...common}><circle cx="12" cy="12" r="10"/></svg>);
  }
};

const socialLabel = (k) => ({
  instagram: 'Instagram', twitter: 'X', linkedin: 'LinkedIn', github: 'GitHub',
  dribbble: 'Dribbble', behance: 'Behance', youtube: 'YouTube', website: 'Website', email: 'Email'
}[k] || k);

const WTBadge = ({ dark }) => (
  <a href="https://worktape.com" target="_blank" rel="noopener" className={dark ? 'wt-badge-dark' : 'wt-badge-dark'}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
    Built with Worktape
  </a>
);

// ════════════════════════════════════════════════════════════════
// V1 — EDITORIAL
// ════════════════════════════════════════════════════════════════
function V1Editorial({ data }) {
  const { portfolio, projects } = data;
  const bio = bioText(portfolio);
  const socialKeys = Object.keys(portfolio.social_links);

  // Assign a grid position per image, cycling through patterns so long/short projects both work
  const gridSpan = (i, total) => {
    const patterns = [
      ['v1-big', 'v1-sm'],                   // 2 images
      ['v1-med', 'v1-med', 'v1-big', 'v1-sm'], // 4+
      ['v1-big', 'v1-sm', 'v1-med', 'v1-med', 'v1-sm', 'v1-big'],
    ];
    const p = total <= 2 ? patterns[0] : total <= 4 ? patterns[1] : patterns[2];
    return p[i % p.length];
  };

  return (
    <div className="v1">
      <nav className="v1-nav">
        <div className="v1-name">{portfolio.display_name}</div>
        <div>
          <a href="#work">Work</a>
          {bio && <a href="#about">About</a>}
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="v1-masthead">
        <div>
          <div className="v1-eyebrow">Photographer — Folio MMXXVI</div>
          <h1 className="v1-title">{heroHeadline(portfolio)}<em>.</em></h1>
        </div>
        <div>
          <p className="v1-lede">{portfolio.tagline}</p>
          <div className="v1-meta">
            <div>Projects<b>{projects.length}</b></div>
            <div>Since<b>{(portfolio.published_at || '2024').slice(0,4)}</b></div>
          </div>
        </div>
      </header>

      {bio && (
        <section id="about" className="v1-bio">{bio}</section>
      )}

      <main id="work" className="v1-projects">
        {projects.map((pr, i) => (
          <article className="v1-proj" key={pr.id}>
            <header className="v1-proj-head">
              <span className="v1-proj-num">№ {String(i + 1).padStart(2, '0')}</span>
              <h2 className="v1-proj-title">{pr.title}</h2>
              {desc(pr) && <p className="v1-proj-caption">{desc(pr)}</p>}
            </header>
            <div className="v1-proj-grid">
              {pr.images.map((im, ii) => (
                <img key={im.id}
                     className={gridSpan(ii, pr.images.length)}
                     src={im.url} alt={im.alt_text || pr.title}
                     loading={i === 0 && ii === 0 ? 'eager' : 'lazy'} />
              ))}
            </div>
          </article>
        ))}
      </main>

      <footer id="contact" className="v1-footer">
        <div>© {portfolio.display_name} — All rights reserved</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {socialKeys.map(k => <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)}</a>)}
          <WTBadge />
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// V2 — GALLERY (Swiss minimal)
// ════════════════════════════════════════════════════════════════
function V2Gallery({ data }) {
  const { portfolio, projects } = data;
  const bio = bioText(portfolio);
  const socialKeys = Object.keys(portfolio.social_links);
  const wideEvery = 4; // make every 4th project full-width, visually rhythmic

  return (
    <div className="v2">
      <div className="v2-shell">
        <div className="v2-top">
          <div className="v2-name">{portfolio.display_name}</div>
          <div className="v2-mid">{portfolio.tagline}</div>
          <div className="v2-right">
            {socialKeys.slice(0, 4).map(k => (
              <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)}</a>
            ))}
          </div>
        </div>

        <section className="v2-hero">
          <h1 className="v2-h1">{heroHeadline(portfolio)}</h1>
          <p className="v2-tag">{portfolio.tagline}. Selected works {(portfolio.published_at || '2020').slice(0,4)}—{new Date().getFullYear()}.</p>
        </section>

        <div className="v2-index-title">
          <b>Index</b> <span>Selected work</span>
          <span className="v2-count">{String(projects.length).padStart(2,'0')} projects</span>
        </div>

        <main className="v2-projects">
          {projects.map((pr, i) => (
            <article className={`v2-project ${(i + 1) % wideEvery === 0 ? 'wide' : ''}`} key={pr.id}>
              <img className="v2-cover" src={pr.images[0]?.url} alt={pr.images[0]?.alt_text || pr.title} loading={i === 0 ? 'eager' : 'lazy'} />
              <div className="v2-caption">
                <span className="v2-t">{pr.title}</span>
                <span className="v2-n">{String(i + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span>
              </div>
              {desc(pr) && <p className="v2-desc">{desc(pr)}</p>}
            </article>
          ))}
        </main>

        {(bio || portfolio.bio_bullets?.length > 0) && (
          <section className="v2-about">
            <h3>About</h3>
            <div>
              {bio && <p>{bio}</p>}
              {portfolio.bio_bullets?.length > 0 && (
                <ul>
                  {portfolio.bio_bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          </section>
        )}

        <footer className="v2-footer">
          <div>© {portfolio.display_name}, {new Date().getFullYear()}</div>
          <WTBadge />
        </footer>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// V3 — BRUTALIST (mono, high contrast, index-style)
// ════════════════════════════════════════════════════════════════
function V3Brutalist({ data }) {
  const { portfolio, projects } = data;
  const bio = bioText(portfolio);
  const socialKeys = Object.keys(portfolio.social_links);
  const [openIdx, setOpenIdx] = useState(0);

  const name = heroHeadline(portfolio);
  // Split name and add one accent-marked word
  const parts = name.split(' ');
  const last = parts.pop();

  return (
    <div className="v3">
      <div className="v3-bar">
        <div><span className="v3-dot" />Worktape / Photographer</div>
        <div style={{ textAlign: 'center', color: '#666' }}>{portfolio.slug && `/${portfolio.slug}`}</div>
        <div className="v3-meta">
          {socialKeys.slice(0, 4).map(k => <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)}</a>)}
        </div>
      </div>

      <header className="v3-hero">
        <div className="v3-hero-label">
          <span>No. {String(projects.length).padStart(3,'0')}</span>
          <span>— Index of works, {new Date().getFullYear()}</span>
        </div>
        <h1 className="v3-h1">
          {parts.join(' ')} <span className="v3-mark">{last}</span>
        </h1>
        <p className="v3-sub">{portfolio.tagline}.</p>
      </header>

      <section className="v3-index">
        <div className="v3-index-head">
          <span>№</span><span>Title</span><span>Description</span><span>Frames</span><span>View</span>
        </div>
        {projects.map((pr, i) => (
          <div key={pr.id} className="v3-row" onClick={() => setOpenIdx(i)}>
            <span className="v3-n">{String(i + 1).padStart(2,'0')}</span>
            <span className="v3-t">{pr.title}</span>
            <span className="v3-d">{desc(pr) || '—'}</span>
            <span className="v3-n">{pr.images.length}</span>
            <span>{openIdx === i ? '[OPEN]' : '[OPEN →]'}</span>
          </div>
        ))}
      </section>

      {projects[openIdx] && (
        <section className="v3-slab">
          <h3>{String(openIdx + 1).padStart(2,'0')} — {projects[openIdx].title}</h3>
          <div className="v3-slab-grid">
            {projects[openIdx].images.slice(0, 8).map((im, i) => (
              <img key={im.id} src={im.url} alt={im.alt_text || projects[openIdx].title} loading={i === 0 ? 'eager' : 'lazy'} />
            ))}
          </div>
        </section>
      )}

      {bio && (
        <section className="v3-about">
          <h3>About.</h3>
          <p>{bio}</p>
        </section>
      )}

      <footer className="v3-foot">
        <div>
          <p className="v3-huge">Hire.</p>
          <div style={{ marginTop: 20 }}>
            {socialKeys.map(k => (
              <a key={k} href={portfolio.social_links[k]} style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor', marginRight: 16, fontSize: 13 }}>
                {socialLabel(k)} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="v3-colophon" style={{ textAlign: 'right' }}>
          © {portfolio.display_name}<br />
          Set in Archivo Black & JetBrains Mono<br />
          <div style={{ marginTop: 14 }}><WTBadge /></div>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// V4 — CINEMATIC (dark, full-bleed hero, horizontal-scroll projects)
// ════════════════════════════════════════════════════════════════
function V4Cinematic({ data }) {
  const { portfolio, projects } = data;
  const bio = bioText(portfolio);
  const socialKeys = Object.keys(portfolio.social_links);
  const hero = projects[0]?.images[0];

  const headline = heroHeadline(portfolio);
  // Italicize first word, normal rest — gives the serif display a rhythm
  const [firstWord, ...restWords] = headline.split(' ');

  return (
    <div className="v4">
      <nav className="v4-nav">
        <div>{portfolio.display_name}</div>
        <div>
          {socialKeys.slice(0, 3).map(k => (
            <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)}</a>
          ))}
        </div>
      </nav>

      <section className="v4-hero">
        {hero && <img className="v4-hero-img" src={hero.url} alt="" loading="eager" fetchpriority="high" />}
        <div className="v4-hero-inner">
          <div className="v4-hero-eyebrow">Photography — {(portfolio.published_at || '2020').slice(0,4)}–{new Date().getFullYear()}</div>
          <h1 className="v4-h1">
            {firstWord} <em>{restWords.join(' ')}</em>
          </h1>
          <div className="v4-hero-meta">
            <div>Based<b>{portfolio.tagline.split(',').pop().trim()}</b></div>
            <div>Projects<b>{String(projects.length).padStart(2,'0')}</b></div>
            <div>Frames<b>{projects.reduce((s, p) => s + p.images.length, 0)}</b></div>
          </div>
        </div>
        <div className="v4-hero-scroll">Scroll — Selected works</div>
      </section>

      <main>
        {projects.map((pr, i) => (
          <section className="v4-project" key={pr.id}>
            <header className="v4-project-head">
              <div className="v4-project-num">Project {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</div>
              <h2 className="v4-project-title">{pr.title}</h2>
              {desc(pr) && <p className="v4-project-desc">{desc(pr)}</p>}
            </header>
            <div className="v4-project-track">
              {pr.images.map((im, ii) => (
                <img key={im.id} src={im.url} alt={im.alt_text || pr.title} loading="lazy" />
              ))}
            </div>
          </section>
        ))}
      </main>

      {bio && (
        <section className="v4-about">
          <div className="v4-about-label">About</div>
          <p>{bio}</p>
          {portfolio.bio_bullets?.length > 0 && (
            <ul className="v4-bullets">
              {portfolio.bio_bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </section>
      )}

      <footer className="v4-foot">
        <div>© {portfolio.display_name}</div>
        <div>
          {socialKeys.map(k => <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)}</a>)}
          <span style={{ marginLeft: 28 }}><WTBadge /></span>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// V5 — ZINE (warm playful, paper textures, tape)
// ════════════════════════════════════════════════════════════════
function V5Zine({ data }) {
  const { portfolio, projects } = data;
  const bio = bioText(portfolio);
  const socialKeys = Object.keys(portfolio.social_links);
  const polaroid = projects[0]?.images[0];
  const headline = heroHeadline(portfolio);
  const words = headline.split(' ');
  // Rotate through sizes to create visual rhythm; works for 1 or 15
  const sizes = ['sz-l', 'sz-s', 'sz-m', 'sz-m', 'sz-s', 'sz-l', 'sz-m', 'sz-m', 'sz-s', 'sz-l', 'sz-s', 'sz-m', 'sz-l', 'sz-s', 'sz-m'];

  return (
    <div className="v5">
      <div className="v5-top">
        <div className="v5-stamp">{portfolio.display_name}</div>
        <div className="v5-links">
          {socialKeys.slice(0, 4).map(k => (
            <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)}</a>
          ))}
        </div>
      </div>

      <header className="v5-hero">
        <span className="v5-hello">hello, I'm</span>
        <h1 className="v5-h1">
          {words.map((w, i) => (
            <React.Fragment key={i}>
              {i === 0 ? <span className="v5-wavy">{w}</span> : (i === words.length - 1 ? <em className="v5-green">{w}</em> : w)}
              {i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </h1>
        <p className="v5-tag">{portfolio.tagline}. Making pictures since {(portfolio.published_at || '2020').slice(0,4)}.</p>

        {polaroid && (
          <figure className="v5-snap">
            <div className="v5-tape" />
            <div className="v5-polaroid">
              <img src={polaroid.url} alt="" loading="eager" />
              <figcaption>from “{projects[0].title}”</figcaption>
            </div>
          </figure>
        )}
      </header>

      <div className="v5-section-head">
        <h2>Some things <em>I made</em>.</h2>
        <span className="v5-count">↓ {projects.length} {projects.length === 1 ? 'thing' : 'things'}</span>
      </div>

      <main className="v5-projects">
        {projects.map((pr, i) => (
          <article key={pr.id} className={`v5-card ${sizes[i % sizes.length]}`}>
            <img src={pr.images[0]?.url} alt={pr.images[0]?.alt_text || pr.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="v5-label">
              <span className="v5-t">{pr.title}</span>
              <span className="v5-n">no. {i + 1}</span>
            </div>
            {desc(pr) && <p className="v5-d">{desc(pr)}</p>}
          </article>
        ))}
      </main>

      {bio && (
        <section className="v5-about">
          <div className="v5-about-card">
            <h3>about me</h3>
            <p>{bio}</p>
          </div>
          <div className="v5-about-side">
            {portfolio.bio_bullets?.slice(0, 4).map((b, i) => (
              <span key={i} className="v5-pill">★ <b>{b}</b></span>
            ))}
          </div>
        </section>
      )}

      <footer className="v5-foot">
        <div className="v5-huge">say hi!</div>
        <div className="v5-links2">
          {socialKeys.map(k => (
            <a key={k} href={portfolio.social_links[k]}>{socialLabel(k)} →</a>
          ))}
        </div>
        <div style={{ marginTop: 28 }}><WTBadge /></div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Preview shell
// ════════════════════════════════════════════════════════════════
const VARIANTS = [
  { id: 'v1', name: '1. Editorial',  Cmp: V1Editorial  },
  { id: 'v2', name: '2. Gallery',    Cmp: V2Gallery    },
  { id: 'v3', name: '3. Brutalist',  Cmp: V3Brutalist  },
  { id: 'v4', name: '4. Cinematic',  Cmp: V4Cinematic  },
  { id: 'v5', name: '5. Zine',       Cmp: V5Zine       },
];

function App() {
  const [variant, setVariant] = useState(() => localStorage.getItem('wt-v') || 'v1');
  const [who, setWho]         = useState(() => localStorage.getItem('wt-u') || 'full');

  useEffect(() => { localStorage.setItem('wt-v', variant); }, [variant]);
  useEffect(() => { localStorage.setItem('wt-u', who);     }, [who]);

  const V = VARIANTS.find(v => v.id === variant);
  const data = who === 'full' ? window.MockData.fullUser : window.MockData.minimalUser;

  return (
    <>
      <div className="pv-chrome">
        <div className="pv-brand">WorkTape <span>/ photographer templates / preview</span></div>
        <div className="pv-group">
          {VARIANTS.map(v => (
            <button key={v.id}
                    className={variant === v.id ? 'active' : ''}
                    onClick={() => setVariant(v.id)}>
              {v.name}
            </button>
          ))}
        </div>
        <div className="pv-group">
          <button className={who === 'full' ? 'active' : ''} onClick={() => setWho('full')}>full user (15)</button>
          <button className={who === 'minimal' ? 'active' : ''} onClick={() => setWho('minimal')}>minimal user (1)</button>
        </div>
        <div className="pv-meta">{data.portfolio.display_name} · {data.projects.length} project{data.projects.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="pv-stage">
        <V.Cmp data={data} />
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
