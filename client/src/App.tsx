import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Task1Assessment } from './components/Task1Assessment';
import { Task2Assessment } from './components/Task2Assessment';
import { AssessmentResults } from './components/AssessmentResults';
import { SettingsModal } from './components/SettingsModal';
import { DescriptorsModal } from './components/DescriptorsModal';
import { AssessmentResult, TaskType } from './types';
import { checkServerHealth, getStoredSettings } from './services/api';

export function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'task1' | 'task2' | 'results'>('dashboard');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [originalEssayText, setOriginalEssayText] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDescriptorsOpen, setIsDescriptorsOpen] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Check health and API key presence
  const refreshApiKeyStatus = async () => {
    const local = getStoredSettings();
    if (local.apiKey && local.apiKey.trim().length > 0) {
      setIsApiKeySet(true);
      return;
    }

    try {
      const health = await checkServerHealth();
      if (health.config?.hasEnvApiKey) {
        setIsApiKeySet(true);
      } else {
        setIsApiKeySet(false);
      }
    } catch {
      setIsApiKeySet(false);
    }
  };

  useEffect(() => {
    refreshApiKeyStatus();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleAssessmentComplete = (result: AssessmentResult, essayText: string) => {
    setAssessmentResult(result);
    setOriginalEssayText(essayText);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEdit = () => {
    if (assessmentResult?.taskType === 'task1') {
      setCurrentView('task1');
    } else {
      setCurrentView('task2');
    }
  };

  const handleNewAssessment = () => {
    setAssessmentResult(null);
    setOriginalEssayText('');
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDescriptors={() => setIsDescriptorsOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isApiKeySet={isApiKeySet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            onSelectTask={(task: TaskType) => setCurrentView(task)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenDescriptors={() => setIsDescriptorsOpen(true)}
            isApiKeySet={isApiKeySet}
          />
        )}

        {currentView === 'task1' && (
          <Task1Assessment
            onBack={() => setCurrentView('dashboard')}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}

        {currentView === 'task2' && (
          <Task2Assessment
            onBack={() => setCurrentView('dashboard')}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}

        {currentView === 'results' && assessmentResult && (
          <AssessmentResults
            result={assessmentResult}
            originalText={originalEssayText}
            onBackToEdit={handleBackToEdit}
            onNewAssessment={handleNewAssessment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Personal IELTS Writing Examiner • May 2023 Band Descriptors</span>
          <span>Zero database retention • Private & local</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={refreshApiKeyStatus}
      />

      {/* Official Band Descriptors Modal */}
      <DescriptorsModal
        isOpen={isDescriptorsOpen}
        onClose={() => setIsDescriptorsOpen(false)}
      />
    </div>
  );
}

export default App;
