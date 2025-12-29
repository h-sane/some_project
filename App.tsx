
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import ChatBot from './components/ChatBot';
import { AppSection, DrugInfo, AnalysisState, Language } from './types';
import { analyzePillImage } from './services/geminiService';
import { translations } from './translations';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.IDENTIFY);
  const [language, setLanguage] = useState<Language>('en');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null
  });
  const [history, setHistory] = useState<DrugInfo[]>([]);
  const wakeLockRef = useRef<any>(null);

  const t = translations[language];

  // Load history and language
  useEffect(() => {
    const saved = localStorage.getItem('pill_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
    const savedLang = localStorage.getItem('pill_lang') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Screen Wake Lock Implementation - Keeps the screen on during use
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.debug(`Wake Lock error: ${err.name}, ${err.message}`);
        }
      }
    };

    requestWakeLock();

    // Re-request wake lock when visibility changes (e.g., coming back to tab)
    const handleVisibilityChange = async () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pill_lang', lang);
  };

  const handleCapture = async (base64: string) => {
    setAnalysis({ isAnalyzing: true, result: null, error: null });
    try {
      const data = await analyzePillImage(base64);
      setAnalysis({ isAnalyzing: false, result: data, error: null });
      const newHistory = [data, ...history.slice(0, 19)];
      setHistory(newHistory);
      localStorage.setItem('pill_history', JSON.stringify(newHistory));
    } catch (err: any) {
      setAnalysis({ isAnalyzing: false, result: null, error: err.message });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.IDENTIFY:
        if (analysis.result) {
          return <ResultView info={analysis.result} onReset={() => setAnalysis({ ...analysis, result: null })} />;
        }
        return (
          <div className="space-y-4">
            {analysis.error && (
              <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl">{analysis.error}</div>
            )}
            <Scanner onCapture={handleCapture} isAnalyzing={analysis.isAnalyzing} />
          </div>
        );

      case AppSection.CHAT:
        return <ChatBot lang={language} />;

      case AppSection.HISTORY:
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">{t.recent}</h2>
            {history.length === 0 ? (
              <p className="text-center py-12 text-slate-400">No scans yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} onClick={() => { setAnalysis({ isAnalyzing: false, result: item, error: null }); setActiveSection(AppSection.IDENTIFY); }} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-blue-200">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.physicalDescription.color}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case AppSection.SAFETY:
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">{t.safety}</h2>
            <div className="p-6 bg-blue-600 rounded-2xl text-white">
              <p className="text-sm">{t.disclaimer}</p>
            </div>
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold uppercase text-slate-400">Important Note</p>
              <p className="text-sm text-slate-700">{t.notADoctor}</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Layout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      language={language}
      onLanguageChange={handleLanguageChange}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
