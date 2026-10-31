import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle, Eye, FileSearch, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { TaskType } from '../types';

interface LoadingIndicatorProps {
  taskType: TaskType;
  hasVisuals?: boolean;
}

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ taskType, hasVisuals }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      id: 'step1',
      label: 'Reading and validating question prompt & submitted essay...',
      icon: <FileSearch className="w-4 h-4" />
    },
    ...(taskType === 'task1' && hasVisuals
      ? [
          {
            id: 'step2',
            label: 'Analyzing visual diagram: extracting categories, units, trends & data points...',
            icon: <Eye className="w-4 h-4" />
          }
        ]
      : []),
    {
      id: 'step3',
      label: 'Loading Official May 2023 IELTS Writing Band Descriptors...',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'step4',
      label: 'Conducting independent criterion evaluation (TA/TR, CC, LR, GRA)...',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'step5',
      label: 'Detecting grammar issues, analyzing vocabulary & crafting refined Band 8-9 version...',
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="py-12 px-6 max-w-xl mx-auto text-center space-y-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-sm">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Assessing Writing Submission
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Strict diagnostic assessment against the Official May 2023 IELTS Writing Band Descriptors
        </p>
      </div>

      {/* Step progression card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-5 text-left space-y-3.5 shadow-xs">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 transition-opacity ${
                isActive
                  ? 'opacity-100 text-indigo-600 dark:text-indigo-400 font-medium'
                  : isDone
                  ? 'opacity-80 text-emerald-600 dark:text-emerald-400'
                  : 'opacity-40 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                )}
              </div>
              <span className="text-xs">{step.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
        Comprehensive evaluation typically takes 10 to 25 seconds for thorough analysis.
      </p>
    </div>
  );
};
