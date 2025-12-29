
import React from 'react';
import { DrugInfo } from '../types';

interface ResultViewProps {
  info: DrugInfo;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ info, onReset }) => {
  const isHighConfidence = info.confidenceScore >= 0.85;

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="text-blue-600 text-sm font-semibold flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Scanner
        </button>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isHighConfidence ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          {Math.round(info.confidenceScore * 100)}% Confidence
        </div>
      </div>

      {!isHighConfidence && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
          <svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
            <h4 className="text-amber-800 font-bold text-sm">Low Confidence Identification</h4>
            <p className="text-amber-700 text-xs mt-1 leading-relaxed">We couldn't identify this with 100% certainty. Please verify with the physical packaging or consult a pharmacist before ingestion.</p>
          </div>
        </div>
      )}

      {/* Hero Info */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{info.name}</h2>
        <p className="text-blue-300 text-sm font-medium mb-4">{info.activeIngredients.join(' + ')}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-white/60 text-[10px] uppercase font-bold block mb-1">Imprint</span>
            <span className="text-sm font-mono">{info.physicalDescription.imprint || 'None'}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-white/60 text-[10px] uppercase font-bold block mb-1">Color/Shape</span>
            <span className="text-sm">{info.physicalDescription.color} {info.physicalDescription.shape}</span>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="space-y-4">
        <Section title="Primary Indication" icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
          <p className="text-slate-700 text-sm leading-relaxed">{info.indication}</p>
        </Section>

        <Section title="Dosage Guidance" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
          <p className="text-slate-700 text-sm leading-relaxed">{info.dosageGuidance}</p>
        </Section>

        <Section title="Age-Specific Warnings" icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Pediatric</span>
              <span className="text-slate-900 text-right max-w-[60%] font-semibold">{info.demographics.pediatric}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
              <span className="text-slate-500 font-medium">Adult</span>
              <span className="text-slate-900 text-right max-w-[60%] font-semibold">{info.demographics.adult}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
              <span className="text-slate-500 font-medium">Geriatric</span>
              <span className="text-slate-900 text-right max-w-[60%] font-semibold">{info.demographics.geriatric}</span>
            </div>
          </div>
        </Section>

        <Section title="Contraindications" icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" variant="danger">
          <ul className="list-disc list-inside space-y-1">
            {info.contraindications.map((item, i) => (
              <li key={i} className="text-red-700 text-sm font-medium">{item}</li>
            ))}
          </ul>
        </Section>
      </div>

      <button 
        onClick={() => alert("Connecting you to a verified pharmacist...")}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        Ask a Pharmacist
      </button>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; icon: string; variant?: 'default' | 'danger' }> = ({ title, children, icon, variant = 'default' }) => (
  <div className={`p-5 rounded-2xl border ${variant === 'danger' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
    <div className="flex items-center gap-2 mb-3">
      <svg className={`w-5 h-5 ${variant === 'danger' ? 'text-red-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
      </svg>
      <h3 className={`font-bold text-sm uppercase tracking-wider ${variant === 'danger' ? 'text-red-800' : 'text-slate-500'}`}>{title}</h3>
    </div>
    {children}
  </div>
);

export default ResultView;
