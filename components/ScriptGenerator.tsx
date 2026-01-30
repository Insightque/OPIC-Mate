import React, { useState, useEffect } from 'react';
import { generateOpicQuestion, generateKoreanSamples, generateEnglishScripts } from '../services/geminiService';
import { ScriptItem } from '../types';
import { Button } from './Button';
import { ArrowRight, RefreshCw, Check, Edit2, Save, Layers } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ScriptGeneratorProps {
  existingScripts: ScriptItem[];
  onComplete: (script: ScriptItem) => void;
  onCancel: () => void;
}

enum Step {
  QUESTION = 0,
  KOREAN_DRAFT = 1,
  ENGLISH_SCRIPT = 2,
  REVIEW = 3
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ existingScripts, onComplete, onCancel }) => {
  const [step, setStep] = useState<Step>(Step.QUESTION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [koreanSamples, setKoreanSamples] = useState<string[]>([]);
  const [selectedKorean, setSelectedKorean] = useState("");
  
  const [englishSamples, setEnglishSamples] = useState<{label: string, text: string, logicFlow: string[]}[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<{text: string, logicFlow: string[]} | null>(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await generateOpicQuestion();
      setQuestion(q);
    } catch (err) {
      setError("Failed to generate question.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKorean = async () => {
    setLoading(true);
    const mastered = existingScripts.filter(s => s.stats.successCount > s.stats.failCount);
    try {
      const result = await generateKoreanSamples(question, mastered);
      setKoreanSamples(result.samples);
      setStep(Step.KOREAN_DRAFT);
    } catch (err) {
      setError("Failed to generate Korean samples.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEnglish = async () => {
    if (!selectedKorean) return;
    setLoading(true);
    try {
      const result = await generateEnglishScripts(selectedKorean);
      setEnglishSamples(result.scripts);
      setStep(Step.ENGLISH_SCRIPT);
    } catch (err) {
      setError("Failed to generate English scripts.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!question || !selectedKorean || !selectedEnglish) return;
    
    const newScript: ScriptItem = {
      id: uuidv4(),
      question,
      koreanAnswer: selectedKorean,
      englishScript: selectedEnglish.text,
      logicFlow: selectedEnglish.logicFlow,
      createdAt: Date.now(),
      stats: { successCount: 0, failCount: 0, lastPracticedAt: null }
    };
    onComplete(newScript);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {step === Step.QUESTION && "Step 1: The Question"}
          {step === Step.KOREAN_DRAFT && "Step 2: Content Strategy"}
          {step === Step.ENGLISH_SCRIPT && "Step 3: English Phrasing"}
          {step === Step.REVIEW && "Final Review"}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
      </div>

      {step === Step.QUESTION && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-lg font-medium italic">
            "{loading ? "Thinking..." : question}"
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchQuestion} variant="secondary" isLoading={loading} className="w-1/3 text-sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Skip
            </Button>
            <Button onClick={handleGenerateKorean} className="flex-1" isLoading={loading}>
              Next: Plan Content
            </Button>
          </div>
        </div>
      )}

      {step === Step.KOREAN_DRAFT && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-indigo-500 uppercase flex items-center mb-2">
            <Layers className="w-3 h-3 mr-1" /> Utilizing familiar patterns
          </div>
          {koreanSamples.map((sample, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedKorean(sample)}
              className={`p-4 rounded-xl border cursor-pointer transition-all text-sm ${
                selectedKorean === sample ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200'
              }`}
            >
              {sample}
            </div>
          ))}
          <Button onClick={handleGenerateEnglish} className="w-full mt-4" disabled={!selectedKorean} isLoading={loading}>
            Create English Script
          </Button>
        </div>
      )}

      {step === Step.ENGLISH_SCRIPT && (
        <div className="space-y-4">
          {englishSamples.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedEnglish({ text: item.text, logicFlow: item.logicFlow })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedEnglish?.text === item.text ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-indigo-500 px-2 py-0.5 border border-indigo-200 rounded">{item.label}</span>
              </div>
              <p className="text-slate-700 text-sm mb-3">{item.text}</p>
              <div className="flex flex-wrap gap-1">
                {item.logicFlow.map((flow, i) => (
                  <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex items-center">
                    {i > 0 && <ArrowRight className="w-2 h-2 mr-1 opacity-30" />} {flow}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={() => setStep(Step.REVIEW)} className="w-full mt-4" disabled={!selectedEnglish}>
            Next: Review
          </Button>
        </div>
      )}

      {step === Step.REVIEW && (
          <div className="space-y-6">
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Logic Flow</label>
                  <div className="flex gap-2">
                      {selectedEnglish?.logicFlow.map((f, i) => (
                          <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">{f}</span>
                      ))}
                  </div>
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Script</label>
                  <p className="text-slate-800 text-sm bg-slate-50 p-4 rounded-lg leading-relaxed font-medium italic">
                    "{selectedEnglish?.text}"
                  </p>
              </div>
              <Button onClick={handleSave} className="w-full">Save to My Library</Button>
          </div>
      )}
    </div>
  );
};