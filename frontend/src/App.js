import { useState } from 'react';
import '@/App.css';
import axios from 'axios';
import LandingPage from '@/components/LandingPage';
import AnalysisPage from '@/components/AnalysisPage';
import ResultsPage from '@/components/ResultsPage';
import AboutPage from '@/components/AboutPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'analyzing', 'results', 'about'
  const [previousView, setPreviousView] = useState('landing'); // Track where we came from
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
        match_count: 50
      });

      setAnalysisData(response.data);
      setCurrentView('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to analyze account. Please check your Riot ID (GameName#TAG) and region.'
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

  const handleShowAbout = () => {
    setPreviousView(currentView); // Remember where we came from
    setCurrentView('about');
  };

  const handleBackFromAbout = () => {
    setCurrentView(previousView); // Go back to previous view
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {currentView === 'landing' && (
        <LandingPage 
          onAnalyze={handleAnalyze}
          onShowAbout={handleShowAbout}
          error={error}
        />
      )}
      
      {currentView === 'analyzing' && (
        <AnalysisPage />
      )}
      
      {currentView === 'results' && analysisData && (
        <ResultsPage 
          data={analysisData}
          onReset={handleReset}
          onShowAbout={handleShowAbout}
        />
      )}
      
      {currentView === 'about' && (
        <AboutPage onBack={handleBackFromAbout} />
      )}
    </div>
  );
}

export default App;