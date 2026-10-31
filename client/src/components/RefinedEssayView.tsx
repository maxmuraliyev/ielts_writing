import React, { useState } from 'react';
import { Sparkles, Copy, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { RefinedEssay } from '../types';

interface RefinedEssayViewProps {
  refinedEssay: RefinedEssay;
  originalText: string;
}

export const RefinedEssayView: React.FC<RefinedEssayViewProps> = ({ refinedEssay, originalText }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'refined' | 'sideBySide'>('refined');

  const copyRefined = () => {
    navigator.clipboard.writeText(refinedEssay.refinedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Examiner Refined Model Version (Band 8–9)
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Preserved Content
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Refined for academic naturalness, grammatical precision, and cohesive flow without altering your ideas
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('refined')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'refined'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Refined Only
            </button>
            <button
              onClick={() => setActiveTab('sideBySide')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'sideBySide'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyRefined}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Refined</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Display */}
      {activeTab === 'refined' ? (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xs">
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
            {refinedEssay.refinedText}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Original Submission
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {originalText}
            </div>
          </div>
          <div className="border border-emerald-200 dark:border-emerald-900/60 rounded-xl bg-white dark:bg-slate-900 p-5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Refined Band 8–9 Model
            </span>
            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {refinedEssay.refinedText}
            </div>
          </div>
        </div>
      )}

      {/* Preservation & Key Changes Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preservation Notes */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850 p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Preservation Integrity Check</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {refinedEssay.preservationNotes || 'All candidate arguments, factual data, and positions were strictly preserved without inventing new facts or thesaurus stuffing.'}
          </p>
        </div>

        {/* Key Changes Made */}
        {refinedEssay.keyChangesMade && refinedEssay.keyChangesMade.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850 p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Key Improvements Applied</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              {refinedEssay.keyChangesMade.map((ch, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
