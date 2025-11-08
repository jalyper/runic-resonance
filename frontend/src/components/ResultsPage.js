import { useState } from 'react';
import { Sparkles, Trophy, Target, Swords, Shield, RefreshCw, Share2 } from 'lucide-react';

export default function ResultsPage({ data, onReset }) {
  const [showAllTraits, setShowAllTraits] = useState(false);

  const topTraits = data.traits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const getScoreColor = (score) => {
    if (score >= 8) return 'from-purple-500 to-pink-500';
    if (score >= 6) return 'from-blue-500 to-purple-500';
    if (score >= 4) return 'from-cyan-500 to-blue-500';
    return 'from-slate-500 to-cyan-500';
  };

  const getResonanceColor = (strength) => {
    if (strength >= 80) return 'text-purple-400';
    if (strength >= 60) return 'text-pink-400';
    if (strength >= 40) return 'text-blue-400';
    return 'text-cyan-400';
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h1 className="text-3xl font-bold text-purple-300">Runic Resonance Reading</h1>
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <p className="text-lg text-purple-200">For Summoner: <span className="font-bold">{data.summoner_name}</span></p>
        </div>

        {/* Spirit Champion Card */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-purple-500/30">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-purple-300 uppercase tracking-wider">Your Spirit Champion</p>
              <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {data.spirit_champion.champion}
              </h2>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="space-y-1">
                <p className="text-purple-300/70">Resonance Strength</p>
                <p className={`text-3xl font-bold ${getResonanceColor(data.spirit_champion.resonance_strength)}`}>
                  {data.spirit_champion.resonance_strength.toFixed(0)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-purple-300/70">Slots Filled</p>
                <p className="text-3xl font-bold text-purple-400">
                  {data.spirit_champion.slots_filled}/3
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-purple-300/70">Matching Traits</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {data.spirit_champion.matching_traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-sm border border-purple-500/30"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-purple-500/20">
          <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span>The Runes Speak</span>
          </h3>
          <div className="prose prose-invert prose-purple max-w-none">
            <p className="text-purple-100/90 leading-relaxed whitespace-pre-wrap">
              {data.narrative}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.win_rate.toFixed(1)}%</p>
            <p className="text-sm text-purple-300/70">Win Rate</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.kda.toFixed(2)}</p>
            <p className="text-sm text-purple-300/70">KDA Ratio</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 text-center">
            <Swords className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.games_analyzed}</p>
            <p className="text-sm text-purple-300/70">Games Analyzed</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.summoner_level}</p>
            <p className="text-sm text-purple-300/70">Summoner Level</p>
          </div>
        </div>

        {/* Top 3 Traits */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-purple-300 text-center">Your Dominant Traits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topTraits.map((trait, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 space-y-4"
              >
                <div className="text-center">
                  <h4 className="text-xl font-bold text-purple-300">{trait.name}</h4>
                  <p className="text-3xl font-bold bg-gradient-to-r ${getScoreColor(trait.score)} bg-clip-text text-transparent mt-2">
                    {trait.score}/10
                  </p>
                </div>
                <p className="text-sm text-purple-200/80 text-center">{trait.description}</p>
                <p className="text-xs text-purple-300/60 italic text-center">{trait.lore}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All Traits (Toggle) */}
        <div className="space-y-4">
          <button
            onClick={() => setShowAllTraits(!showAllTraits)}
            className="w-full py-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl border border-purple-500/20 text-purple-300 font-semibold transition-all"
          >
            {showAllTraits ? 'Hide' : 'Show'} All Traits
          </button>

          {showAllTraits && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.traits.map((trait, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/30 backdrop-blur-xl rounded-lg p-4 border border-purple-500/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-300">{trait.name}</h4>
                    <span className="text-lg font-bold text-purple-400">{trait.score}/10</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(trait.score)}`}
                      style={{ width: `${(trait.score / 10) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-200/70">{trait.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Analyze Another Summoner</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-purple-300/50 space-y-1">
          <p>Analysis ID: {data.analysis_id}</p>
          <p>✨ May the Runes guide your path, Summoner ✨</p>
        </div>
      </div>
    </div>
  );
}