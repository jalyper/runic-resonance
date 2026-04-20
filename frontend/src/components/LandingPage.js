import { useState } from 'react';

const REGIONS = [
  { value: 'na', label: 'North America', suffix: 'Serathos' },
  { value: 'euw', label: 'Europe West', suffix: 'Ylenn' },
  { value: 'eune', label: 'Europe Nordic & East', suffix: 'Dravenmoor' },
  { value: 'kr', label: 'Korea', suffix: 'Hanshin' },
  { value: 'jp', label: 'Japan', suffix: 'Aorizu' },
  { value: 'br', label: 'Brazil', suffix: 'Verdanthi' },
  { value: 'las', label: 'Latin America South', suffix: '' },
  { value: 'lan', label: 'Latin America North', suffix: '' },
  { value: 'oce', label: 'Oceania', suffix: 'Vaelum' },
  { value: 'tr', label: 'Turkey', suffix: 'Kaldeia' },
  { value: 'ru', label: 'Russia', suffix: 'Voralt' },
];

function GreatSigil() {
  return (
    <div className="rune-stack relative w-full aspect-square" style={{ maxWidth: 520 }}>
      <div className="rune-ring r1">
        <svg viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="195" stroke="#5ee0f0" strokeWidth="0.5" fill="none" opacity="0.5" />
          <circle cx="200" cy="200" r="190" stroke="#5ee0f0" strokeWidth="1" fill="none" strokeDasharray="2 6" opacity="0.8" />
          <circle cx="200" cy="200" r="180" stroke="#d4b86a" strokeWidth="0.5" fill="none" opacity="0.4" />
          <g fontFamily="Cinzel" fontSize="16" fill="#5ee0f0" textAnchor="middle">
            <text x="200" y="25">ᚠ</text>
            <text x="296" y="44" transform="rotate(30 296 44)">ᚢ</text>
            <text x="368" y="115" transform="rotate(60 368 115)">ᚦ</text>
            <text x="390" y="207" transform="rotate(90 390 207)">ᚨ</text>
            <text x="368" y="295" transform="rotate(120 368 295)">ᚱ</text>
            <text x="296" y="365" transform="rotate(150 296 365)">ᚲ</text>
            <text x="200" y="390" transform="rotate(180 200 390)">ᚷ</text>
            <text x="104" y="365" transform="rotate(210 104 365)">ᚹ</text>
            <text x="32" y="295" transform="rotate(240 32 295)">ᚺ</text>
            <text x="10" y="207" transform="rotate(270 10 207)">ᚾ</text>
            <text x="32" y="115" transform="rotate(300 32 115)">ᛁ</text>
            <text x="104" y="44" transform="rotate(330 104 44)">ᛃ</text>
          </g>
        </svg>
      </div>
      <div className="rune-ring r2">
        <svg viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="195" stroke="#8b7ff5" strokeWidth="0.8" fill="none" opacity="0.4" />
          <g stroke="#8b7ff5" strokeWidth="1" opacity="0.7">
            <line x1="200" y1="5" x2="200" y2="20" />
            <line x1="200" y1="380" x2="200" y2="395" />
            <line x1="5" y1="200" x2="20" y2="200" />
            <line x1="380" y1="200" x2="395" y2="200" />
            <line x1="62" y1="62" x2="72" y2="72" />
            <line x1="338" y1="62" x2="328" y2="72" />
            <line x1="62" y1="338" x2="72" y2="328" />
            <line x1="338" y1="338" x2="328" y2="328" />
          </g>
          <polygon points="200,20 356,110 356,290 200,380 44,290 44,110" stroke="#5ee0f0" strokeWidth="1" fill="none" opacity="0.8" />
        </svg>
      </div>
      <div className="rune-ring r3">
        <svg viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="195" stroke="#d4b86a" strokeWidth="1" fill="none" opacity="0.3" />
          <g stroke="#d4b86a" strokeWidth="0.6" opacity="0.6" fill="none">
            <polygon points="200,40 338,120 338,280 200,360 62,280 62,120" />
            <polygon points="200,80 304,140 304,260 200,320 96,260 96,140" />
          </g>
        </svg>
      </div>
      <div className="rune-ring r4">
        <svg viewBox="0 0 400 400">
          <g stroke="#5ee0f0" strokeWidth="1.2" fill="none" opacity="0.9">
            <path d="M200,30 L260,170 L390,180 L290,260 L330,390 L200,310 L70,390 L110,260 L10,180 L140,170 Z" />
          </g>
          <circle cx="200" cy="200" r="80" stroke="#5ee0f0" strokeWidth="0.5" fill="none" opacity="0.5" />
          <circle cx="200" cy="200" r="60" stroke="#d4b86a" strokeWidth="0.5" fill="none" opacity="0.6" />
        </svg>
      </div>
      <div className="rune-core">
        <svg viewBox="0 0 100 100" style={{ width: '80%', height: '80%' }}>
          <g fill="none" stroke="#5ee0f0" strokeWidth="1.5" strokeLinecap="round">
            <path d="M50 15 L50 85" />
            <path d="M50 30 L35 45" />
            <path d="M50 45 L65 60" />
            <path d="M50 60 L35 75" />
            <circle cx="50" cy="50" r="32" opacity="0.4" />
          </g>
          <circle cx="50" cy="50" r="6" fill="#fff" opacity="0.8" />
        </svg>
      </div>
      <div
        className="font-mono text-[10px] uppercase text-ink-ghost absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ bottom: -10, letterSpacing: '0.3em' }}
      >
        GREAT SIGIL OF RESONANCE · ENGRAVED 1204 A.E.
      </div>
    </div>
  );
}

export default function LandingPage({ onAnalyze, error, isLoading }) {
  const [riotId, setRiotId] = useState('');
  const [region, setRegion] = useState('na');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (riotId.trim() && !isLoading) {
      onAnalyze(riotId.trim(), region);
    }
  };

  return (
    <section className="relative">
      <div
        className="grid gap-[60px] items-center mx-auto"
        style={{
          gridTemplateColumns: '1.1fr 1fr',
          padding: '40px 80px 80px',
          maxWidth: 1440,
          minHeight: 'calc(100vh - 72px)',
        }}
      >
        {/* Left column */}
        <div className="relative">
          <div
            className="font-mono uppercase mb-6 flex items-center gap-3 text-cyan"
            style={{ fontSize: 12, letterSpacing: '0.3em' }}
          >
            <span
              className="inline-block"
              style={{
                width: 32,
                height: 1,
                background: 'linear-gradient(90deg, transparent, #5ee0f0)',
              }}
            />
            Rite of the Resonant · MMXXVI
          </div>

          <h1 className="h-display">
            Divine the<br />
            <span className="line-2" data-text="Champion Within">Champion Within</span>
          </h1>

          <p
            className="font-sans font-light text-ink-dim"
            style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 520, margin: '0 0 12px' }}
          >
            Every summoner leaves a signature on the Rift — a pattern of courage, calculation,
            and chaos. The Runes read this signature and reveal the ancient spirit whose essence
            resonates most with yours.
          </p>
          <p
            className="font-sans font-light italic text-ink-ghost"
            style={{ fontSize: 14, maxWidth: 520, margin: '0 0 40px' }}
          >
            Speak your true name, and we shall consult the stones.
          </p>

          {/* Ornate divider */}
          <div
            className="flex items-center gap-3.5 text-gold-dim"
            style={{ margin: '32px 0' }}
          >
            <span
              className="flex-1"
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, #8a7640, transparent)',
              }}
            />
            <span
              className="text-gold"
              style={{ fontSize: 12, letterSpacing: '0.3em' }}
            >
              ◆ RITE OF BINDING ◆
            </span>
            <span
              className="flex-1"
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, #8a7640, transparent)',
              }}
            />
          </div>

          <form className="divination-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label
                className="font-sans font-semibold uppercase text-cyan flex items-center gap-2"
                style={{ fontSize: 11, letterSpacing: '0.3em', marginBottom: 8 }}
              >
                <span className="font-mono text-gold-dim" style={{ fontSize: 10 }}>01</span>
                Summoner's True Name
              </label>
              <input
                className="form-input"
                type="text"
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="GameName#TAG — your mark upon the Rift"
                required
              />
              <div
                className="font-mono text-ink-ghost"
                style={{ fontSize: 10, marginTop: 6, letterSpacing: '0.05em' }}
              >
                ▸ Format: GameName#TagLine — inscribed exactly as it appears in the archives
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                className="font-sans font-semibold uppercase text-cyan flex items-center gap-2"
                style={{ fontSize: 11, letterSpacing: '0.3em', marginBottom: 8 }}
              >
                <span className="font-mono text-gold-dim" style={{ fontSize: 10 }}>02</span>
                Realm of Origin
              </label>
              <select
                className="form-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}{r.suffix ? ` — ${r.suffix}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div
                className="font-sans"
                style={{
                  padding: '12px 16px',
                  background: 'rgba(224, 89, 122, 0.08)',
                  border: '1px solid rgba(224, 89, 122, 0.3)',
                  color: '#e0597a',
                  fontSize: 14,
                  marginBottom: 20,
                  letterSpacing: '0.02em',
                }}
              >
                ◈ {error}
              </div>
            )}

            <button className="invoke-btn" type="submit" disabled={isLoading}>
              {isLoading ? 'Divining…' : 'Begin the Divination'}
            </button>

            <div
              className="flex flex-wrap gap-4 font-mono text-ink-ghost"
              style={{ marginTop: 24, fontSize: 10, letterSpacing: '0.08em' }}
            >
              <span><span className="text-gold-dim mr-1">◈</span>Reads last 20 ranked trials</span>
              <span><span className="text-gold-dim mr-1">◈</span>Channeled through Bedrock sages</span>
              <span><span className="text-gold-dim mr-1">◈</span>No account bound</span>
            </div>
          </form>
        </div>

        {/* Right column */}
        <div className="relative aspect-square grid place-items-center">
          <GreatSigil />
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          section > div { grid-template-columns: 1fr !important; padding: 20px !important; }
          section > div > div:last-child { max-width: 420px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
