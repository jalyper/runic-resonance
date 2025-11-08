import { useState } from 'react';
import { Sparkles, Trophy, Target, Swords, Shield, RefreshCw, Lock, Unlock, Info } from 'lucide-react';

// Riot Data Dragon CDN for champion images
const DDRAGON_VERSION = '14.23.1';
const getChampionIcon = (championName) => {
  // Handle champion names with special characters
  const cleanName = championName.replace(/[^a-zA-Z]/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${cleanName}.png`;
};

export default function ResultsPage({ data, onReset }) {
  const [showAllTraits, setShowAllTraits] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState('primary');

  const topTraits = data.traits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-purple-300';
    if (score >= 6) return 'text-blue-300';
    if (score >= 4) return 'text-cyan-300';
    return 'text-slate-300';
  };

  const getScoreGradient = (score) => {
    if (score >= 8) return 'from-purple-500 to-pink-500';
    if (score >= 6) return 'from-blue-500 to-purple-500';
    if (score >= 4) return 'from-cyan-500 to-blue-500';
    return 'from-slate-500 to-cyan-500';
  };

  const getResonanceColor = (strength) => {
    if (strength >= 80) return 'text-purple-300';
    if (strength >= 60) return 'text-pink-300';
    if (strength >= 40) return 'text-blue-300';
    return 'text-cyan-300';
  };

  const ChampionCard = ({ championData, isPrimary = false }) => (
    <div className={`bg-gradient-to-br ${
      isPrimary ? 'from-purple-900/50 to-blue-900/50 border-2 border-purple-500/50' : 'from-slate-800/50 to-slate-900/50 border border-purple-500/20'
    } backdrop-blur-xl rounded-2xl p-6 shadow-xl transition-all hover:scale-[1.02]`}>
      <div className="space-y-4">
        {/* Rank Badge */}
        {!isPrimary && (
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm border border-purple-500/30">
              #{championData.rank} Runner-Up
            </span>
          </div>
        )}

        {/* Champion Image */}
        <div className="relative mx-auto w-32 h-32">
          <img
            src={getChampionIcon(championData.champion)}
            alt={championData.champion}
            className="w-full h-full rounded-full border-4 border-purple-500/50 shadow-lg"
            onError={(e) => {
              e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/29.png';
            }}
          />
          <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2 border-2 border-purple-400">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Champion Name */}
        <h3 className={`text-center font-bold ${
          isPrimary ? 'text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent' : 'text-2xl text-purple-300'
        }`}>
          {championData.champion}
        </h3>

        {/* Resonance Stats */}
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="text-center">
            <p className="text-purple-300/70 text-xs">Resonance</p>
            <p className={`text-2xl font-bold ${getResonanceColor(championData.resonance_strength)}`}>
              {championData.resonance_strength.toFixed(0)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-purple-300/70 text-xs">Slots</p>
            <p className="text-2xl font-bold text-purple-300">
              {championData.slots_filled}/3
            </p>
          </div>
          <div className="text-center">
            <p className="text-purple-300/70 text-xs">Games</p>
            <p className="text-2xl font-bold text-blue-300">
              {championData.games_played}
            </p>
          </div>
        </div>
        
        {/* Play Rate */}
        {championData.games_played > 0 && (
          <div className="text-center">
            <p className="text-sm text-purple-300">
              <span className="text-blue-300 font-semibold">{championData.play_rate.toFixed(1)}%</span> of your games
            </p>
          </div>
        )}

        {/* Slot Visualization */}
        <div className="space-y-2">
          <p className="text-xs text-purple-300/70 text-center font-semibold">Trait Resonance Slots</p>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((slotIndex) => {
              const trait = championData.trait_details[slotIndex];
              const isFilled = slotIndex < championData.slots_filled;
              
              return (
                <div
                  key={slotIndex}
                  className={`group relative aspect-square rounded-lg border-2 ${
                    isFilled
                      ? 'bg-purple-500/20 border-purple-400/50'
                      : 'bg-slate-800/50 border-slate-600/30'
                  } flex items-center justify-center transition-all`}
                  title={isFilled ? `${trait.name} (${trait.score}/10)` : 'Empty Slot'}
                >
                  {isFilled ? (
                    <>
                      <Unlock className="w-6 h-6 text-purple-300" />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-48 p-2 bg-slate-900 border border-purple-500/30 rounded-lg text-xs text-purple-200">
                        <p className="font-bold text-purple-300">{trait.name}</p>
                        <p className="text-purple-400">Strength: {trait.score}/10</p>
                        <p className="text-purple-300/70 italic mt-1">{trait.lore}</p>
                      </div>
                    </>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-500" />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Matching Traits List */}
          {championData.slots_filled > 0 && (
            <div className="space-y-1 mt-3">
              <p className="text-xs text-purple-300/70 font-semibold">Unlocked Traits:</p>
              {championData.trait_details.map((trait, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-purple-500/10 rounded px-2 py-1">
                  <span className="text-purple-200">{trait.name}</span>
                  <span className="text-purple-400 font-bold">{trait.score}/10</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Play Bonus */}
          {championData.play_bonus !== 'None' && (
            <div className="text-center mt-2">
              <span className="inline-block px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs border border-blue-500/30">
                ⭐ {championData.play_bonus} Play Rate Bonus
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

        {/* Primary Spirit Champion */}
        <div>
          <h2 className="text-2xl font-bold text-center text-purple-300 mb-4">
            🌟 Your Spirit Champion
          </h2>
          <ChampionCard championData={data.spirit_champion.primary} isPrimary={true} />
        </div>

        {/* Runner-Up Champions */}
        {data.spirit_champion.runner_ups.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-purple-300">
              🌠 Resonance Runner-Ups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.spirit_champion.runner_ups.map((champion, idx) => (
                <ChampionCard key={idx} championData={champion} />
              ))}
            </div>
          </div>
        )}

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
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 space-y-4 group"
              >
                <div className="text-center">
                  <h4 className="text-xl font-bold text-purple-300">{trait.name}</h4>
                  <div className="mt-2 space-y-1">
                    <p className={`text-4xl font-bold ${getScoreColor(trait.score)}`}>
                      {trait.score}<span className="text-2xl text-purple-400/50">/10</span>
                    </p>
                    <p className="text-xs text-purple-300/50">Trait Strength</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(trait.score)} transition-all`}
                    style={{ width: `${(trait.score / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-purple-200/80 text-center">{trait.description}</p>
                <p className="text-xs text-purple-300/60 italic text-center">{trait.lore}</p>
                
                {/* Data Source Info */}
                <div className="pt-2 border-t border-purple-500/20">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-300/70">{trait.data_source}</p>
                  </div>
                </div>
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
                  className="bg-slate-800/30 backdrop-blur-xl rounded-lg p-4 border border-purple-500/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-purple-300">{trait.name}</h4>
                    <span className={`text-lg font-bold ${getScoreColor(trait.score)}`}>
                      {trait.score}<span className="text-sm text-purple-400/50">/10</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(trait.score)}`}
                      style={{ width: `${(trait.score / 10) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-200/70">{trait.description}</p>
                  <div className="flex items-start space-x-1 pt-1">
                    <Info className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-300/60">{trait.data_source}</p>
                  </div>
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