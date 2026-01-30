import React, { useState, useMemo } from 'react';
import { ScriptItem } from '../types';
import { Button } from './Button';
import { Mic, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Lightbulb } from 'lucide-react';

interface PracticeModeProps {
  scripts: ScriptItem[];
  onCompleteSession: (results: { scriptId: string, success: boolean }[]) => void;
  onExit: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ scripts, onCompleteSession, onExit }) => {
  const practiceQueue = useMemo(() => {
    const now = Date.now();
    return [...scripts]
      .sort((a, b) => {
          const scoreA = a.stats.successCount - a.stats.failCount;
          const scoreB = b.stats.successCount - b.stats.failCount;
          if (scoreA !== scoreB) return scoreA - scoreB;
          return (a.stats.lastPracticedAt || 0) - (b.stats.lastPracticedAt || 0);
      })
      .slice(0, 3);
  }, [scripts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewState, setViewState] = useState<'READY' | 'LOGIC' | 'SCRIPT'>('READY');
  const [results, setResults] = useState<{ scriptId: string, success: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleResult = (success: boolean) => {
    const currentScript = practiceQueue[currentIndex];
    const newResults = [...results, { scriptId: currentScript.id, success }];
    setResults(newResults);

    if (currentIndex < practiceQueue.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setViewState('READY');
    } else {
        setIsFinished(true);
        onCompleteSession(newResults);
    }
  };

  if (isFinished) {
      return (
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Great Progress!</h2>
            <p className="text-slate-500 mb-8">Structure-focused practice builds confidence.</p>
            <Button onClick={onExit} className="w-full">Done</Button>
        </div>
      );
  }

  const currentItem = practiceQueue[currentIndex];

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
          <Button onClick={onExit} variant="ghost" className="pl-0 text-slate-400">
              <ArrowLeft className="w-4 h-4 mr-2" /> Stop Session
          </Button>
          <div className="flex items-center gap-1">
            {practiceQueue.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-indigo-600' : i < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
            ))}
          </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center bg-slate-50 border-b">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Question</label>
            <p className="text-xl font-medium text-slate-800 italic">"{currentItem.question}"</p>
        </div>

        <div className="p-8 min-h-[350px] flex flex-col items-center justify-center">
             {viewState === 'READY' && (
                 <div className="text-center space-y-6">
                     <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Mic className="w-10 h-10" />
                     </div>
                     <p className="text-slate-600 text-sm">
                         Try answering the question aloud.<br/>
                         Focus on the <span className="text-indigo-600 font-bold">structural flow</span> you learned.
                     </p>
                     <div className="flex gap-2">
                        <Button onClick={() => setViewState('LOGIC')} variant="secondary" className="text-xs">
                            <Lightbulb className="w-4 h-4 mr-2" /> Show Logic Flow
                        </Button>
                        <Button onClick={() => setViewState('SCRIPT')} variant="ghost" className="text-xs">
                            <Eye className="w-4 h-4 mr-2" /> Full Script
                        </Button>
                     </div>
                 </div>
             )}

             {viewState === 'LOGIC' && (
                 <div className="w-full space-y-8 animate-in slide-in-from-top-2">
                     <div className="flex flex-col gap-3">
                         {currentItem.logicFlow?.map((step, i) => (
                             <div key={i} className="flex items-center gap-4 group">
                                 <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                                 <div className="bg-slate-50 flex-1 p-3 rounded-xl border border-slate-100 text-slate-700 font-bold group-hover:bg-indigo-50 transition-colors">
                                     {step}
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="text-center">
                        <Button onClick={() => setViewState('SCRIPT')} variant="secondary" className="text-xs">
                           <Eye className="w-4 h-4 mr-2" /> Show Full Script
                        </Button>
                     </div>
                 </div>
             )}

             {viewState === 'SCRIPT' && (
                 <div className="w-full space-y-6 animate-in fade-in">
                     <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                         <p className="text-indigo-900 leading-relaxed font-medium italic text-lg">
                             "{currentItem.englishScript}"
                         </p>
                     </div>
                     <div className="text-center">
                        <Button onClick={() => setViewState('READY')} variant="ghost" className="text-xs">
                            <EyeOff className="w-4 h-4 mr-2" /> Hide
                        </Button>
                     </div>
                 </div>
             )}
        </div>

        <div className="p-6 bg-slate-50 border-t flex gap-4">
             <Button onClick={() => handleResult(false)} variant="secondary" className="flex-1 bg-white hover:bg-rose-50 border-rose-100 text-rose-500">
                 <XCircle className="w-4 h-4 mr-2" /> Hard
             </Button>
             <Button onClick={() => handleResult(true)} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                 <CheckCircle className="w-4 h-4 mr-2" /> Easy
             </Button>
        </div>
      </div>
    </div>
  );
};