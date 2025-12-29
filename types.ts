
export type Language = 'en' | 'hi' | 'ta' | 'te';

export interface DrugInfo {
  name: string;
  activeIngredients: string[];
  indication: string;
  dosageGuidance: string;
  demographics: {
    pediatric: string;
    adult: string;
    geriatric: string;
  };
  contraindications: string[];
  confidenceScore: number;
  physicalDescription: {
    shape: string;
    color: string;
    imprint: string;
  };
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: DrugInfo | null;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export enum AppSection {
  IDENTIFY = 'identify',
  CHAT = 'chat',
  HISTORY = 'history',
  SAFETY = 'safety'
}
