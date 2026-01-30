export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CREATE = 'CREATE',
  PRACTICE = 'PRACTICE',
  VOCAB = 'VOCAB',
  PATTERNS = 'PATTERNS'
}

export interface ScriptItem {
  id: string;
  question: string;
  koreanAnswer: string;
  englishScript: string;
  logicFlow: string[];
  createdAt: number;
  stats: {
    successCount: number;
    failCount: number;
    lastPracticedAt: number | null;
  };
}

export interface CommonPattern {
  pattern: string;
  explanation: string;
  example: string;
}

export interface VocabItem {
  word: string;
  meaning: string;
}

export interface VocabLibraryItem extends VocabItem {
  isKnown: boolean;
  failCount: number;
  lastTestedAt: number | null;
}

export interface StructureItem {
  korean: string;
  english: string;
  samples: { korean: string, english: string }[];
}

export interface PracticeSessionResult {
  scriptId: string;
  success: boolean;
}