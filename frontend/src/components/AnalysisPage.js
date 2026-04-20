import { useEffect, useState } from 'react';

const RITUAL_STEPS = [
  'Opening the gate to the Rift…',
  'Gathering echoes from twenty trials…',
  'Tracing the pattern of your blade…',
  'Weighing the weight of your shields…',
  'Consulting the Obelisks of Kaldera…',
  'Drawing the alignment of the stars…',
  'Binding the spirit to your name…',
];

function RitualSigil() {
  return (
    <div
      className="ritual-sigil relative mx-auto"
      style={{ width: 340, height: 340, marginBottom: 48 }}
    >
      <div className="rune-ring r1">
        <svg viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="190" stroke="#5ee0f0" strokeWidth="1" fill="none" strokeDasharray="3 8" />
          <g fontFamily="Cinzel" fontSize="18" fill="#5ee0f0" textAnchor="middle">
            <text x="200" y="30">ᚠ</text>
            <text x="370" y="207" transform="rotate(90 370 207)">ᚨ</text>
            <text x="200" y="385" transform="rotate(180 200 385)">ᚷ</text>
            <text x="30" y="207" transform="rotate(270 30 207)">ᚾ</text>
          </g>
        </svg>
      </div>
      <div className="rune-ring r2">
        <svg viewBox="0 0 400 400">
          <polygon points="200,20 360,110 360,290 200,380 40,290 40,110" stroke="#8b7ff5" strokeWidth="1" fill="none" />
          <circle cx="200" cy="20" r="4" fill="#8b7ff5" />
          <circle cx="360" cy="110" r="4" fill="#8b7ff5" />
          <circle cx="360" cy="290" r="4" fill="#8b7ff5" />
          <circle cx="200" cy="380" r="4" fill="#8b7ff5" />
          <circle cx="40" cy="290" r="4" fill="#8b7ff5" />
          <circle cx="40" cy="110" r="4" fill="#8b7ff5" />
        </svg>
      </div>
      <div className="rune-ring r3">
        <svg viewBox="0 0 400 400">
          <g stroke="#d4b86a" strokeWidth="0.8" fill="none">
            <path
              d="M200,40 L260,170 L390,180 L290,260 L330,390 L200,310 L70,390 L110,260 L10,180 L140,170 Z"
              opacity="0.6"
            />
          </g>
        </svg>
      </div>
      <div className="rune-ring r4">
        <svg viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="80" stroke="#5ee0f0" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="rune-core">
        <svg viewBox="0 0 100 100" style={{ width: '85%', height: '85%' }}>
          <g fill="none" stroke="#5ee0f0" strokeWidth="2" strokeLinecap="round">
            <path d="M50 12 L50 88 M50 30 L32 48 M50 45 L68 63 M50 60 L32 78" />
          </g>
          <circle cx="50" cy="50" r="8" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Cycle through steps; loops back after the last so visuals keep moving
    // until the API promise resolves and App.js swaps views.
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % RITUAL_STEPS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="grid place-items-center"
      style={{ minHeight: 'calc(100vh - 72px)', padding: 40 }}
    >
      <div className="text-center relative" style={{ maxWidth: 640 }}>
        <RitualSigil />

        <h1
          className="font-display text-ink uppercase"
          style={{
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: '0.1em',
            margin: '0 0 20px',
          }}
        >
          The Runes Are <span className="text-cyan">Speaking</span>
        </h1>

        <div
          className="font-sans italic text-ink-dim"
          style={{
            fontSize: 18,
            letterSpacing: '0.1em',
            margin: '0 0 32px',
            minHeight: 28,
          }}
        >
          "{RITUAL_STEPS[currentStep]}"
        </div>

        <div className="flex justify-center gap-2.5" style={{ marginBottom: 24 }}>
          {RITUAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`prune ${
                i === currentStep ? 'active' : i < currentStep ? 'done' : ''
              }`}
            />
          ))}
        </div>

        <div
          className="font-mono text-ink-ghost uppercase"
          style={{ fontSize: 11, letterSpacing: '0.15em' }}
        >
          · CHANNEL STABLE · LATENCY 18–30s ·
        </div>
      </div>
    </section>
  );
}
