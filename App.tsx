import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { PracticeMode } from './components/PracticeMode';
import { VocabPractice } from './components/VocabPractice';
import { PatternPractice } from './components/PatternPractice';
import { ScriptItem, ViewState, VocabLibraryItem, StructureItem } from './types';
import { MessageSquare } from 'lucide-react';
import { generateVocabList, generateStructureList } from './services/geminiService';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // State with lazy initialization to ensure consistency with localStorage
  const [scripts, setScripts] = useState<ScriptItem[]>(() => {
    try {
      const saved = localStorage.getItem('opic_scripts_v4');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [vocabLibrary, setVocabLibrary] = useState<VocabLibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem('opic_vocab_v4');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [patterns, setPatterns] = useState<StructureItem[]>(() => {
    try {
      const saved = localStorage.getItem('opic_patterns_v4');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isRefillingVocab, setIsRefillingVocab] = useState(false);
  const [isRefillingPatterns, setIsRefillingPatterns] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('opic_scripts_v4', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem('opic_vocab_v4', JSON.stringify(vocabLibrary));
  }, [vocabLibrary]);

  useEffect(() => {
    localStorage.setItem('opic_patterns_v4', JSON.stringify(patterns));
  }, [patterns]);


  // Background Vocabulary Pre-fetching
  useEffect(() => {
    const refillVocabLibrary = async () => {
      if (isRefillingVocab) return;
      const unusedCount = vocabLibrary.filter(v => v.lastTestedAt === null).length;
      // Keep trying to fill buffer to ~30, but don't block UI based on this
      const REFILL_THRESHOLD = 27;

      if (unusedCount < REFILL_THRESHOLD) {
        setIsRefillingVocab(true);
        try {
          const newItems = await generateVocabList();
          const libraryWords = new Set(vocabLibrary.map(v => v.word));
          const uniqueNewItems = newItems.filter(item => !libraryWords.has(item.word));

          if (uniqueNewItems.length > 0) {
            const newLibraryItems: VocabLibraryItem[] = uniqueNewItems.map(item => ({
              ...item, isKnown: false, failCount: 0, lastTestedAt: null,
            }));
            // Update using functional state to avoid closure staleness
            setVocabLibrary(prev => {
                const libraryMap = new Map(prev.map(item => [item.word, item]));
                newLibraryItems.forEach(item => libraryMap.set(item.word, item));
                return Array.from(libraryMap.values());
            });
          }
        } catch (error) {
          console.error("Failed to pre-fetch vocabulary:", error);
        } finally {
          setIsRefillingVocab(false);
        }
      }
    };
    refillVocabLibrary();
  }, [vocabLibrary, isRefillingVocab]);

  // Background Pattern Pre-fetching
  useEffect(() => {
    const refillPatterns = async () => {
      if (isRefillingPatterns) return;
      // If we have fewer than 5 patterns, fetch more (queue system)
      if (patterns.length < 5) {
        setIsRefillingPatterns(true);
        console.log(`Pattern queue low (${patterns.length}). Pre-fetching structures...`);
        try {
          const newItems = await generateStructureList();
          // Avoid duplicates based on English sentence
          const currentSet = new Set(patterns.map(p => p.english));
          const uniqueNew = newItems.filter(p => !currentSet.has(p.english));
          
          if (uniqueNew.length > 0) {
            setPatterns(prev => [...prev, ...uniqueNew]);
          }
        } catch (error) {
          console.error("Failed to pre-fetch patterns:", error);
        } finally {
          setIsRefillingPatterns(false);
        }
      }
    };
    refillPatterns();
  }, [patterns, isRefillingPatterns]);


  // Update Handlers
  const handleUpdateVocab = (updatedItems: VocabLibraryItem[]) => {
    setVocabLibrary(prevLibrary => {
      const libraryMap = new Map(prevLibrary.map(item => [item.word, item]));
      updatedItems.forEach(item => libraryMap.set(item.word, item));
      return Array.from(libraryMap.values());
    });
  };

  const handleNextPattern = () => {
    // Remove the first pattern from the queue
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

  // Critical Change: Considered ready if there is ANY data. 
  // The threshold logic is now only used for background fetching, not for UI blocking.
  const isVocabReady = vocabLibrary.length > 0;

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
            vocabLibrary={vocabLibrary}
            onUpdateLibrary={handleUpdateVocab}
            onExit={() => setView(ViewState.DASHBOARD)} 
            isVocabReady={isVocabReady}
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