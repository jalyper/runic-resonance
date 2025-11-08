import { Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const ANALYSIS_STEPS = [
  'Connecting to the Rift...',
  'Gathering match history from the archives...',
  'Analyzing your combat patterns...',
  'Calculating trait resonances...',
  'Consulting the ancient Runes...',
  'Channeling cosmic energies...',
  'Revealing your spirit champion...'
];

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 max-w-2xl">
        {/* Spinning Runes */}
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 border-4 border-blue-500/30 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-8 border-4 border-pink-500/30 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-purple-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            The Runes Are Speaking
          </h1>
          
          <p className="text-xl text-purple-200 animate-pulse">
            {ANALYSIS_STEPS[currentStep]}
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-purple-300 text-sm">This may take 15-30 seconds...</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center space-x-2">
          {ANALYSIS_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-purple-400 scale-150'
                  : index < currentStep
                  ? 'bg-purple-600'
                  : 'bg-purple-900'
              }`}
            />
          ))}
        </div>

        {/* Mystical text */}
        <p className="text-sm text-purple-300/60 italic max-w-md mx-auto">
          "The ancient magic of Runeterra flows through the Rift, revealing truths hidden in battle..."
        </p>
      </div>
    </div>
  );
}