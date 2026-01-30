import React, { useState, useEffect } from 'react';
import { VocabLibraryItem } from '../types';
import { Button } from './Button';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface VocabPracticeProps {
  vocabLibrary: VocabLibraryItem[];
  onUpdateLibrary: (updatedItems: VocabLibraryItem[]) => void;
  onExit: () => void;
  isVocabReady: boolean;
}

export const VocabPractice: React.FC<VocabPracticeProps> = ({ vocabLibrary, onUpdateLibrary, onExit, isVocabReady }) => {
  const [sessionWords, setSessionWords] = useState<VocabLibraryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practicedInSession, setPracticedInSession] = useState<Map<string, VocabLibraryItem>>(new Map());
  const [showMeaning, setShowMeaning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // START SESSION LOGIC
    // We attempt to start the session if we have ANY data in the library.
    // We do NOT wait for the full 30 words anymore.
    
    if (vocabLibrary.length > 0) {
      const reviewCandidates = vocabLibrary
        .filter(v => !v.isKnown)
        .sort((a, b) => (a.lastTestedAt || 0) - (b.lastTestedAt || 0));
      const unusedCandidates = vocabLibrary.filter(v => v.lastTestedAt === null);

      // Take up to 3 review words
      const reviewWords = reviewCandidates.slice(0, 3);
      
      // Calculate how many new words we can fit (target 30 total, but accept less)
      const targetNewCount = 30 - reviewWords.length;
      const newWords = unusedCandidates.slice(0, targetNewCount);
      
      const combined = [...reviewWords, ...newWords];

      if (combined.length > 0) {
        setSessionWords(combined.sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setIsLoading(false);
      } else {
        // Library exists but maybe all words are "known" and tested recently?
        // In this rare case, we might need to reset or wait, but for now show loading
        // as App.tsx should be triggering a refill if unused count is low.
        setIsLoading(true); 
      }
    } else {
        // True cold start: Library is completely empty array.
        setIsLoading(true);
    }
  }, [vocabLibrary]); // Trigger whenever library updates (e.g., background fetch finishes)

  const endSession = (finalPracticedWords: Map<string, VocabLibraryItem>) => {
    if (finalPracticedWords.size > 0) {
      onUpdateLibrary(Array.from(finalPracticedWords.values()));
    }
    onExit();
  };

  const handleResponse = (isKnown: boolean) => {
    const currentWord = sessionWords[currentIndex];
    if (!currentWord) return;

    const updatedWord = {
      ...currentWord,
      isKnown,
      failCount: isKnown ? currentWord.failCount : currentWord.failCount + 1,
      lastTestedAt: Date.now(),
    };
    
    const newPracticedMap = new Map<string, VocabLibraryItem>(practicedInSession).set(currentWord.word, updatedWord);
    setPracticedInSession(newPracticedMap);

    if (currentIndex < sessionWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
    } else {
      endSession(newPracticedMap);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <RefreshCw className="animate-spin mb-4 text-indigo-600 w-8 h-8" />
        <p className="font-bold text-slate-600">Preparing vocabulary...</p>
        <p className="text-sm text-slate-400 mt-2">First-time setup may take a moment.</p>
      </div>
    );
  }

  const currentWord = sessionWords[currentIndex];
  if (!currentWord) return null;

  const progress = ((currentIndex + 1) / sessionWords.length) * 100;

  return (
    <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center">
            <button onClick={() => endSession(practicedInSession)} className="flex items-center gap-2 text-xs text-slate-400 font-bold hover:text-indigo-500">
                <ArrowLeft className="w-4 h-4" /> End Session & Save
            </button>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {currentIndex + 1} / {sessionWords.length}
            </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 p-12 text-center min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
        {currentWord.lastTestedAt !== null && !currentWord.isKnown && (
            <div className="absolute top-4 right-4 bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter animate-bounce">
                Review Word
            </div>
        )}

        <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 block">Vocabulary Target</label>
        
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none">{currentWord.word}</h2>
        
        <div className="h-24 flex items-center justify-center w-full mt-4">
          {showMeaning ? (
            <div className="animate-in fade-in zoom-in duration-300 text-center">
                <p className="text-3xl font-black text-indigo-600 mb-1">{currentWord.meaning}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Meaning in Korean</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowMeaning(true)} 
              className="px-8 py-3 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black hover:bg-indigo-50 hover:text-indigo-400 transition-all border border-slate-200 uppercase tracking-widest"
            >
              TAP TO REVEAL
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button 
            onClick={() => handleResponse(false)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition-all group shadow-sm"
        >
            <XCircle className="w-8 h-8 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-black text-slate-800 text-sm">NOT SURE</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Keep Practicing</span>
        </button>

        <button 
            onClick={() => handleResponse(true)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group shadow-sm"
        >
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-black text-slate-800 text-sm">I KNOW THIS</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Mastered</span>
        </button>
      </div>

      <div className="mt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total {vocabLibrary.length} words in your personal database
          </p>
      </div>
    </div>
  );
};