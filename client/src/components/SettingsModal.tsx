import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, Eye, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';
import { getStoredSettings, saveStoredSettings, fetchGroqModels } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsSaved }) => {
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    textModel: 'llama-3.3-70b-versatile',
    visionModel: 'qwen/qwen3.8-27b'
  });
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredSettings());
      setTestStatus('idle');
      setTestMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredSettings(settings);
    if (onSettingsSaved) onSettingsSaved();
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('loading');
    setTestMessage(null);
    try {
      saveStoredSettings(settings);
      const res = await fetchGroqModels();
      if (res.groqLiveModels?.success) {
        const count = res.groqLiveModels.models?.length || 0;
        setTestStatus('success');
        setTestMessage(`Connection successful! ${count} models accessible under your Groq account.`);
      } else {
        setTestStatus('error');
        setTestMessage(res.groqLiveModels?.error || 'Failed to authenticate with Groq API.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Error reaching server or Groq endpoint.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Groq AI Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your Groq API key and AI evaluation models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Groq API Key</span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-normal hover:underline"
              >
                {showKey ? 'Hide' : 'Reveal'}
              </button>
            </label>
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="gsk_..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            />
            <p className="text-[11px] text-slate-400">
              Leave blank if already configured in backend <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">.env</code>. You can get an API key at console.groq.com.
            </p>
          </div>

          {/* Text Model */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Text & Evaluation Model</span>
            </label>
            <select
              value={settings.textModel}
              onChange={(e) => setSettings({ ...settings, textModel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Recommended - 131k context, top reasoning)</option>
              <option value="qwen/qwen3.8-27b">qwen/qwen3.8-27b (Multimodal 27B - 131k context)</option>
              <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (Fast 20B - 131k context)</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (If available on account)</option>
            </select>
          </div>

          {/* Vision Model */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span>Vision Model (for Task 1 Charts)</span>
            </label>
            <select
              value={settings.visionModel}
              onChange={(e) => setSettings({ ...settings, visionModel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="qwen/qwen3.8-27b">qwen/qwen3.8-27b (Groq Multimodal Vision - High accuracy chart reading)</option>
            </select>
          </div>


          {/* Test Status Message */}
          {testMessage && (
            <div
              className={`p-3 rounded-lg border flex items-start space-x-2 text-xs ${
                testStatus === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'loading'}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition disabled:opacity-50"
          >
            {testStatus === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span>Test Connection</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
