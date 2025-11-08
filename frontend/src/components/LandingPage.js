import { useState } from 'react';
import { Sparkles, Search, Globe, Info } from 'lucide-react';

const REGIONS = [
  { value: 'na', label: 'North America' },
  { value: 'euw', label: 'Europe West' },
  { value: 'eune', label: 'Europe Nordic & East' },
  { value: 'kr', label: 'Korea' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
  { value: 'las', label: 'Latin America South' },
  { value: 'lan', label: 'Latin America North' },
  { value: 'oce', label: 'Oceania' },
  { value: 'tr', label: 'Turkey' },
  { value: 'ru', label: 'Russia' }
];

export default function LandingPage({ onAnalyze, onShowAbout, error }) {
  const [riotId, setRiotId] = useState('');
  const [region, setRegion] = useState('na');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (riotId.trim()) {
      onAnalyze(riotId.trim(), region);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-6xl font-title font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent uppercase">
              Runic Resonance
            </h1>
            <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <p className="text-xl text-purple-200 font-light">
            Discover which champion's spirit resonates within you
          </p>
          
          <p className="text-sm text-purple-300/70 max-w-md mx-auto">
            Through the ancient Runes of Runeterra, we divine your true essence by analyzing your playstyle across the Rift
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Riot ID Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300 flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Riot ID</span>
              </label>
              <input
                type="text"
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="GameName#TAG (e.g., Jalyper#piano)"
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-purple-300/50">
                Use your Riot ID format: GameName#TagLine
              </p>
            </div>

            {/* Region Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300 flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Region</span>
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value} className="bg-slate-900">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Reveal My Spirit Champion</span>
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-purple-300/60 space-y-2">
          <p>Analyzes your last 50 ranked games</p>
          <p>Powered by AWS Bedrock AI & Riot Games API</p>
          <p>Built for the Rift Rewind Hackathon</p>
          
          {/* About Button */}
          <div className="pt-4">
            <button
              onClick={onShowAbout}
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">How does this work?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}