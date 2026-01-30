import React, { useState } from 'react';
import { VocabItem } from '../types';
import { Button } from './Button';
import { ArrowRight, RefreshCw, ArrowLeft, Type } from 'lucide-react';

interface VocabPracticeProps {
  vocabQueue: VocabItem[];
  onNext: () => void;
  onExit: () => void;
}

export const VocabPractice: React.FC<VocabPracticeProps> = ({ vocabQueue, onNext, onExit }) => {
  const [showEnglish, setShowEnglish] = useState(false);

  const handleNext = () => {
    setShowEnglish(false);
    onNext();
  };

  if (vocabQueue.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12 h-[60vh]">
      <RefreshCw className="animate-spin mb-4 text-indigo-600 w-8 h-8" />
      <p className="font-bold text-slate-600">Loading vocabulary...</p>
      <p className="text-sm text-slate-400 mt-2">Preparing your word queue</p>
    </div>
  );

  const current = vocabQueue[0];

  return (
    <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onExit} variant="ghost" className="text-slate-400 pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Finish Practice
        </Button>
        <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">
           {vocabQueue.length > 1 ? `${vocabQueue.length} words left` : 'Last one!'}
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 p-12 text-center min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
        <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 block">How do you say this in OPIc?</label>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
          "{current.meaning}"
        </h2>
        
        <div className="w-full min-h-[140px] bg-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-rose-200 transition-colors">
          {showEnglish ? (
            <div className="animate-in fade-in zoom-in duration-300 text-center">
                <label className="text-[9px] font-bold text-rose-400 uppercase mb-2 block tracking-wider">English Expression</label>
                <p className="text-3xl md:text-4xl font-black text-rose-600 leading-tight tracking-tighter">{current.word}</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowEnglish(true)} 
              className="flex flex-col items-center gap-2 text-slate-400 font-bold hover:text-rose-500 transition-colors group"
            >
              <Type className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest">TAP TO REVEAL ENGLISH</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleNext} className="w-full py-4 text-lg font-black bg-slate-900 hover:bg-rose-600 transition-all rounded-2xl shadow-xl shadow-slate-200 hover:shadow-rose-200">
          Next Expression <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
