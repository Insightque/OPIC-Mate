import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { PracticeMode } from './components/PracticeMode';
import { ScriptItem, ViewState } from './types';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('opic_scripts_v2');
    if (saved) {
      try {
        setScripts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse scripts", e);
      }
    }
  }, []);

  const saveScripts = (newScripts: ScriptItem[]) => {
    setScripts(newScripts);
    localStorage.setItem('opic_scripts_v2', JSON.stringify(newScripts));
  };

  const handleAddScript = (script: ScriptItem) => {
    saveScripts([...scripts, script]);
    setView(ViewState.DASHBOARD);
  };

  const handleDeleteScript = (id: string) => {
    if (confirm("Delete this script?")) {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-['Inter']">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => setView(ViewState.DASHBOARD)}>
            <MessageSquare className="w-6 h-6 fill-indigo-600" />
            <h1 className="font-black text-xl tracking-tighter">OPIc <span className="text-slate-800">Mate</span></h1>
          </div>
          {view !== ViewState.DASHBOARD && (
            <button onClick={() => setView(ViewState.DASHBOARD)} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                EXIT SESSION
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {view === ViewState.DASHBOARD && (
          <Dashboard 
            scripts={scripts} 
            onStartCreate={() => setView(ViewState.CREATE)}
            onStartPractice={() => setView(ViewState.PRACTICE)}
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
      </main>
    </div>
  );
}