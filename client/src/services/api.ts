import { AssessmentResult, AppSettings, TaskType } from '../types';

export const SETTINGS_KEY = 'ielts_examiner_settings';

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.textModel || parsed.textModel.includes('llama') || parsed.textModel.includes('mixtral')) {
        parsed.textModel = 'openai/gpt-oss-120b';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse settings from localStorage', e);
  }
  return {
    apiKey: '',
    textModel: 'openai/gpt-oss-120b',
    visionModel: 'qwen/qwen3.8-27b'
  };
}

export function saveStoredSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getAuthHeaders(): Record<string, string> {
  const settings = getStoredSettings();
  const headers: Record<string, string> = {};
  if (settings.apiKey.trim()) {
    headers['x-groq-api-key'] = settings.apiKey.trim();
  }
  if (settings.textModel.trim()) {
    headers['x-groq-text-model'] = settings.textModel.trim();
  }
  if (settings.visionModel.trim()) {
    headers['x-groq-vision-model'] = settings.visionModel.trim();
  }
  return headers;
}

export async function checkServerHealth() {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

export async function fetchGroqModels() {
  const res = await fetch('/api/models', {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
  return res.json();
}

export async function fetchBandDescriptors(taskType: TaskType) {
  const res = await fetch(`/api/models/descriptors/${taskType}`);
  if (!res.ok) throw new Error(`Failed to fetch descriptors: ${res.status}`);
  return res.json();
}

export async function submitAssessment(
  taskType: TaskType,
  questionText: string,
  essayText: string,
  files: File[] = []
): Promise<AssessmentResult> {
  const formData = new FormData();
  formData.append('taskType', taskType);
  formData.append('questionText', questionText);
  formData.append('essayText', essayText);

  for (const file of files) {
    formData.append('files', file);
  }

  const res = await fetch('/api/assess', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Assessment failed with status ${res.status}`);
  }

  return data as AssessmentResult;
}
