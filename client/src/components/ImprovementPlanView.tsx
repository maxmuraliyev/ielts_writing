import React from 'react';
import { Target, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { ImprovementAction } from '../types';

interface ImprovementPlanViewProps {
  plan: ImprovementAction[];
  strengths: string[];
  weaknesses: string[];
}

export const ImprovementPlanView: React.FC<ImprovementPlanViewProps> = ({ plan, strengths, weaknesses }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Personalized Improvement Action Plan
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Prioritized high-leverage steps to elevate your writing to the next IELTS band level
        </p>
      </div>

      {/* Prioritized Action Steps */}
      <div className="space-y-3">
        {plan.map((item, idx) => (
          <div
            key={idx}
            className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4.5 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs">
                  {item.priority || idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {item.action}
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.targetCriterion}
              </span>
            </div>

            <div className="pl-8">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Why this matters: </strong>
                {item.rationale}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Key Strengths Observed</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-1">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {weaknesses && weaknesses.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-amber-50/20 dark:bg-amber-950/10 p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Critical Deficits to Eliminate</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-1">
              {weaknesses.map((wk, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
