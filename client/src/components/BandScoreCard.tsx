import React from 'react';
import { Award, AlertTriangle, Calculator, FileText, CheckCircle2 } from 'lucide-react';
import { AssessmentResult } from '../types';

interface BandScoreCardProps {
  result: AssessmentResult;
}

export const BandScoreCard: React.FC<BandScoreCardProps> = ({ result }) => {
  const { overallBand, calculationBreakdown, wordCount, taskType, summary } = result;

  // Color coding according to band level
  let bandColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
  if (overallBand >= 7.5) {
    bandColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  } else if (overallBand >= 6.5) {
    bandColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  } else if (overallBand >= 5.5) {
    bandColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else {
    bandColor = 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800';
  }

  const taskTitle = taskType === 'task1' ? 'Academic Writing Task 1' : 'Writing Task 2 Essay';
  const minRecommended = taskType === 'task1' ? 150 : 250;

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
      {/* Official Disclaimer */}
      <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-200">Official IELTS Scoring Methodology: </span>
          This is an <span className="font-semibold text-slate-900 dark:text-slate-100">Estimated Band Score</span> calculated strictly using the May 2023 IELTS Writing Band Descriptors. It is an independent private diagnostic preparation tool and not an official test result.
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Diagnostic Assessment
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {taskTitle}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Estimated Overall Band Score
          </h2>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Length: <strong className="text-slate-700 dark:text-slate-200">{wordCount} words</strong> (min {minRecommended})</span>
            </span>
            <span>•</span>
            <span>Evaluated with Official May 2023 Criteria</span>
          </div>
        </div>

        {/* Big Band Score Badge */}
        <div className="flex items-center space-x-4">
          <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 ${bandColor} shadow-xs`}>
            <span className="text-4xl font-extrabold tracking-tight font-mono">
              {overallBand.toFixed(1)}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80 mt-0.5">
              Band Score
            </span>
          </div>
        </div>
      </div>

      {/* Official Calculation Breakdown */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Calculator className="w-4 h-4 text-indigo-500" />
          <span>IELTS Rounding & Calculation Breakdown</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">{taskType === 'task1' ? 'Task Achievement' : 'Task Response'}</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {calculationBreakdown.individualScores.taskAchievementOrResponse.toFixed(1)}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Coherence & Cohesion</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {calculationBreakdown.individualScores.coherenceCohesion.toFixed(1)}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Lexical Resource</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {calculationBreakdown.individualScores.lexicalResource.toFixed(1)}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Grammar & Accuracy</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
              {calculationBreakdown.individualScores.grammaticalRangeAccuracy.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
          {calculationBreakdown.ruleApplied}
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Examiner Assessment Summary
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {summary}
        </p>
      </div>
    </div>
  );
};
