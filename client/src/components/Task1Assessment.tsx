import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, FileText, BarChart3, RotateCcw, BookOpen } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';
import { WordCounter } from './WordCounter';
import { LoadingIndicator } from './LoadingIndicator';
import { submitAssessment } from '../services/api';
import { AssessmentResult } from '../types';
import { TASK_1_SAMPLES } from '../services/sampleData';

interface Task1AssessmentProps {
  onBack: () => void;
  onAssessmentComplete: (result: AssessmentResult, essayText: string) => void;
}

export const Task1Assessment: React.FC<Task1AssessmentProps> = ({ onBack, onAssessmentComplete }) => {
  const [questionText, setQuestionText] = useState('');
  const [essayText, setEssayText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wordCount = essayText.trim() ? (essayText.trim().match(/\b[\w'-]+\b/g)?.length || 0) : 0;

  const handleSelectSample = (sampleId: string) => {
    const sample = TASK_1_SAMPLES.find((s) => s.id === sampleId);
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
      setErrorMsg('Please paste or type your written answer before analyzing.');
      return;
    }

    if (!questionText.trim() && files.length === 0) {
      setErrorMsg('Please provide the question text or upload a chart/graph image or PDF.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitAssessment('task1', questionText, essayText, files);
      onAssessmentComplete(result, essayText);
    } catch (err: any) {
      setErrorMsg(err.message || 'Assessment failed. Please verify your Groq API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator taskType="task1" hasVisuals={files.length > 0} />;
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
                Academic Writing Task 1
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Visual Report
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Line graphs, bar charts, pie charts, tables, maps, and process diagrams • Recommended: 150+ words (20 mins)
            </p>
          </div>
        </div>

        {/* Sample Loaders */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Samples:</span>
          </span>
          {TASK_1_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s.id)}
              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            >
              {s.visualType}
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

      {/* Section 1: Question and Visual Material */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            1. Visual Question & Material
          </h3>
        </div>

        {/* Visual Upload Zone */}
        <FileUploadZone
          files={files}
          onFilesChange={setFiles}
          acceptLabel="Upload chart/diagram image (JPG, PNG, WEBP) or past paper PDF"
        />

        {/* Text Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Question Prompt Text</span>
            <span className="text-[11px] text-slate-400 font-normal">
              (e.g., "The graph below shows...")
            </span>
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="Paste the official Task 1 prompt text here..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Section 2: Candidate's Written Answer */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              2. Your Written Report
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Structure: Intro • Overview • Data Paragraphs
          </span>
        </div>

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          rows={11}
          placeholder="Paste or write your full Task 1 answer here (include an overview identifying main trends or key features)..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 resize-y"
        />

        {/* Word Counter */}
        <WordCounter count={wordCount} minRecommended={150} label="Report Word Count" />
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleAnalyze}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Task 1 Report</span>
        </button>
      </div>
    </div>
  );
};
