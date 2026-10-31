import React, { useState } from 'react';
import { Check, Copy, AlertCircle, Sparkles } from 'lucide-react';
import { GrammarCorrection } from '../types';

interface GrammarCorrectionsViewProps {
  corrections: GrammarCorrection[];
}

export const GrammarCorrectionsView: React.FC<GrammarCorrectionsViewProps> = ({ corrections }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!corrections || corrections.length === 0) {
    return (
      <div className="p-8 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
        <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No Significant Grammatical Errors Detected
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your grammatical control is strong with high error-free sentence frequency.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Grammar & Sentence Structure Corrections
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {corrections.length} key grammatical issue{corrections.length === 1 ? '' : 's'} identified
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {corrections.map((corr, idx) => (
          <div
            key={idx}
            className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                {corr.category || 'Grammar'}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(corr.corrected, idx)}
                className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                title="Copy corrected sentence"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Fix</span>
                  </>
                )}
              </button>
            </div>

            {/* Original vs Corrected */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                <span className="text-[10px] uppercase font-bold text-red-500 block mb-0.5">Original:</span>
                <span className="font-mono text-red-900 dark:text-red-200 line-through decoration-red-400">
                  {corr.original}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Corrected:</span>
                <span className="font-mono font-medium text-emerald-900 dark:text-emerald-200">
                  {corr.corrected}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{corr.explanation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
