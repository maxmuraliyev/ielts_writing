import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface WordCounterProps {
  count: number;
  minRecommended: number;
  label?: string;
}

export const WordCounter: React.FC<WordCounterProps> = ({
  count,
  minRecommended,
  label = 'Word Count'
}) => {
  const isSevereUnderlength = count > 0 && count <= 20;
  const isUnderlength = count > 20 && count < minRecommended;
  const isAdequate = count >= minRecommended;

  let badgeColor = 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  let message = `Recommended: at least ${minRecommended} words`;

  if (isSevereUnderlength) {
    badgeColor = 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800';
    message = 'Official Rubric: Responses of 20 words or fewer are rated at Band 1!';
  } else if (isUnderlength) {
    badgeColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
    message = `${minRecommended - count} words short of recommended ${minRecommended} words`;
  } else if (isAdequate) {
    badgeColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
    message = `Meets recommended minimum length (${count} / ${minRecommended})`;
  }

  return (
    <div className="flex items-center justify-between text-xs py-1">
      <div className="flex items-center space-x-2">
        <span className="text-slate-500 dark:text-slate-400 font-medium">{label}:</span>
        <span className={`px-2 py-0.5 rounded-full font-mono font-semibold border ${badgeColor}`}>
          {count} {count === 1 ? 'word' : 'words'}
        </span>
      </div>
      <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
        {isAdequate ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        ) : isSevereUnderlength ? (
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
        ) : isUnderlength ? (
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        ) : null}
        <span className="hidden sm:inline">{message}</span>
      </div>
    </div>
  );
};
