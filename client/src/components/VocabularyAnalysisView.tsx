import React from 'react';
import { BookOpen, RefreshCw, AlertTriangle, ArrowRight, Sparkles, Feather } from 'lucide-react';
import { VocabularyAnalysis } from '../types';

interface VocabularyAnalysisViewProps {
  vocabulary: VocabularyAnalysis;
}

export const VocabularyAnalysisView: React.FC<VocabularyAnalysisViewProps> = ({ vocabulary }) => {
  const {
    repetitiveVocabulary = [],
    inaccurateWordChoices = [],
    awkwardCollocations = [],
    informalExpressions = [],
    precisionOpportunities = []
  } = vocabulary;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Lexical Resource & Vocabulary Analysis
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Targeted improvements to expand lexical precision without artificial vocabulary stuffing
        </p>
      </div>

      {/* Repetitive Words */}
      {repetitiveVocabulary.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <span>Repetitive Vocabulary & Suggested Synonyms</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {repetitiveVocabulary.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    "{item.word}"
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium">
                    Used {item.count} times
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Alternatives: </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {item.suggestedAlternatives.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inaccurate Word Choices */}
      {inaccurateWordChoices.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Inaccurate Word Choices & Meaning Distortions</span>
          </div>
          <div className="space-y-2">
            {inaccurateWordChoices.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-red-50/40 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 space-y-1.5 text-xs"
              >
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-red-700 dark:text-red-400 line-through">"{item.original}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">"{item.suggested}"</span>
                </div>
                {item.context && (
                  <p className="text-[11px] text-slate-500 italic">Context: "{item.context}"</p>
                )}
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awkward Collocations */}
      {awkwardCollocations.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Feather className="w-4 h-4 text-indigo-500" />
            <span>Collocation Refinements</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {awkwardCollocations.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-slate-500 line-through">"{item.original}"</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">"{item.naturalAlternative}"</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informal Expressions */}
      {informalExpressions.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>Academic Register Adjustments</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {informalExpressions.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1 text-xs"
              >
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-purple-600 dark:text-purple-400 line-through">"{item.original}"</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-purple-900 dark:text-purple-200 font-bold">"{item.formalAlternative}"</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Precision Opportunities */}
      {precisionOpportunities.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Opportunities for Higher Precision</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {precisionOpportunities.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1 text-xs"
              >
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-slate-500 line-through">"{item.original}"</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-800 dark:text-emerald-200 font-bold">"{item.preciseAlternative}"</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
