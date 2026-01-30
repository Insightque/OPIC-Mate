import React, { useMemo, useEffect, useState } from 'react';
import { ScriptItem, CommonPattern } from '../types';
import { Plus, BookOpen, Trash2, TrendingUp, Sparkles, Quote } from 'lucide-react';
import { Button } from './Button';
import { extractCommonPatterns } from '../services/geminiService';

interface DashboardProps {
  scripts: ScriptItem[];
  onStartCreate: () => void;
  onStartPractice: () => void;
  onDeleteScript: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ scripts, onStartCreate, onStartPractice, onDeleteScript }) => {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">Ready to Practice?</h2>
          <p className="text-indigo-100 mb-6">
            {dueForPracticeCount} scripts are waiting for your review.
          </p>
          <Button 
            onClick={onStartPractice} 
            disabled={scripts.length === 0}
            className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">New Challenge</h2>
            <p className="text-slate-500 mb-6">Generate a structured script based on your level.</p>
            <Button onClick={onStartCreate} variant="secondary" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create New Script
            </Button>
        </div>
      </div>

      {/* Pattern Library Section */}
      {scripts.length >= 2 && (
        <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
            Mastered Patterns
          </h3>
          {loadingPatterns ? (
             <p className="text-amber-700 text-sm animate-pulse">Analyzing your speaking patterns...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patterns.map((p, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-amber-200">
                  <div className="text-indigo-600 font-bold text-sm mb-1">{p.pattern}</div>
                  <div className="text-slate-500 text-xs mb-2">{p.explanation}</div>
                  <div className="text-slate-700 text-xs italic bg-slate-50 p-2 rounded">"{p.example}"</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-slate-500" />
          My Script Library ({scripts.length})
        </h3>
        
        {scripts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Add your first script to start practicing.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedScripts.map((script) => (
              <div key={script.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded uppercase">
                            Question
                        </span>
                        {script.logicFlow?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <button onClick={() => onDeleteScript(script.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                <h4 className="font-medium text-slate-800 mb-2">{script.question}</h4>
                <div className="text-sm text-slate-500 mb-4 line-clamp-1 italic">
                    "{script.englishScript}"
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-3">
                    <div className="flex gap-3">
                        <span>Success: <b className="text-green-600">{script.stats.successCount}</b></span>
                        <span>Fails: <b className="text-rose-400">{script.stats.failCount}</b></span>
                    </div>
                    <span>Added {new Date(script.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};