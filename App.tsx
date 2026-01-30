import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { PracticeMode } from './components/PracticeMode';
import { VocabPractice } from './components/VocabPractice';
import { PatternPractice } from './components/PatternPractice';
import { ScriptItem, ViewState, VocabItem, StructureItem } from './types';
import { MessageSquare } from 'lucide-react';
import { OPIC_VOCAB_DB } from './constants/vocabData';
import { OPIC_PATTERN_DB } from './constants/patternData';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  const [scripts, setScripts] = useState<ScriptItem[]>(() => {
    try {
      const saved = localStorage.getItem('opic_scripts_v4');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [vocabQueue, setVocabQueue] = useState<VocabItem[]>(() => {
    try {
      const saved = localStorage.getItem('opic_vocab_queue_v4');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [patterns, setPatterns] = useState<StructureItem[]>(() => {
    try {
      const saved = localStorage.getItem('opic_patterns_v4');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('opic_scripts_v4', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem('opic_vocab_queue_v4', JSON.stringify(vocabQueue));
  }, [vocabQueue]);

  useEffect(() => {
    localStorage.setItem('opic_patterns_v4', JSON.stringify(patterns));
  }, [patterns]);

  // Local Vocabulary Refilling (Instant)
  useEffect(() => {
    if (vocabQueue.length < 5) {
      // Shuffle the DB and take a slice
      const shuffled = [...OPIC_VOCAB_DB]
        .sort(() => Math.random() - 0.5)
        .slice(0, 30);
      
      setVocabQueue(prev => {
        const currentWords = new Set(prev.map(v => v.word));
        const uniqueNew = shuffled.filter(v => !currentWords.has(v.word));
        return [...prev, ...uniqueNew];
      });
    }
  }, [vocabQueue.length]);

  // Local Pattern Refilling (Instant)
  useEffect(() => {
    if (patterns.length < 5) {
      // Shuffle the DB and take a slice
      const shuffled = [...OPIC_PATTERN_DB]
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
      
      setPatterns(prev => {
        const currentSet = new Set(prev.map(p => p.english));
        const uniqueNew = shuffled.filter(p => !currentSet.has(p.english));
        return [...prev, ...uniqueNew];
      });
    }
  }, [patterns.length]);

  const handleNextVocab = () => {
    setVocabQueue(prev => prev.slice(1));
  };

  const handleNextPattern = () => {
    setPatterns(prev => prev.slice(1));
  };

  const handleAddScript = (script: ScriptItem) => {
    setScripts(prev => [...prev, script]);
    setView(ViewState.DASHBOARD);
  };

  const handleDeleteScript = (id: string) => {
    if (confirm("Permanently remove this script from library?")) {
        setScripts(prev => prev.filter(s => s.id !== id));
    }
  };

  const handlePracticeComplete = (results: { scriptId: string, success: boolean }[]) => {
    setScripts(prev => prev.map(script => {
        const result = results.find(r => r.scriptId === script.id);
        if (result) {
            return {
                ...script,
                stats: {
                    successCount: script.stats.successCount + (result.success ? 1 : 0),
                    failCount: script.stats.failCount + (result.success ? 0 : 1),
                    lastPracticedAt: Date.now()
                }
            };
        }
        return script;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-['Inter']">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => setView(ViewState.DASHBOARD)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter">OPIc <span className="text-slate-800">Mate</span></h1>
          </div>
          {view !== ViewState.DASHBOARD && (
            <button 
              onClick={() => setView(ViewState.DASHBOARD)} 
              className="px-4 py-1.5 bg-slate-900 rounded-xl text-[10px] font-black text-white hover:bg-indigo-600 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100"
            >
                EXIT
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {view === ViewState.DASHBOARD && (
          <Dashboard 
            scripts={scripts} 
            onNavigate={(v) => setView(v)}
            onDeleteScript={handleDeleteScript}
          />
        )}

        {view === ViewState.CREATE && (
          <ScriptGenerator 
            existingScripts={scripts}
            onComplete={handleAddScript}
            onCancel={() => setView(ViewState.DASHBOARD)}
          />
        )}

        {view === ViewState.PRACTICE && (
          <PracticeMode 
            scripts={scripts}
            onCompleteSession={handlePracticeComplete}
            onExit={() => setView(ViewState.DASHBOARD)}
          />
        )}

        {view === ViewState.VOCAB && (
          <VocabPractice 
            vocabQueue={vocabQueue}
            onNext={handleNextVocab}
            onExit={() => setView(ViewState.DASHBOARD)} 
          />
        )}

        {view === ViewState.PATTERNS && (
          <PatternPractice 
            patterns={patterns}
            onNext={handleNextPattern}
            onExit={() => setView(ViewState.DASHBOARD)} 
          />
        )}
      </main>
    </div>
  );
}
