import React, { useMemo, useEffect, useState } from 'react';
import { ScriptItem, CommonPattern, ViewState } from '../types';
import { Plus, BookOpen, Trash2, TrendingUp, Sparkles, Languages, Terminal } from 'lucide-react';
import { Button } from './Button';
import { extractCommonPatterns } from '../services/geminiService';

interface DashboardProps {
  scripts: ScriptItem[];
  onNavigate: (view: ViewState) => void;
  onDeleteScript: (id: string) => void;
  onStartVocab: () => void;
  onStartPatterns: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ scripts, onNavigate, onDeleteScript, onStartVocab, onStartPatterns }) => {
  const [patterns, setPatterns] = useState<CommonPattern[]>([]);
  const [loadingPatterns, setLoadingPatterns] = useState(false);

  useEffect(() => {
    if (scripts.length >= 2) {
      const loadPatterns = async () => {
        setLoadingPatterns(true);
        try {
          const result = await extractCommonPatterns(scripts);
          setPatterns(result.patterns);
        } catch (e) {
          console.error("Pattern extraction failed", e);
        } finally {
          setLoadingPatterns(false);
        }
      };
      loadPatterns();
    }
  }, [scripts]);
  
  const dueForPracticeCount = useMemo(() => {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    return scripts.filter(s => !s.stats.lastPracticedAt || (now - s.stats.lastPracticedAt > ONE_HOUR)).length;
  }, [scripts]);

  const sortedScripts = useMemo(() => {
    return [...scripts].sort((a, b) => b.createdAt - a.createdAt);
  }, [scripts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top CTA Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-black mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> REVIEW SESSION
          </h2>
          <p className="text-indigo-100 text-sm mb-6 opacity-90">
            {dueForPracticeCount} scripts recommended for repetition.
          </p>
          <Button 
            onClick={() => onNavigate(ViewState.PRACTICE)} 
            disabled={scripts.length === 0}
            className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none font-black tracking-tight"
          >
            START SCRIPT PRACTICE
          </Button>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> NEW CHALLENGE
            </h2>
            <p className="text-slate-400 text-sm mb-6">Create a structured script from real OPIc topics.</p>
            <Button onClick={() => onNavigate(ViewState.CREATE)} className="w-full bg-indigo-500 hover:bg-indigo-400 border-none font-black tracking-tight">
                GENERATE SCRIPT
            </Button>
        </div>
      </div>

      {/* Mini Practice Modules */}
      <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onStartVocab}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-400 hover:shadow-lg transition-all group"
          >
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Languages className="w-6 h-6 text-rose-500" />
              </div>
              <span className="font-black text-slate-800 tracking-tighter">VOCABULARY</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Flashcards</span>
          </button>
          
          <button 
            onClick={onStartPatterns}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-400 hover:shadow-lg transition-all group"
          >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Terminal className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-black text-slate-800 tracking-tighter">STRUCTURES</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Verb Patterns</span>
          </button>
      </div>

      {/* Pattern Library Section */}
      {scripts.length >= 2 && (
        <section className="bg-amber-50 rounded-3xl p-6 border border-amber-100 shadow-sm">
          <h3 className="text-sm font-black text-amber-900 mb-4 flex items-center uppercase tracking-widest">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
            AI Analyzed Patterns
          </h3>
          {loadingPatterns ? (
             <p className="text-amber-700 text-xs animate-pulse">Extracting speaking styles from your library...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patterns.map((p, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200">
                  <div className="text-indigo-600 font-black text-xs mb-1 uppercase tracking-tight">{p.pattern}</div>
                  <div className="text-slate-500 text-[10px] mb-2 font-medium">{p.explanation}</div>
                  <div className="text-slate-700 text-[11px] italic bg-slate-50 p-2 rounded-lg border border-slate-100">"{p.example}"</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Library */}
      <section>
        <h3 className="text-xs font-black text-slate-400 mb-4 flex items-center uppercase tracking-widest">
          <TrendingUp className="w-3 h-3 mr-2" />
          My Script Library ({scripts.length})
        </h3>
        
        {scripts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm font-bold">Your library is empty. Start a new challenge!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedScripts.map((script) => (
              <div key={script.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                            OPIc Q
                        </span>
                        {script.logicFlow?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <button onClick={() => onDeleteScript(script.id)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">{script.question}</h4>
                <div className="text-xs text-slate-500 line-clamp-1 italic font-medium opacity-70">
                    "{script.englishScript}"
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};