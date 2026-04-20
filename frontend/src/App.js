import { useState, useEffect, useRef, useMemo } from 'react';
import '@/App.css';
import '@/arcane.css';
import axios from 'axios';
import LandingPage from '@/components/LandingPage';
import AnalysisPage from '@/components/AnalysisPage';
import ResultsPage from '@/components/ResultsPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function BrandSigil() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <polygon points="20,3 34,12 34,28 20,37 6,28 6,12" stroke="#5ee0f0" strokeWidth="1" />
      <polygon points="20,9 29,14 29,26 20,31 11,26 11,14" stroke="#d4b86a" strokeWidth="0.8" opacity="0.7" />
      <circle cx="20" cy="20" r="3" fill="#5ee0f0" />
      <line x1="20" y1="3" x2="20" y2="9" stroke="#5ee0f0" strokeWidth="0.8" />
      <line x1="34" y1="12" x2="29" y2="14" stroke="#5ee0f0" strokeWidth="0.8" />
      <line x1="34" y1="28" x2="29" y2="26" stroke="#5ee0f0" strokeWidth="0.8" />
      <line x1="20" y1="37" x2="20" y2="31" stroke="#5ee0f0" strokeWidth="0.8" />
      <line x1="6" y1="28" x2="11" y2="26" stroke="#5ee0f0" strokeWidth="0.8" />
      <line x1="6" y1="12" x2="11" y2="14" stroke="#5ee0f0" strokeWidth="0.8" />
    </svg>
  );
}

function Particles({ count = 35 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const dur = 8 + Math.random() * 14;
      const delay = -Math.random() * dur;
      const scale = 0.4 + Math.random() * 1.2;
      let color = 'var(--cyan)';
      const r = Math.random();
      if (r > 0.85) color = 'var(--violet)';
      else if (r > 0.55) color = 'var(--gold)';
      return {
        left: Math.random() * 100,
        duration: dur,
        delay,
        scale,
        color,
      };
    });
  }, [count]);

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `scale(${p.scale})`,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

function Chrome({ currentView, onNavigate }) {
  return (
    <header className="chrome">
      <div className="brand">
        <div className="brand-sigil">
          <BrandSigil />
        </div>
        <div className="brand-name">
          Runic<span className="accent">◆</span>Resonance
        </div>
      </div>
      <nav className="chrome-nav">
        <a
          className={currentView === 'landing' ? 'active' : ''}
          onClick={() => onNavigate && onNavigate('landing')}
        >
          Divine
        </a>
        <a className={currentView === 'analyzing' ? 'active' : ''}>Ritual</a>
        <a className={currentView === 'results' ? 'active' : ''}>Reading</a>
        <a>Codex</a>
        <a>Archive</a>
      </nav>
      <div className="chrome-right">
        <span>
          <span className="status-dot"></span>ORACLE ONLINE
        </span>
        <span>v14.23.1</span>
      </div>
    </header>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (riotId, region) => {
    setIsLoading(true);
    setError(null);
    setCurrentView('analyzing');

    try {
      const response = await axios.post(`${API}/analyze`, {
        riot_id: riotId,
        region: region,
        match_count: 20,
      });

      setAnalysisData(response.data);
      setCurrentView('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to divine the spirit. Verify your Riot ID (GameName#TAG) and realm.'
      );
      setCurrentView('landing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentView('landing');
    setAnalysisData(null);
    setError(null);
  };

  const handleNavigate = (view) => {
    if (view === 'landing') handleReset();
  };

  return (
    <div className="App">
      <div className="atmosphere" aria-hidden="true"></div>
      <Particles count={35} />
      <Chrome currentView={currentView} onNavigate={handleNavigate} />

      <main className="stage">
        {currentView === 'landing' && (
          <div className="view-fade" key="landing">
            <LandingPage onAnalyze={handleAnalyze} error={error} isLoading={isLoading} />
          </div>
        )}

        {currentView === 'analyzing' && (
          <div className="view-fade" key="analyzing">
            <AnalysisPage />
          </div>
        )}

        {currentView === 'results' && analysisData && (
          <div className="view-fade" key="results">
            <ResultsPage data={analysisData} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
