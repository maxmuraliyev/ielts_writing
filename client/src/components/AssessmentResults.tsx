import React, { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Award,
  CheckCircle2,
  FileText,
  SpellCheck,
  BookOpen,
  GitMerge,
  Sparkles,
  Target,
  BarChart2,
  HelpCircle,
  Download
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { BandScoreCard } from './BandScoreCard';
import { CriterionCard } from './CriterionCard';
import { GrammarCorrectionsView } from './GrammarCorrectionsView';
import { VocabularyAnalysisView } from './VocabularyAnalysisView';
import { CoherenceAnalysisView } from './CoherenceAnalysisView';
import { RefinedEssayView } from './RefinedEssayView';
import { ImprovementPlanView } from './ImprovementPlanView';

interface AssessmentResultsProps {
  result: AssessmentResult;
  originalText: string;
  onBackToEdit: () => void;
  onNewAssessment: () => void;
}

type TabType = 'overview' | 'grammar' | 'vocabulary' | 'coherence' | 'refined' | 'plan';

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  result,
  originalText,
  onBackToEdit,
  onNewAssessment
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedReport, setCopiedReport] = useState(false);

  const {
    taskType,
    criteria,
    grammarCorrections = [],
    vocabularyAnalysis,
    coherenceAnalysis,
    refinedEssay,
    improvementPlan = [],
    strengths = [],
    weaknesses = [],
    visualAnalysis,
    promptAnalysis,
    modelUsed
  } = result;

  const copyFullReport = () => {
    const textReport = `IELTS WRITING EXAMINER - ASSESSMENT REPORT
--------------------------------------------------
Task: ${taskType === 'task1' ? 'Task 1 (Academic)' : 'Task 2 (Essay)'}
Word Count: ${result.wordCount} words
Estimated Overall Band: ${result.overallBand.toFixed(1)}

CRITERION SCORES:
- ${taskType === 'task1' ? 'Task Achievement' : 'Task Response'}: ${criteria.taskAchievementOrResponse.score.toFixed(1)}
- Coherence & Cohesion: ${criteria.coherenceCohesion.score.toFixed(1)}
- Lexical Resource: ${criteria.lexicalResource.score.toFixed(1)}
- Grammatical Range & Accuracy: ${criteria.grammaticalRangeAccuracy.score.toFixed(1)}

EXAMINER SUMMARY:
${result.summary}

REFINED MODEL ESSAY (Band 8-9):
${refinedEssay.refinedText}

IMPROVEMENT PLAN:
${improvementPlan.map((p, i) => `${i + 1}. [${p.targetCriterion}] ${p.action} - ${p.rationale}`).join('\n')}
--------------------------------------------------
Evaluated using Official May 2023 IELTS Writing Band Descriptors.`;

    navigator.clipboard.writeText(textReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToEdit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Editor</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={onNewAssessment}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            + New Assessment
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {modelUsed && (
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Model: {modelUsed}
            </span>
          )}
          <button
            onClick={copyFullReport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Report Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Full Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Overall Estimated Band Score Card */}
      <BandScoreCard result={result} />

      {/* Visual / Prompt Analysis Pill (if available) */}
      {taskType === 'task1' && visualAnalysis && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <BarChart2 className="w-4 h-4" />
            <span>Factual Visual Material Analysis ({visualAnalysis.visualType || 'Task 1 Material'})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <div>
              <strong className="text-slate-700 dark:text-slate-300">Subject: </strong>
              {visualAnalysis.titleSubject}
            </div>
            {visualAnalysis.units && (
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Units: </strong>
                {visualAnalysis.units}
              </div>
            )}
          </div>
          {visualAnalysis.numericalAccuracyNotes && (
            <p className="text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
              <strong className="text-slate-700 dark:text-slate-300">Data Accuracy: </strong>
              {visualAnalysis.numericalAccuracyNotes}
            </p>
          )}
        </div>
      )}

      {taskType === 'task2' && promptAnalysis && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Essay Prompt Classification: {promptAnalysis.questionType.toUpperCase()}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            <strong className="text-slate-700 dark:text-slate-200">Position Clarity: </strong>
            {promptAnalysis.positionClarity}
          </p>
        </div>
      )}

      {/* Navigation Tabs for In-Depth Assessment */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4 Criteria Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('refined')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'refined'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Refined Model (Band 8–9)</span>
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'grammar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SpellCheck className="w-3.5 h-3.5" />
            <span>Grammar Fixes ({grammarCorrections.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'vocabulary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Vocabulary Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('coherence')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'coherence'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Coherence & Flow</span>
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'plan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Improvement Plan</span>
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Official IELTS May 2023 Criteria Breakdown
            </h3>
            <span className="text-xs text-slate-400">
              Each criterion evaluated strictly and independently
            </span>
          </div>

          <div className="space-y-3.5">
            <CriterionCard
              criterion={criteria.taskAchievementOrResponse}
              badgeLabel={taskType === 'task1' ? 'TA' : 'TR'}
            />
            <CriterionCard
              criterion={criteria.coherenceCohesion}
              badgeLabel="CC"
            />
            <CriterionCard
              criterion={criteria.lexicalResource}
              badgeLabel="LR"
            />
            <CriterionCard
              criterion={criteria.grammaticalRangeAccuracy}
              badgeLabel="GRA"
            />
          </div>
        </div>
      )}

      {activeTab === 'refined' && (
        <RefinedEssayView refinedEssay={refinedEssay} originalText={originalText} />
      )}

      {activeTab === 'grammar' && (
        <GrammarCorrectionsView corrections={grammarCorrections} />
      )}

      {activeTab === 'vocabulary' && (
        <VocabularyAnalysisView vocabulary={vocabularyAnalysis} />
      )}

      {activeTab === 'coherence' && (
        <CoherenceAnalysisView coherence={coherenceAnalysis} />
      )}

      {activeTab === 'plan' && (
        <ImprovementPlanView
          plan={improvementPlan}
          strengths={strengths}
          weaknesses={weaknesses}
        />
      )}
    </div>
  );
};
