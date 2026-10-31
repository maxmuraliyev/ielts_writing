import React, { useState } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { TaskType } from '../types';

interface DescriptorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DescriptorsModal: React.FC<DescriptorsModalProps> = ({ isOpen, onClose }) => {
  const [activeTask, setActiveTask] = useState<TaskType>('task1');
  const [activeBand, setActiveBand] = useState<number>(7);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Official IELTS Writing Band Descriptors (May 2023)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Primary assessment rubric for IELTS Academic Writing Task 1 & Task 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Selection & Note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveTask('task1')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTask === 'task1'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Writing Task 1 (Academic)
              </button>
              <button
                type="button"
                onClick={() => setActiveTask('task2')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTask === 'task2'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Writing Task 2 (Essay)
              </button>
            </div>

            {/* Band selector buttons */}
            <div className="flex items-center space-x-1">
              {[9, 8, 7, 6, 5, 4, 3].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActiveBand(b)}
                  className={`w-7 h-7 rounded-md font-mono text-xs font-bold transition ${
                    activeBand === b
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Official Rubric Rule:</strong> A script must fully fit the positive features of the descriptor at a particular level. Bolded text indicates negative features that will limit a rating.
            </span>
          </div>
        </div>

        {/* Scrollable Descriptor Grid for Active Band */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono">
                Band {activeBand}
              </span>
              <span>{activeTask === 'task1' ? 'Task 1 Descriptors' : 'Task 2 Descriptors'}</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Criterion 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {activeTask === 'task1' ? 'Task Achievement (TA)' : 'Task Response (TR)'}
              </span>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                {activeBand === 9 && (
                  <>
                    <li>• All the requirements of the task are fully and appropriately satisfied.</li>
                    <li>• There may be extremely rare lapses in content.</li>
                  </>
                )}
                {activeBand === 8 && (
                  <>
                    <li>• The response covers all the requirements of the task appropriately, relevantly and sufficiently.</li>
                    <li>• (Academic) Key features are skilfully selected, and clearly presented, highlighted and illustrated.</li>
                    <li>• There may be occasional omissions or lapses in content.</li>
                  </>
                )}
                {activeBand === 7 && (
                  <>
                    <li>• The response covers the requirements of the task. Content is relevant and accurate (few omissions or lapses).</li>
                    <li>• (Academic) Key features are covered and clearly highlighted.</li>
                    <li>• (Academic) It presents a clear overview, data are appropriately categorised, and main trends or differences are identified.</li>
                  </>
                )}
                {activeBand === 6 && (
                  <>
                    <li>• Focuses on task requirements; appropriate format used.</li>
                    <li>• (Academic) Key features covered and adequately highlighted. A relevant overview is attempted. Information supported using figures/data.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Limiting factor: Some irrelevant, inappropriate or inaccurate information in areas of detail.</li>
                  </>
                )}
                {activeBand === 5 && (
                  <>
                    <li>• Generally addresses requirements. Format may be inappropriate in places.</li>
                    <li>• (Academic) Key features are not adequately covered. Recounting of detail is mainly mechanical.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Limiting factor: There may be no data to support the description, or irrelevant/inaccurate material detracts from task achievement.</li>
                  </>
                )}
                {activeBand <= 4 && (
                  <li>• Few key features selected; response is an attempt or tangential. Inaccurate, repetitive, or incomplete.</li>
                )}
              </ul>
            </div>

            {/* Criterion 2 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Coherence & Cohesion (CC)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                {activeBand === 9 && (
                  <>
                    <li>• Message followed effortlessly. Cohesion used in a way that very rarely attracts attention.</li>
                    <li>• Paragraphing is skilfully managed.</li>
                  </>
                )}
                {activeBand === 8 && (
                  <>
                    <li>• Followed with ease. Information and ideas logically sequenced, cohesion well managed.</li>
                    <li>• Paragraphing used sufficiently and appropriately.</li>
                  </>
                )}
                {activeBand === 7 && (
                  <>
                    <li>• Logically organised with clear progression throughout.</li>
                    <li>• Range of cohesive devices (reference & substitution) used flexibly with some inaccuracies/overuse.</li>
                    <li>• Paragraphing generally used effectively to support overall coherence.</li>
                  </>
                )}
                {activeBand === 6 && (
                  <>
                    <li>• Information arranged coherently with clear overall progression.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Cohesive devices used to some good effect but cohesion within/between sentences may be faulty or mechanical due to misuse or overuse.</li>
                  </>
                )}
                {activeBand === 5 && (
                  <>
                    <li>• Organisation is evident but not wholly logical. Lack of overall progression.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Sentences not fluently linked; limited/overuse of cohesive devices with inaccuracy; repetitive reference.</li>
                  </>
                )}
                {activeBand <= 4 && (
                  <li>• Relationships between ideas unclear; basic cohesive devices inaccurate or repetitive; paragraphing lacking or inadequate.</li>
                )}
              </ul>
            </div>

            {/* Criterion 3 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Lexical Resource (LR)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                {activeBand === 9 && (
                  <>
                    <li>• Full flexibility and precise use are evident. Wide range of vocabulary used accurately and appropriately.</li>
                    <li>• Minor errors in spelling/word formation extremely rare.</li>
                  </>
                )}
                {activeBand === 8 && (
                  <>
                    <li>• Wide resource fluently and flexibly used to convey precise meanings.</li>
                    <li>• Skilful use of uncommon and idiomatic items despite occasional inaccuracies in word choice/collocation.</li>
                  </>
                )}
                {activeBand === 7 && (
                  <>
                    <li>• Sufficient flexibility and precision. Some ability to use less common/idiomatic items.</li>
                    <li>• Awareness of style and collocation is evident; only a few errors in spelling or word formation.</li>
                  </>
                )}
                {activeBand === 6 && (
                  <>
                    <li>• Generally adequate and appropriate for the task. Meaning is generally clear.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Restricted range or lack of precision; higher degrees of inaccuracy if risk-taking.</li>
                  </>
                )}
                {activeBand === 5 && (
                  <>
                    <li>• Limited but minimally adequate. Simple vocabulary used accurately.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Frequent lapses in word choice appropriacy; frequent simplifications and noticeable spelling errors.</li>
                  </>
                )}
                {activeBand <= 4 && (
                  <li>• Vocabulary basic, repetitive, or inadequate; errors impede meaning.</li>
                )}
              </ul>
            </div>

            {/* Criterion 4 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Grammatical Range & Accuracy (GRA)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                {activeBand === 9 && (
                  <>
                    <li>• Wide range of structures used with full flexibility and control. Punctuation and grammar appropriate throughout.</li>
                  </>
                )}
                {activeBand === 8 && (
                  <>
                    <li>• Wide range of structures flexibly and accurately used. Majority of sentences error-free.</li>
                    <li>• Occasional non-systematic errors have minimal impact on communication.</li>
                  </>
                )}
                {activeBand === 7 && (
                  <>
                    <li>• Variety of complex structures used with some flexibility and accuracy.</li>
                    <li>• Grammar and punctuation generally well controlled; error-free sentences are frequent.</li>
                  </>
                )}
                {activeBand === 6 && (
                  <>
                    <li>• Mix of simple and complex sentence forms used, but flexibility is limited.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Errors in grammar and punctuation occur, but rarely impede communication.</li>
                  </>
                )}
                {activeBand === 5 && (
                  <>
                    <li>• Range of structures limited and rather repetitive. Greatest accuracy on simple sentences.</li>
                    <li className="font-semibold text-amber-700 dark:text-amber-400">• Complex sentences tend to be faulty; grammatical errors may be frequent and cause difficulty.</li>
                  </>
                )}
                {activeBand <= 4 && (
                  <li>• Very limited structures; subordinate clauses rare; errors frequent and impede meaning.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium"
          >
            Close Descriptors
          </button>
        </div>
      </div>
    </div>
  );
};
