import { Sparkles, ArrowLeft, Target, Lock, Unlock, Trophy } from 'lucide-react';

export default function AboutPage({ onBack }) {
  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h1 className="text-5xl font-title font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent uppercase">
                About Runic Resonance
              </h1>
            </div>
            <p className="text-lg text-purple-300">
              Your League of Legends personality, revealed through the ancient Runes
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 space-y-6">
          {/* What It Is */}
          <div>
            <h2 className="text-2xl font-display font-bold text-purple-300 mb-3 flex items-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>What Is This?</span>
            </h2>
            <p className="text-purple-200 leading-relaxed">
              Runic Resonance analyzes your League of Legends match history to reveal which champion's spirit resonates within you. 
              By examining your playstyle across 10 personality traits, we discover your true essence in the world of Runeterra.
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-2xl font-display font-bold text-purple-300 mb-3 flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>How It Works</span>
            </h2>
            <ol className="space-y-3 text-purple-200">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm font-bold text-purple-300">1</span>
                <span><strong className="text-purple-300">Enter Your Riot ID</strong> - We fetch your last 50 ranked games via Riot's API</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm font-bold text-purple-300">2</span>
                <span><strong className="text-purple-300">Analyze Behavior</strong> - Extract KDA, vision score, CS, deaths, assists, and more</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm font-bold text-purple-300">3</span>
                <span><strong className="text-purple-300">Calculate 10 Traits</strong> - Score each personality trait from 1-10 based on your gameplay</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm font-bold text-purple-300">4</span>
                <span><strong className="text-purple-300">Match Champions</strong> - Each trait unlocks specific champions from lore (7+ score = unlock)</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm font-bold text-purple-300">5</span>
                <span><strong className="text-purple-300">AI Narrative</strong> - AWS Bedrock generates a mystical reading of your essence</span>
              </li>
            </ol>
          </div>

          {/* The Slot System */}
          <div>
            <h2 className="text-2xl font-display font-bold text-purple-300 mb-3 flex items-center space-x-2">
              <Trophy className="w-6 h-6" />
              <span>The 3-Slot System</span>
            </h2>
            <div className="space-y-3 text-purple-200">
              <p>Each champion has <strong className="text-purple-300">3 trait slots</strong>. Unlock them by achieving 7+ on matching traits:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-300">1/3 Slots</span>
                  </div>
                  <p className="text-sm text-purple-300">~33% resonance - weak connection</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Unlock className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-blue-300">2/3 Slots</span>
                  </div>
                  <p className="text-sm text-purple-300">~66% resonance - strong bond</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-yellow-300">3/3 Slots</span>
                  </div>
                  <p className="text-sm text-purple-300">Perfect Resonance! 🏆</p>
                </div>
              </div>
              <p className="text-sm text-purple-300/80 italic">
                Playing a champion increases its resonance - encouraging you to "farm" traits with your favorite champions!
              </p>
            </div>
          </div>

          {/* The 10 Traits */}
          <div>
            <h2 className="text-2xl font-display font-bold text-purple-300 mb-3">The 10 Personality Traits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-purple-200">
                <span className="font-bold text-blue-400">The Protector</span> - High assists, tanks damage
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-purple-400">The Tactician</span> - Vision score, wards
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-gray-400">The Disciplined</span> - CS, gold efficiency
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-red-400">The Fearless</span> - Fight participation, aggression
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-green-400">The Resilient</span> - Low deaths, comebacks
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-indigo-400">The Wanderer</span> - Solo kills, independence
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-teal-400">The Adaptive</span> - Champion pool diversity
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-yellow-400">The Enlightened</span> - High KDA, win rate
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-rose-400">The Relentless</span> - Kill participation, multikills
              </div>
              <div className="text-purple-200">
                <span className="font-bold text-emerald-400">The Healer</span> - Assist focus, team support
              </div>
            </div>
          </div>

          {/* Technology */}
          <div>
            <h2 className="text-2xl font-display font-bold text-purple-300 mb-3">Built With</h2>
            <div className="flex flex-wrap gap-2">
              {['Riot Games API', 'AWS Bedrock AI', 'Claude 3.5 Sonnet', 'Amazon Titan Images', 'FastAPI', 'React', 'MongoDB'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-sm border border-purple-500/30">
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-sm text-purple-300/70 mt-3">
              Created for the Rift Rewind Hackathon 2025
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Start Your Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
