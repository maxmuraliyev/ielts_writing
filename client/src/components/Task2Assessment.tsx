import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, FileText, HelpCircle, RotateCcw, BookOpen } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';
import { WordCounter } from './WordCounter';
import { LoadingIndicator } from './LoadingIndicator';
import { submitAssessment } from '../services/api';
import { AssessmentResult } from '../types';
import { TASK_2_SAMPLES } from '../services/sampleData';

interface Task2AssessmentProps {
  onBack: () => void;
  onAssessmentComplete: (result: AssessmentResult, essayText: string) => void;
}

export const Task2Assessment: React.FC<Task2AssessmentProps> = ({ onBack, onAssessmentComplete }) => {
  const [questionText, setQuestionText] = useState('');
  const [essayText, setEssayText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wordCount = essayText.trim() ? (essayText.trim().match(/\b[\w'-]+\b/g)?.length || 0) : 0;

  const handleSelectSample = (sampleId: string) => {
    const sample = TASK_2_SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setQuestionText(sample.question);
      setEssayText(sample.sampleEssay);
      setFiles([]);
      setErrorMsg(null);
    }
  };

  const handleReset = () => {
    setQuestionText('');
    setEssayText('');
    setFiles([]);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    setErrorMsg(null);

    if (!essayText.trim()) {
      setErrorMsg('Please paste or type your written essay before analyzing.');
      return;
    }

    if (!questionText.trim() && files.length === 0) {
      setErrorMsg('Please provide the Task 2 question topic or upload a prompt document.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitAssessment('task2', questionText, essayText, files);
      onAssessmentComplete(result, essayText);
    } catch (err: any) {
      setErrorMsg(err.message || 'Assessment failed. Please verify your Groq API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator taskType="task2" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Writing Task 2 Essay
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Academic Essay
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Opinion, Discussion, Problem-Solution, Two-Part, Advantages-Disadvantages • Recommended: 250+ words (40 mins)
            </p>
          </div>
        </div>

        {/* Sample Loaders */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Samples:</span>
          </span>
          {TASK_2_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s.id)}
              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            >
              {s.questionType}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Reset form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Assessment Error:</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Section 1: Task 2 Question Prompt */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            1. Essay Question Prompt
          </h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Question Topic</span>
            <span className="text-[11px] text-slate-400 font-normal">
              State the prompt or question clearly
            </span>
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="Type or paste the IELTS Task 2 prompt (e.g., 'Some people think that universities should focus on...')"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Optional file upload for prompt PDF / screenshot */}
        <details className="text-xs text-slate-500 group">
          <summary className="cursor-pointer font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition select-none">
            + Optional: Upload screenshot or PDF of question paper
          </summary>
          <div className="pt-3">
            <FileUploadZone
              files={files}
              onFilesChange={setFiles}
              acceptLabel="Upload exam prompt image or PDF"
            />
          </div>
        </details>
      </div>

      {/* Section 2: Candidate's Essay */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              2. Your Written Essay
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Structure: Introduction • Body 1 • Body 2 • Conclusion
          </span>
        </div>

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          rows={14}
          placeholder="Paste or write your full IELTS Task 2 essay here..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 resize-y"
        />

        {/* Word Counter */}
        <WordCounter count={wordCount} minRecommended={250} label="Essay Word Count" />
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleAnalyze}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Task 2 Essay</span>
        </button>
      </div>
    </div>
  );
};
