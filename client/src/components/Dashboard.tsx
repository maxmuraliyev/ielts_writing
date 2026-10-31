import React from 'react';
import { BarChart3, PenTool, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { TaskType } from '../types';

interface DashboardProps {
  onSelectTask: (task: TaskType) => void;
  onOpenSettings: () => void;
  onOpenDescriptors: () => void;
  isApiKeySet: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTask,
  onOpenSettings,
  onOpenDescriptors,
  isApiKeySet
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official May 2023 IELTS Writing Band Descriptors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personal IELTS Writing Examiner
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          A private, strict diagnostic assessment tool designed to evaluate your IELTS Academic writing against official exam rubrics without inflated scores.
        </p>

        {/* API key warning if not set */}
        {!isApiKeySet && (
          <div className="inline-flex items-center space-x-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 mt-2">
            <Key className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Groq API Key is not yet configured.</span>
            <button
              onClick={onOpenSettings}
              className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100"
            >
              Add API Key in Settings
            </button>
          </div>
        )}
      </div>

      {/* Two Large Task Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task 1 Card */}
        <div
          onClick={() => onSelectTask('task1')}
          className="group relative border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
              <BarChart3 className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Academic Task 1
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Visual Report
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Analyze and describe charts, graphs, tables, maps, and process diagrams.
              </p>
            </div>

            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 pt-1">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Upload charts (images or PDFs) + prompt</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Vision model checks data accuracy & overviews</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Minimum 150 words recommended (20 mins)</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition">
            <span>Start Task 1 Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Task 2 Card */}
        <div
          onClick={() => onSelectTask('task2')}
          className="group relative border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
              <PenTool className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Academic Task 2
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Essay
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Write a discursive essay on an opinion, discussion, problem, or advantages.
              </p>
            </div>

            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 pt-1">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Automatic question type identification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Evaluates position, arguments & paragraphing</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Minimum 250 words recommended (40 mins)</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition">
            <span>Start Task 2 Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Assessment Engine Features */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          How Your Writing Is Evaluated
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">
              1. Task Achievement / Response
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Assesses whether all parts are addressed, overviews are clear, data is accurate, and stance is well-developed.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">
              2. Coherence & Cohesion
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Evaluates logical paragraph sequencing, progression of ideas, and flags mechanical or overused linking devices.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">
              3. Lexical Resource
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Identifies repetitive words, unnatural collocations, and informal register, offering natural academic alternatives.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">
              4. Grammatical Range & Accuracy
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Distinguishes error-free complex sentences from faulty structures and provides line-by-line grammar corrections.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p>Private personal study assistant • Zero database storage • Temporary files discarded immediately</p>
        <p>
          Need to review descriptor criteria?{' '}
          <button
            onClick={onOpenDescriptors}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Official May 2023 Band Descriptors
          </button>
        </p>
      </div>
    </div>
  );
};
