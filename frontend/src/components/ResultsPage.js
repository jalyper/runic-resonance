import { useState, useMemo } from 'react';

const DDRAGON_VERSION = '14.23.1';
const DDRAGON_NAME_OVERRIDES = {
  LeBlanc: 'Leblanc',
  Mundo: 'DrMundo',
  Wukong: 'MonkeyKing',
  'Nunu & Willump': 'Nunu',
  'Renata Glasc': 'Renata',
};
const getChampionIcon = (championName) => {
  const ddragonId = DDRAGON_NAME_OVERRIDES[championName] ?? championName.replace(/[^a-zA-Z]/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${ddragonId}.png`;
};
const getTraitImage = (traitName) => {
  const slug = traitName
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/traits/${slug}.png`;
};
const getTierClass = (score) => {
  if (score >= 8) return 'tier-hi';
  if (score >= 6) return 'tier-mid';
  return 'tier-default';
};
const getTierLabel = (score) => {
  if (score >= 8) return 'APEX';
  if (score >= 6) return 'RESONANT';
  return 'STEADY';
};
const romanize = (n) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || String(n);

function SectionHead({ numeral, title }) {
  return (
    <div className="flex items-center gap-5" style={{ margin: '56px 0 24px' }}>
      <h3
        className="font-display uppercase text-ink m-0 flex items-baseline"
        style={{ fontSize: 22, fontWeight: 500, letterSpacing: '0.2em' }}
      >
        <span
          className="font-mono text-cyan"
          style={{ fontSize: 14, marginRight: 14, letterSpacing: '0.1em' }}
        >
          ◆ {numeral}
        </span>
        {title}
      </h3>
      <div
        className="flex-1"
        style={{ height: 1, background: 'linear-gradient(90deg, #253655, transparent)' }}
      />
    </div>
  );
}

function HexGlyph({ stroke = '#5ee0f0', variant = 0 }) {
  // Variant 0: star + center
  // Variant 1: X cross
  // Variant 2: concentric circles
  const paths = [
    <g key={0}>
      <path d="M20 10 L20 30 M12 20 L28 20" />
      <circle cx="20" cy="20" r="3" fill={stroke} />
    </g>,
    <g key={1}>
      <path d="M10 14 L30 26 M30 14 L10 26" />
    </g>,
    <g key={2}>
      <circle cx="20" cy="20" r="7" />
      <circle cx="20" cy="20" r="3" fill={stroke} />
    </g>,
  ];
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth="1.5">
      <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" />
      {paths[variant % paths.length]}
    </svg>
  );
}

function Slot({ filled, trait, glyphIndex = 0, stroke = '#5ee0f0', mini = false, title }) {
  return (
    <div
      className={`slot ${filled ? 'filled' : 'empty'} ${mini ? 'slot-mini' : ''}`}
      title={title}
    >
      <div className="glyph">
        {filled ? (
          trait ? (
            <img
              src={getTraitImage(trait.name)}
              alt={trait.name}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <HexGlyph stroke={stroke} variant={glyphIndex} />
          )
        ) : (
          <svg viewBox="0 0 40 40" fill="none" stroke="#5a6d8f" strokeWidth="1.2">
            <rect x="14" y="18" width="12" height="10" rx="1" />
            <path d="M17 18 V14 a3 3 0 0 1 6 0 V18" />
          </svg>
        )}
        {filled && trait && (
          <HexGlyph stroke={stroke} variant={glyphIndex} />
        )}
      </div>
    </div>
  );
}

function ChampPortrait({ name, large = false }) {
  return (
    <div className="champ-portrait">
      <img
        src={getChampionIcon(name)}
        alt={name}
        onError={(e) => {
          e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/29.png';
        }}
      />
      {large && <div className="name-stripe">◆ BOUND SPIRIT ◆</div>}
    </div>
  );
}

function PrimaryPanel({ primary }) {
  const resonance = Math.round(primary.resonance_strength);
  const filled = primary.slots_filled || 0;
  const strokeColors = ['#5ee0f0', '#d4b86a', '#8b7ff5'];
  return (
    <div className="primary-panel">
      {/* Portrait side */}
      <div className="champ-portrait-wrap">
        <div className="rune-ring outer">
          <svg viewBox="0 0 400 400">
            <circle
              cx="200" cy="200" r="195"
              stroke="#d4b86a" strokeWidth="1" fill="none"
              strokeDasharray="4 10" opacity="0.7"
            />
            <g fontFamily="Cinzel" fontSize="14" fill="#d4b86a" textAnchor="middle" opacity="0.8">
              <text x="200" y="22">ᚦ</text>
              <text x="378" y="207" transform="rotate(90 378 207)">ᚨ</text>
              <text x="200" y="388" transform="rotate(180 200 388)">ᚱ</text>
              <text x="22" y="207" transform="rotate(270 22 207)">ᛞ</text>
            </g>
          </svg>
        </div>
        <div className="rune-ring">
          <svg viewBox="0 0 400 400">
            <polygon
              points="200,30 350,115 350,285 200,370 50,285 50,115"
              stroke="#5ee0f0" strokeWidth="1" fill="none" opacity="0.8"
            />
          </svg>
        </div>
        <ChampPortrait name={primary.champion} large />
      </div>

      {/* Verdict side */}
      <div className="flex flex-col justify-center relative" style={{ zIndex: 1 }}>
        <div
          className="font-mono uppercase text-gold"
          style={{ fontSize: 11, letterSpacing: '0.3em', marginBottom: 12 }}
        >
          ◈ BOUND SPIRIT · RESONANCE {resonance}%
        </div>
        <h2
          className="font-display uppercase m-0"
          style={{
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '0.02em',
            color: '#fff',
            textShadow: '0 0 40px rgba(94,224,240,0.3)',
            marginBottom: 8,
          }}
        >
          The {primary.champion}
        </h2>
        <div
          className="font-display italic text-gold"
          style={{ fontSize: 22, letterSpacing: '0.08em', marginBottom: 28 }}
        >
          of the Resonant Path
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid #1a2742',
            borderBottom: '1px solid #1a2742',
            padding: '20px 0',
            marginBottom: 24,
          }}
        >
          <div style={{ padding: '0 18px 0 0', borderRight: '1px solid #1a2742' }}>
            <div
              className="font-mono uppercase text-ink-ghost"
              style={{ fontSize: 10, letterSpacing: '0.25em', marginBottom: 6 }}
            >
              Resonance
            </div>
            <div
              className="font-display text-cyan"
              style={{ fontSize: 32, fontWeight: 600, lineHeight: 1 }}
            >
              {resonance}
              <span className="font-sans text-ink-dim" style={{ fontSize: 13, marginLeft: 4 }}>%</span>
            </div>
          </div>
          <div style={{ padding: '0 18px', borderRight: '1px solid #1a2742' }}>
            <div
              className="font-mono uppercase text-ink-ghost"
              style={{ fontSize: 10, letterSpacing: '0.25em', marginBottom: 6 }}
            >
              Trials Bound
            </div>
            <div
              className="font-display text-cyan"
              style={{ fontSize: 32, fontWeight: 600, lineHeight: 1 }}
            >
              {primary.games_played || 0}
              <span className="font-sans text-ink-dim" style={{ fontSize: 13, marginLeft: 4 }}>/ 20</span>
            </div>
          </div>
          <div style={{ padding: '0 0 0 18px' }}>
            <div
              className="font-mono uppercase text-ink-ghost"
              style={{ fontSize: 10, letterSpacing: '0.25em', marginBottom: 6 }}
            >
              Harmonics
            </div>
            <div
              className="font-display text-cyan"
              style={{ fontSize: 32, fontWeight: 600, lineHeight: 1 }}
            >
              {filled}
              <span className="font-sans text-ink-dim" style={{ fontSize: 13, marginLeft: 4 }}>/ 3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 8 }}>
          <div
            className="font-mono uppercase text-ink-ghost"
            style={{ fontSize: 10, letterSpacing: '0.25em', width: 100 }}
          >
            HARMONIC SLOTS
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => {
              const trait = primary.trait_details?.[i];
              const isFilled = i < filled;
              return (
                <Slot
                  key={i}
                  filled={isFilled}
                  trait={isFilled ? trait : null}
                  glyphIndex={i}
                  stroke={strokeColors[i]}
                  title={isFilled && trait ? `${trait.name} (${trait.score}/10)` : 'Empty Slot'}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RunnerUp({ champion, rank }) {
  const resonance = Math.round(champion.resonance_strength);
  const filled = champion.slots_filled || 0;
  const strokes = ['#5ee0f0', '#d4b86a', '#8b7ff5'];
  return (
    <div className="runnerup">
      <div
        className="font-mono uppercase text-gold absolute"
        style={{ top: 16, right: 16, fontSize: 10, letterSpacing: '0.2em' }}
      >
        ◈ {romanize(rank + 1)} · {resonance}%
      </div>
      <ChampPortrait name={champion.champion} />
      <div>
        <h3
          className="font-display uppercase m-0"
          style={{ fontSize: 28, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4, color: '#cfe3ff' }}
        >
          {champion.champion}
        </h3>
        <div
          className="font-display italic text-gold-dim"
          style={{ fontSize: 14, marginBottom: 14 }}
        >
          of the Concordant Path
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-ink-dim" style={{ fontSize: 11 }}>
          <span>RESONANCE <b className="text-cyan font-medium">{resonance}%</b></span>
          <span>TRIALS <b className="text-cyan font-medium">{champion.games_played || 0}</b></span>
          <span>PLAY RATE <b className="text-cyan font-medium">{(champion.play_rate || 0).toFixed(0)}%</b></span>
        </div>
        <div className="flex gap-1.5" style={{ marginTop: 14 }}>
          {[0, 1, 2].map((i) => {
            const trait = champion.trait_details?.[i];
            const isFilled = i < filled;
            return (
              <Slot
                key={i}
                filled={isFilled}
                trait={isFilled ? trait : null}
                glyphIndex={i}
                stroke={strokes[i]}
                mini
                title={isFilled && trait ? `${trait.name} (${trait.score}/10)` : 'Empty'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LedgerIcon({ variant }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 };
  if (variant === 'star')
    return (
      <svg {...common}>
        <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" />
      </svg>
    );
  if (variant === 'target')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  if (variant === 'grid')
    return (
      <svg {...common}>
        <path d="M6 3 L6 21 M18 3 L18 21 M3 6 L21 6 M3 18 L21 18" />
        <path d="M12 3 L12 21" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 2 L20 6 L20 13 Q20 18 12 22 Q4 18 4 13 L4 6 Z" />
      <path d="M9 12 L11 14 L15 10" />
    </svg>
  );
}

function StatCell({ icon, value, unit, label, sub }) {
  return (
    <div
      className="relative"
      style={{
        padding: '28px 24px',
        borderRight: '1px solid #1a2742',
        background: 'linear-gradient(180deg, rgba(14,22,41,0.4), rgba(9,14,28,0.6))',
      }}
    >
      <div className="text-cyan" style={{ width: 28, height: 28, marginBottom: 18 }}>
        <LedgerIcon variant={icon} />
      </div>
      <div
        className="font-display"
        style={{ fontSize: 40, fontWeight: 600, color: '#cfe3ff', lineHeight: 1, marginBottom: 8 }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 20, color: '#5a6d8f', marginLeft: 4 }}>{unit}</span>
        )}
      </div>
      <div
        className="font-mono uppercase text-ink-ghost"
        style={{ fontSize: 10, letterSpacing: '0.25em' }}
      >
        {label}
      </div>
      {sub && (
        <div className="font-sans text-cyan-deep" style={{ fontSize: 13, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function TraitCard({ trait, index }) {
  const tier = getTierClass(trait.score);
  const tierLabel = getTierLabel(trait.score);
  return (
    <div className={`trait-card ${tier}`}>
      <div className="flex items-center gap-4" style={{ marginBottom: 20 }}>
        <div className="trait-glyph">
          <img
            src={getTraitImage(trait.name)}
            alt={trait.name}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div>
          <div
            className="font-display uppercase text-ink"
            style={{ fontSize: 22, fontWeight: 600, letterSpacing: '0.06em', margin: '0 0 2px' }}
          >
            {trait.name}
          </div>
          <div
            className="font-mono uppercase text-ink-ghost"
            style={{ fontSize: 10, letterSpacing: '0.2em' }}
          >
            HARMONIC {romanize(index + 1)} · {tierLabel}
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2" style={{ marginBottom: 14 }}>
        <span
          className="font-display"
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 0.9,
            color:
              tier === 'tier-hi' ? '#d4b86a' : tier === 'tier-mid' ? '#8b7ff5' : '#5ee0f0',
          }}
        >
          {trait.score}
        </span>
        <span className="font-display text-ink-ghost" style={{ fontSize: 20 }}>
          / 10
        </span>
      </div>

      <div className="trait-bar">
        <div className="fill" style={{ width: `${trait.score * 10}%` }} />
        <div className="tick" style={{ left: '25%' }} />
        <div className="tick" style={{ left: '50%' }} />
        <div className="tick" style={{ left: '75%' }} />
      </div>

      <div
        className="font-sans text-ink-dim"
        style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}
      >
        {trait.description}
      </div>
      {trait.lore && (
        <div
          className="font-display italic text-ink-ghost"
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            paddingTop: 14,
            borderTop: '1px solid #1a2742',
          }}
        >
          "{trait.lore}"
        </div>
      )}
      {trait.data_source && (
        <div
          className="font-mono text-ink-ghost flex gap-1.5"
          style={{ fontSize: 10, letterSpacing: '0.05em', marginTop: 10 }}
        >
          <span className="text-cyan-deep">▸</span>
          <span>{trait.data_source}</span>
        </div>
      )}
    </div>
  );
}

function AllTraitsTable({ traits }) {
  return (
    <div className="all-traits-table">
      {traits.map((t, i) => (
        <div key={i} className="tt-row">
          <div className="tt-g">
            <svg viewBox="0 0 40 40" fill="none" stroke="#5ee0f0" strokeWidth="1.2">
              <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" />
              <circle cx="20" cy="20" r="3" fill="#5ee0f0" />
            </svg>
          </div>
          <div>
            <div
              className="font-display uppercase text-ink"
              style={{ fontSize: 14, letterSpacing: '0.06em', marginBottom: 6 }}
            >
              {t.name}
            </div>
            <div className="tt-br">
              <div className="f" style={{ width: `${t.score * 10}%` }} />
            </div>
          </div>
          <div
            className="font-display text-cyan"
            style={{ fontSize: 20, fontWeight: 600 }}
          >
            {t.score}
            <span className="text-ink-ghost" style={{ fontSize: 12, marginLeft: 2 }}>/10</span>
          </div>
          <div
            className="font-mono text-ink-ghost"
            style={{ fontSize: 10, letterSpacing: '0.05em' }}
          >
            {t.data_source || ''}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage({ data, onReset }) {
  const [showAllTraits, setShowAllTraits] = useState(false);

  const topTraits = useMemo(
    () => [...data.traits].sort((a, b) => b.score - a.score).slice(0, 3),
    [data.traits]
  );
  const sortedTraits = useMemo(
    () => [...data.traits].sort((a, b) => b.score - a.score),
    [data.traits]
  );

  const summonerName = data.summoner_name || 'Summoner';
  const regionLabel = (data.region || '').toUpperCase();
  const timestamp = new Date().toUTCString().replace(/^.*?(\d{2}:\d{2}).*$/, '$1 UTC');
  const shortId = (data.analysis_id || '').slice(0, 8).toUpperCase();

  const kdaSub =
    data.kills != null && data.deaths != null && data.assists != null
      ? `K ${data.kills.toFixed(1)} · D ${data.deaths.toFixed(1)} · A ${data.assists.toFixed(1)}`
      : null;

  return (
    <section
      className="relative mx-auto"
      style={{ padding: '40px 80px 80px', maxWidth: 1440 }}
    >
      {/* Header */}
      <div
        className="flex items-end justify-between flex-wrap gap-10"
        style={{ marginBottom: 56, paddingBottom: 28, borderBottom: '1px solid #1a2742' }}
      >
        <div>
          <div
            className="font-mono text-cyan flex items-center gap-2.5"
            style={{ fontSize: 13, letterSpacing: '0.12em' }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6, height: 6,
                background: '#5ee0f0',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 10px #5ee0f0',
              }}
            />
            SUMMONER · {summonerName.toUpperCase()} · {regionLabel}
          </div>
          <h2
            className="font-display uppercase text-ink"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              margin: '8px 0 0',
            }}
          >
            Your Resonance Reading
          </h2>
        </div>
        <div
          className="text-right font-mono text-ink-ghost"
          style={{ fontSize: 11, letterSpacing: '0.1em', lineHeight: 1.8 }}
        >
          <div>ANALYSIS · #RR-{shortId}</div>
          <div>LAST {data.games_analyzed || 20} RANKED TRIALS</div>
          <div>CONSULTED {timestamp}</div>
        </div>
      </div>

      {/* §I Spirit Binding */}
      <SectionHead numeral="I" title="SPIRIT BINDING" />
      <PrimaryPanel primary={data.spirit_champion.primary} />

      {/* §II Concordant Spirits */}
      {data.spirit_champion.runner_ups && data.spirit_champion.runner_ups.length > 0 && (
        <>
          <SectionHead numeral="II" title="CONCORDANT SPIRITS" />
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              marginBottom: 56,
            }}
          >
            {data.spirit_champion.runner_ups.map((c, i) => (
              <RunnerUp key={i} champion={c} rank={i + 1} />
            ))}
          </div>
        </>
      )}

      {/* Oracle narrative */}
      <div className="oracle">
        <div
          className="font-mono uppercase text-gold flex items-center gap-2.5"
          style={{ fontSize: 11, letterSpacing: '0.3em', marginBottom: 14, justifyContent: 'center' }}
        >
          <span style={{ flex: '0 0 24px', height: 1, background: '#8a7640' }} />
          THE ORACLE SPEAKS
          <span style={{ flex: '0 0 24px', height: 1, background: '#8a7640' }} />
        </div>
        <div className="oracle-text">
          <p className="lead">{data.narrative}</p>
        </div>
      </div>

      {/* §III Combat Ledger */}
      <SectionHead numeral="III" title="COMBAT LEDGER" />
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          marginBottom: 56,
          border: '1px solid #1a2742',
        }}
      >
        <StatCell
          icon="star"
          value={data.win_rate?.toFixed(1)}
          unit="%"
          label="VICTORY RITE"
          sub={data.wins != null ? `${data.wins}W · ${data.losses}L` : null}
        />
        <StatCell
          icon="target"
          value={data.kda?.toFixed(2)}
          label="KDA HARMONIC"
          sub={kdaSub}
        />
        <StatCell
          icon="grid"
          value={data.games_analyzed}
          label="TRIALS READ"
          sub="Solo/Duo · Ranked"
        />
        <StatCell
          icon="shield"
          value={`LVL ${data.summoner_level}`}
          label="SUMMONER RANK"
          sub={data.rank || null}
        />
      </div>

      {/* §IV Dominant Harmonics */}
      <SectionHead numeral="IV" title="DOMINANT HARMONICS" />
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          marginBottom: 40,
        }}
      >
        {topTraits.map((t, i) => (
          <TraitCard key={i} trait={t} index={i} />
        ))}
      </div>

      {/* Unveil all */}
      <button
        className="toggle-all"
        onClick={() => setShowAllTraits((v) => !v)}
        style={{ marginBottom: 40 }}
      >
        {showAllTraits ? '▲ HIDE THE REMAINING HARMONICS' : '▼ UNVEIL ALL TEN HARMONICS'}
      </button>
      {showAllTraits && (
        <div style={{ marginBottom: 40 }}>
          <AllTraitsTable traits={sortedTraits} />
        </div>
      )}

      {/* CTAs */}
      <div className="flex justify-center gap-4 flex-wrap" style={{ margin: '48px 0 24px' }}>
        <button className="btn-ghost" onClick={onReset}>
          VIEW IN ARCHIVE
        </button>
        <button className="btn-primary" onClick={onReset}>
          ◆ CONSULT ANOTHER SUMMONER
        </button>
      </div>

      {/* Footer */}
      <div
        className="text-center font-mono text-ink-ghost uppercase"
        style={{ fontSize: 10, letterSpacing: '0.2em', lineHeight: 1.8 }}
      >
        <div className="text-gold-dim" style={{ letterSpacing: '0.3em' }}>◆ ◆ ◆</div>
        <div>May the runes guide your path, summoner</div>
        <div style={{ marginTop: 6, opacity: 0.5 }}>
          ANALYSIS · #RR-{shortId}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          section { padding: 20px !important; }
        }
        @media (max-width: 900px) {
          section .grid[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
