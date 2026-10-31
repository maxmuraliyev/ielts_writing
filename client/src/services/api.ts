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

async function handleResponse<T>(res: Response, fallbackError: string): Promise<T> {
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Non-JSON response (e.g. plain text or HTML error page from Vercel/proxy)
  }

  if (!res.ok) {
    const errorMsg =
      json?.error ||
      (text && text.length < 250 ? text : `${fallbackError} (HTTP ${res.status})`);
    throw new Error(errorMsg);
  }

  if (json === null) {
    throw new Error(`Unexpected non-JSON response from server (HTTP ${res.status}): ${text.slice(0, 120)}`);
  }

  return json as T;
}

export async function checkServerHealth(): Promise<any> {
  const res = await fetch('/api/health');
  return handleResponse<any>(res, 'Server health check failed');
}

export async function fetchGroqModels(): Promise<any> {
  const res = await fetch('/api/models', {
    headers: getAuthHeaders()
  });
  return handleResponse<any>(res, 'Failed to fetch models');
}

export async function fetchBandDescriptors(taskType: TaskType) {
  const res = await fetch(`/api/models/descriptors/${taskType}`);
  return handleResponse<any>(res, 'Failed to fetch descriptors');
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

  return handleResponse<AssessmentResult>(res, 'Assessment failed');
}

