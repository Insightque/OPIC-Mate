export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CREATE = 'CREATE',
  PRACTICE = 'PRACTICE'
}

export interface ScriptItem {
  id: string;
  question: string;
  koreanAnswer: string;
  englishScript: string;
  logicFlow: string[]; // Added: Logic keywords for structural thinking
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

export interface PracticeSessionResult {
  scriptId: string;
  success: boolean;
}