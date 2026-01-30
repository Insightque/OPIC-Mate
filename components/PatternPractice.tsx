import React, { useState, useEffect } from 'react';
import { StructureItem } from '../types';
import { Button } from './Button';
import { ArrowRight, RefreshCw, ArrowLeft, Type, Layers } from 'lucide-react';

interface PatternPracticeProps {
  patterns: StructureItem[];
  onNext: () => void;
  onExit: () => void;
}

export const PatternPractice: React.FC<PatternPracticeProps> = ({ patterns, onNext, onExit }) => {
  const [showEnglish, setShowEnglish] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(-1); // -1 = Main Pattern, 0-2 = Samples

  const current = patterns[0];

  useEffect(() => {
    // Reset state when the pattern changes
    setShowEnglish(false);
    setSampleIndex(-1);
  }, [current]);

  const handleNextPattern = () => {
    onNext();
  };

  const handleStartSamples = () => {
    if (current.samples && current.samples.length > 0) {
      setSampleIndex(0);
      setShowEnglish(false);
    } else {
      handleNextPattern();
    }
  };

  const handleNextSample = () => {
    if (current.samples && sampleIndex < current.samples.length - 1) {
      setSampleIndex(prev => prev + 1);
      setShowEnglish(false);
    } else {
      handleNextPattern();
    }
  };

  // If the background fetch hasn't populated the list yet
  if (!patterns || patterns.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12 h-[60vh]">
      <RefreshCw className="animate-spin mb-4 text-indigo-600 w-8 h-8" />
      <p className="font-bold text-slate-600">Loading sentence structures...</p>
      <p className="text-sm text-slate-400 mt-2">Preparing your practice queue</p>
    </div>
  );

  const isMainPattern = sampleIndex === -1;
  const currentContent = isMainPattern ? 
    { korean: current.korean, english: current.english, label: "Sentence Pattern" } : 
    { korean: current.samples[sampleIndex].korean, english: current.samples[sampleIndex].english, label: `Example ${sampleIndex + 1} of ${current.samples.length}` };

  return (
    <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onExit} variant="ghost" className="text-slate-400 pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Finish Practice
        </Button>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
           {patterns.length > 1 ? `${patterns.length} patterns left` : 'Last one!'}
        </div>
      </div>
      
      <div className={`rounded-[2.5rem] shadow-2xl border-4 border-slate-50 p-10 text-center min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden transition-colors duration-500 ${isMainPattern ? 'bg-white' : 'bg-emerald-50/50'}`}>
        <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-8 block ${isMainPattern ? 'text-slate-300' : 'text-emerald-400'}`}>
          {currentContent.label}
        </label>
        
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 leading-tight tracking-tight px-4">
          "{currentContent.korean}"
        </h2>
        
        <div className="w-full min-h-[120px] bg-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-200 transition-colors">
          {showEnglish ? (
            <div className="animate-in fade-in zoom-in duration-300 text-center">
                <label className="text-[9px] font-bold text-indigo-400 uppercase mb-2 block tracking-wider">English</label>
                <p className="text-xl font-black text-indigo-600 leading-tight">{currentContent.english}</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowEnglish(true)} 
              className="flex flex-col items-center gap-2 text-slate-400 font-bold hover:text-indigo-500 transition-colors group"
            >
              <Type className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest">TAP TO REVEAL</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        {isMainPattern ? (
          <>
             <Button onClick={handleStartSamples} variant="secondary" className="flex-1 py-4 text-sm font-bold bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50">
               <Layers className="w-4 h-4 mr-2" /> Practice Examples
             </Button>
             <Button onClick={handleNextPattern} className="flex-1 py-4 text-sm font-black bg-slate-900 hover:bg-indigo-600">
               Skip & Next <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </>
        ) : (
          <>
             <Button onClick={handleNextPattern} variant="ghost" className="text-slate-400 hover:text-slate-600">
               Skip Remaining
             </Button>
             <Button onClick={handleNextSample} className="flex-1 py-4 text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
               {sampleIndex < (current.samples?.length || 0) - 1 ? "Next Example" : "Finish Pattern"} <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </>
        )}
      </div>
    </div>
  );
};