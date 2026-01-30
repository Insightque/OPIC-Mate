import React, { useState, useEffect } from 'react';
import { StructureItem } from '../types';
import { generateStructureList } from '../services/geminiService';
import { Button } from './Button';
import { ArrowRight, RefreshCw, ArrowLeft, Type } from 'lucide-react';

export const PatternPractice: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [list, setList] = useState<StructureItem[]>([]);
  const [index, setIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const newList = await generateStructureList();
      setList(prev => [...prev, ...newList]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleNext = () => {
    if (index === list.length - 2 && !loading) {
      fetchList();
    }
    setIndex(prev => prev + 1);
    setShowEnglish(false);
  };

  if (list.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12">
      <RefreshCw className="animate-spin mb-4 text-indigo-600" />
      <p>Generating sentence patterns...</p>
    </div>
  );

  const current = list[index];

  return (
    <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
      <Button onClick={onExit} variant="ghost" className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Finish Practice</Button>
      
      <div className="bg-white rounded-3xl shadow-xl border p-10 text-center min-h-[400px] flex flex-col justify-center items-center">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 block">Sentence Pattern (KR)</label>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">"{current.korean}"</h2>
        
        <div className="w-full min-h-[100px] bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-dashed border-slate-200">
          {showEnglish ? (
            <div className="animate-in fade-in duration-500 text-center">
                <label className="text-[9px] font-bold text-indigo-400 uppercase mb-2 block">English Structure</label>
                <p className="text-xl font-black text-indigo-600 leading-tight">{current.english}</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowEnglish(true)} 
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-500 transition-colors"
            >
              <Type className="w-4 h-4" /> REVEAL ENGLISH
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleNext} className="w-full py-4 text-lg font-bold bg-slate-900 hover:bg-black">
          Next Pattern <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};