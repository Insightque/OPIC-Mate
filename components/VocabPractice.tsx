import React, { useState, useEffect } from 'react';
import { VocabItem } from '../types';
import { generateVocabList } from '../services/geminiService';
import { Button } from './Button';
import { ArrowRight, RefreshCw, Volume2, ArrowLeft } from 'lucide-react';

export const VocabPractice: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [list, setList] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const newList = await generateVocabList();
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
    setShowMeaning(false);
  };

  if (list.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12">
      <RefreshCw className="animate-spin mb-4 text-indigo-600" />
      <p>Preparing high-frequency OPIc vocabulary...</p>
    </div>
  );

  const current = list[index];

  return (
    <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
      <Button onClick={onExit} variant="ghost" className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Finish Practice</Button>
      
      <div className="bg-white rounded-3xl shadow-xl border p-12 text-center min-h-[350px] flex flex-col justify-center items-center">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 block">Target Vocab</label>
        
        <h2 className="text-4xl font-black text-indigo-600 mb-2">{current.word}</h2>
        
        <div className="h-20 flex items-center justify-center w-full mt-4">
          {showMeaning ? (
            <p className="text-2xl font-bold text-slate-700 animate-in fade-in zoom-in duration-300">{current.meaning}</p>
          ) : (
            <button 
              onClick={() => setShowMeaning(true)} 
              className="px-6 py-2 bg-slate-100 text-slate-400 rounded-full text-xs font-bold hover:bg-indigo-50 hover:text-indigo-400 transition-all"
            >
              TAP TO REVEAL MEANING
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleNext} className="w-full py-4 text-lg font-bold">
          Next Word <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};