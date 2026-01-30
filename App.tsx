import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { PracticeMode } from './components/PracticeMode';
import { VocabPractice } from './components/VocabPractice';
import { PatternPractice } from './components/PatternPractice';
import { ScriptItem, ViewState, VocabLibraryItem } from './types';
import { MessageSquare } from 'lucide-react';
import { generateVocabList } from './services/geminiService';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [vocabLibrary, setVocabLibrary] = useState<VocabLibraryItem[]>([]);
  const [isRefillingVocab, setIsRefillingVocab] = useState(false);

  useEffect(() => {
    const savedScripts = localStorage.getItem('opic_scripts_v4');
    if (savedScripts) {
      try {
        setScripts(JSON.parse(savedScripts));
      } catch (e) { console.error("Failed to parse scripts", e); }
    }
    const savedVocab = localStorage.getItem('opic_vocab_v4');
    if (savedVocab) {
      try {
        setVocabLibrary(JSON.parse(savedVocab));
      } catch (e) { console.error("Failed to parse vocab", e); }
    }
  }, []);

  const saveScripts = (newScripts: ScriptItem[]) => {
    setScripts(newScripts);
    localStorage.setItem('opic_scripts_v4', JSON.stringify(newScripts));
  };

  const handleUpdateVocab = (updatedItems: VocabLibraryItem[]) => {
    setVocabLibrary(prevLibrary => {
      const libraryMap = new Map(prevLibrary.map(item => [item.word, item]));
      updatedItems.forEach(item => libraryMap.set(item.word, item));
      const newLibrary = Array.from(libraryMap.values());
      localStorage.setItem('opic_vocab_v4', JSON.stringify(newLibrary));
      return newLibrary;
    });
  };

  // Background Vocabulary Pre-fetching
  useEffect(() => {
    const refillVocabLibrary = async () => {
      if (isRefillingVocab) return;
      const unusedCount = vocabLibrary.filter(v => v.lastTestedAt === null).length;
      const REFILL_THRESHOLD = 27;

      if (unusedCount < REFILL_THRESHOLD) {
        setIsRefillingVocab(true);
        console.log(`Unused vocab count (${unusedCount}) is below threshold. Pre-fetching...`);
        try {
          const newItems = await generateVocabList();
          const libraryWords = new Set(vocabLibrary.map(v => v.word));
          const uniqueNewItems = newItems.filter(item => !libraryWords.has(item.word));

          if (uniqueNewItems.length > 0) {
            const newLibraryItems: VocabLibraryItem[] = uniqueNewItems.map(item => ({
              ...item, isKnown: false, failCount: 0, lastTestedAt: null,
            }));
            handleUpdateVocab(newLibraryItems);
          }
        } catch (error) {
          console.error("Failed to pre-fetch vocabulary:", error);
        } finally {
          setIsRefillingVocab(false);
        }
      }
    };

    // Run check only after initial load from localStorage is likely complete
    if (localStorage.getItem('opic_vocab_v4') !== null) {
      refillVocabLibrary();
    }
  }, [vocabLibrary, isRefillingVocab]);

  const handleAddScript = (script: ScriptItem) => {
    saveScripts([...scripts, script]);
    setView(ViewState.DASHBOARD);
  };

  const handleDeleteScript = (id: string) => {
    if (confirm("Permanently remove this script from library?")) {
        saveScripts(scripts.filter(s => s.id !== id));
    }
  };

  const handlePracticeComplete = (results: { scriptId: string, success: boolean }[]) => {
    const updatedScripts = scripts.map(script => {
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
    });
    saveScripts(updatedScripts);
  };

  const isVocabReady = vocabLibrary.filter(v => v.lastTestedAt === null).length >= 27;

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
            onExit={() => setView(ViewState.DASHBOARD)} 
          />
        )}
      </main>
    </div>
  );
}