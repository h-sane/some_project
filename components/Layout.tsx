
import React from 'react';
import { AppSection, Language } from '../types';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, onSectionChange, language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSectionChange(AppSection.IDENTIFY)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <h1 className="text-xl font-bold text-slate-900">{t.appName}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border-none focus:ring-0"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="ta">TA</option>
            <option value="te">TE</option>
          </select>
          <button 
            onClick={() => onSectionChange(AppSection.SAFETY)}
            className={`text-xs font-bold uppercase tracking-wider ${activeSection === AppSection.SAFETY ? 'text-blue-600' : 'text-slate-400'}`}
          >
            {t.safety}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50">
        <button 
          onClick={() => onSectionChange(AppSection.IDENTIFY)}
          className={`flex flex-col items-center gap-1 ${activeSection === AppSection.IDENTIFY ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
          <span className="text-[10px] font-bold uppercase">{t.identify}</span>
        </button>
        <button 
          onClick={() => onSectionChange(AppSection.CHAT)}
          className={`flex flex-col items-center gap-1 ${activeSection === AppSection.CHAT ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="text-[10px] font-bold uppercase">{t.healthAi}</span>
        </button>
        <button 
          onClick={() => onSectionChange(AppSection.HISTORY)}
          className={`flex flex-col items-center gap-1 ${activeSection === AppSection.HISTORY ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-[10px] font-bold uppercase">{t.history}</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
