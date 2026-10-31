import React from 'react';
import { GitMerge, Layers, Link as LinkIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { CoherenceAnalysis } from '../types';

interface CoherenceAnalysisViewProps {
  coherence: CoherenceAnalysis;
}

export const CoherenceAnalysisView: React.FC<CoherenceAnalysisViewProps> = ({ coherence }) => {
  const {
    paragraphStructure,
    logicalProgression,
    linkingDevices = [],
    referencingAndSubstitution,
    overallCoherenceComment
  } = coherence;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Coherence & Cohesion Analysis
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Evaluation of structural sequencing, paragraph logic, and cohesive device naturalness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paragraph Structure */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Paragraph Structure</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {paragraphStructure}
          </p>
        </div>

        {/* Logical Progression */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <GitMerge className="w-4 h-4 text-emerald-500" />
            <span>Logical Progression</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {logicalProgression}
          </p>
        </div>
      </div>

      {/* Linking Devices Audit */}
      {linkingDevices.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <LinkIcon className="w-4 h-4 text-purple-500" />
              <span>Linking Devices Audit</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Examiners penalize mechanical or overused discourse markers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {linkingDevices.map((item, i) => {
              let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
              if (item.appropriateness === 'effective') {
                badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
              } else if (item.appropriateness === 'overused' || item.appropriateness === 'mechanical') {
                badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
              } else if (item.appropriateness === 'inaccurate') {
                badgeColor = 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
              }

              return (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      "{item.device}"
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider border ${badgeColor}`}>
                      {item.appropriateness}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Referencing & Substitution */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Referencing & Substitution (Pronouns, Demonstratives)</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {referencingAndSubstitution}
        </p>
      </div>

      {/* Overall Coherence Comment */}
      {overallCoherenceComment && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Examiner Summary:</span>
          {overallCoherenceComment}
        </div>
      )}
    </div>
  );
};
