import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Quote, AlertCircle, CheckCircle2, Bookmark } from 'lucide-react';
import { CriterionAssessment } from '../types';

interface CriterionCardProps {
  criterion: CriterionAssessment;
  badgeLabel?: string;
}

export const CriterionCard: React.FC<CriterionCardProps> = ({ criterion, badgeLabel }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { score, criterionName, explanation, descriptorCharacteristics, specificEvidence, whatPreventsNextBand } = criterion;

  let scoreColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
  if (score >= 7.5) {
    scoreColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  } else if (score >= 6.5) {
    scoreColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  } else if (score >= 5.5) {
    scoreColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else {
    scoreColor = 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800';
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/50 transition"
      >
        <div className="flex items-center space-x-3.5">
          <div className={`flex items-center justify-center w-11 h-11 rounded-xl border font-mono font-bold text-lg ${scoreColor}`}>
            {score.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {criterionName}
              </h4>
              {badgeLabel && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {badgeLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {explanation}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Explanation */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Examiner Assessment Rationale
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
              {explanation}
            </p>
          </div>

          {/* Descriptor Characteristics Matched */}
          {descriptorCharacteristics && descriptorCharacteristics.length > 0 && (
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-850/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                <Bookmark className="w-3.5 h-3.5" />
                <span>May 2023 Official Descriptors Matched:</span>
              </div>
              <ul className="space-y-1 pl-1">
                {descriptorCharacteristics.map((char, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-600 dark:text-slate-300">
                    <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specific Evidence from Essay */}
          {specificEvidence && specificEvidence.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Evidence from Candidate's Script
              </span>
              <div className="space-y-1.5">
                {specificEvidence.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-2 p-2.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-300"
                  >
                    <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="font-mono text-[11px]">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Prevents Next Band */}
          {whatPreventsNextBand && (
            <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px]">What Prevents Achieving Band {(score + 0.5).toFixed(1)}:</span>
                <span className="mt-0.5 block">{whatPreventsNextBand}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
