import { config } from '../config.js';
import {
  AssessmentResult,
  TaskType,
  CriterionAssessment,
  Task1VisualAnalysis,
  Task2PromptAnalysis
} from '../types/index.js';
import {
  buildTask1VisionExtractionPrompt,
  buildTask1AssessmentPrompt,
  buildTask2AssessmentPrompt
} from './promptBuilder.js';
import { calculateOverallBand, countWords } from './scoringEngine.js';

export class GroqService {
  private getApiKey(apiKeyOverride?: string): string {
    const key = apiKeyOverride !== undefined ? apiKeyOverride.trim() : (config.groq.apiKey || '').trim();
    if (!key) {
      throw new Error(
        'Groq API key is not configured. Please set GROQ_API_KEY in .env or provide it in the application settings.'
      );
    }
    return key;
  }

  /**
   * Helper to perform native fetch to Groq API with timeout and detailed error diagnostics.
   * Avoids node-fetch ERR_STREAM_PREMATURE_CLOSE bug completely.
   */
  private async groqFetch(endpoint: string, options: RequestInit, apiKey: string): Promise<any> {
    const url = `https://api.groq.com/openai/v1${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.groq.timeoutMs);

    try {
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };

      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      const responseText = await res.text();
      let parsed: any;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = { error: { message: responseText } };
      }

      if (!res.ok) {
        const errorMsg = parsed.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        const error: any = new Error(errorMsg);
        error.status = res.status;
        error.data = parsed;
        throw error;
      }

      return parsed;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Groq API request timed out. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Lists available models from Groq to verify availability and capabilities
   */
  async listAvailableModels(apiKeyOverride?: string) {
    try {
      const apiKey = this.getApiKey(apiKeyOverride);
      const data = await this.groqFetch('/models', { method: 'GET' }, apiKey);
      const models = (data.data || []).map((m: any) => ({
        id: m.id,
        ownedBy: m.owned_by,
        active: m.active ?? true,
        contextWindow: m.context_window || m.context_length
      }));

      return {
        success: true,
        models
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to list Groq models'
      };
    }
  }

  /**
   * Extracts factual chart information from visual images using Groq Vision model
   */
  async extractVisualInformation(
    imageUrls: string[],
    apiKeyOverride?: string,
    visionModelOverride?: string
  ): Promise<any> {
    if (!imageUrls || imageUrls.length === 0) return null;

    const apiKey = this.getApiKey(apiKeyOverride);
    const model = visionModelOverride || config.groq.visionModel || 'qwen/qwen3.8-27b';

    const promptText = buildTask1VisionExtractionPrompt();

    const content: any[] = [{ type: 'text', text: promptText }];
    for (const url of imageUrls) {
      content.push({
        type: 'image_url',
        image_url: { url }
      });
    }

    try {
      const data = await this.groqFetch(
        '/chat/completions',
        {
          method: 'POST',
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content }],
            temperature: 0.1,
            max_tokens: 800,
            response_format: { type: 'json_object' }
          })
        },
        apiKey
      );

      const raw = data.choices?.[0]?.message?.content || '{}';
      return JSON.parse(this.cleanJsonString(raw));
    } catch (err: any) {
      console.warn(`Vision extraction with model ${model} warning: ${err.message}. Proceeding with textual assessment.`);
      return {
        visualType: 'Visual chart / diagram provided',
        titleSubject: 'Referenced visual material',
        factualSummary: 'Visual analysis proceeded based on candidate essay reporting and question prompt.'
      };
    }
  }

  /**
   * Assesses Task 1 or Task 2 essay strictly according to May 2023 Official Descriptors
   */
  async assessWriting(params: {
    taskType: TaskType;
    questionText: string;
    essayText: string;
    imageUrls?: string[];
    apiKeyOverride?: string;
    textModelOverride?: string;
    visionModelOverride?: string;
  }): Promise<AssessmentResult> {
    const { taskType, questionText, essayText, imageUrls, apiKeyOverride } = params;
    const apiKey = this.getApiKey(apiKeyOverride);
    const wordCount = countWords(essayText);

    if (!essayText || essayText.trim().length === 0) {
      throw new Error('Essay submission cannot be empty.');
    }

    let visualExtraction: any = null;
    if (taskType === 'task1' && imageUrls && imageUrls.length > 0) {
      visualExtraction = await this.extractVisualInformation(imageUrls, apiKeyOverride, params.visionModelOverride);
    }

    let promptData: { systemPrompt: string; userPrompt: string };
    if (taskType === 'task1') {
      promptData = buildTask1AssessmentPrompt(
        questionText,
        essayText,
        visualExtraction ? JSON.stringify(visualExtraction, null, 2) : undefined
      );
    } else {
      promptData = buildTask2AssessmentPrompt(questionText, essayText);
    }

    let targetModel = params.textModelOverride || config.groq.textModel;
    let completion: any = null;

    try {
      completion = await this.groqFetch(
        '/chat/completions',
        {
          method: 'POST',
          body: JSON.stringify({
            model: targetModel,
            messages: [
              { role: 'system', content: promptData.systemPrompt },
              { role: 'user', content: promptData.userPrompt }
            ],
            temperature: 0.15,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
          })
        },
        apiKey
      );
    } catch (apiError: any) {
      const msg = apiError.message || '';
      const is404 = apiError.status === 404 || msg.includes('model_not_found');
      const isTPM = apiError.status === 429 || msg.includes('tokens per minute') || msg.includes('Request too large') || msg.includes('Limit 8000');
      const isJsonFail = msg.includes('Failed to validate JSON') || msg.includes('failed_generation');

      // If failed_generation contains text, attempt recovery
      if (isJsonFail && apiError.data?.error?.failed_generation) {
        try {
          const recovered = JSON.parse(this.cleanJsonString(apiError.data.error.failed_generation));
          completion = { choices: [{ message: { content: JSON.stringify(recovered) } }], model: targetModel };
        } catch {
          // Will retry below
        }
      }

      if (!completion && (is404 || isTPM || isJsonFail)) {
        const fallbackModel = (targetModel === 'openai/gpt-oss-120b') ? 'openai/gpt-oss-20b' : 'qwen/qwen3.8-27b';
        console.warn(`Request on ${targetModel} encountered ${msg.slice(0, 45)}... Retrying on ${fallbackModel}...`);
        targetModel = fallbackModel;

        completion = await this.groqFetch(
          '/chat/completions',
          {
            method: 'POST',
            body: JSON.stringify({
              model: targetModel,
              messages: [
                { role: 'system', content: promptData.systemPrompt },
                { role: 'user', content: promptData.userPrompt }
              ],
              temperature: 0.15,
              max_tokens: 2800,
              response_format: { type: 'json_object' }
            })
          },
          apiKey
        );
      } else if (!completion) {
        throw this.formatGroqError(apiError);
      }
    }

    const rawResponse = completion.choices?.[0]?.message?.content || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(this.cleanJsonString(rawResponse));
    } catch (parseErr) {
      throw new Error(
        `Failed to parse AI examiner evaluation response: ${(parseErr as Error).message}. Raw response was: ${rawResponse.substring(0, 200)}...`
      );
    }

    // Extract individual scores from parsed response
    const criteria = parsed.criteria || {};
    const taskScore = Number(criteria.taskAchievementOrResponse?.score ?? 5.0);
    const ccScore = Number(criteria.coherenceCohesion?.score ?? 5.0);
    const lrScore = Number(criteria.lexicalResource?.score ?? 5.0);
    const graScore = Number(criteria.grammaticalRangeAccuracy?.score ?? 5.0);

    // Calculate official IELTS band score using our scoring engine
    const calculation = calculateOverallBand(taskScore, ccScore, lrScore, graScore);

    // Format individual criterion objects cleanly
    const formattedCriteria = {
      taskAchievementOrResponse: {
        score: calculation.individualScores.taskAchievementOrResponse,
        criterionName: taskType === 'task1' ? 'Task Achievement' : 'Task Response',
        explanation: criteria.taskAchievementOrResponse?.explanation || 'Evaluated against May 2023 Band Descriptors.',
        descriptorCharacteristics: criteria.taskAchievementOrResponse?.descriptorCharacteristics || [],
        specificEvidence: criteria.taskAchievementOrResponse?.specificEvidence || [],
        whatPreventsNextBand: criteria.taskAchievementOrResponse?.whatPreventsNextBand || 'Address all descriptor limiting features to improve.'
      },
      coherenceCohesion: {
        score: calculation.individualScores.coherenceCohesion,
        criterionName: 'Coherence & Cohesion',
        explanation: criteria.coherenceCohesion?.explanation || 'Evaluated against May 2023 Band Descriptors.',
        descriptorCharacteristics: criteria.coherenceCohesion?.descriptorCharacteristics || [],
        specificEvidence: criteria.coherenceCohesion?.specificEvidence || [],
        whatPreventsNextBand: criteria.coherenceCohesion?.whatPreventsNextBand || 'Improve paragraph progression and cohesive referencing.'
      },
      lexicalResource: {
        score: calculation.individualScores.lexicalResource,
        criterionName: 'Lexical Resource',
        explanation: criteria.lexicalResource?.explanation || 'Evaluated against May 2023 Band Descriptors.',
        descriptorCharacteristics: criteria.lexicalResource?.descriptorCharacteristics || [],
        specificEvidence: criteria.lexicalResource?.specificEvidence || [],
        whatPreventsNextBand: criteria.lexicalResource?.whatPreventsNextBand || 'Expand precision and eliminate word choice inaccuracies.'
      },
      grammaticalRangeAccuracy: {
        score: calculation.individualScores.grammaticalRangeAccuracy,
        criterionName: 'Grammatical Range & Accuracy',
        explanation: criteria.grammaticalRangeAccuracy?.explanation || 'Evaluated against May 2023 Band Descriptors.',
        descriptorCharacteristics: criteria.grammaticalRangeAccuracy?.descriptorCharacteristics || [],
        specificEvidence: criteria.grammaticalRangeAccuracy?.specificEvidence || [],
        whatPreventsNextBand: criteria.grammaticalRangeAccuracy?.whatPreventsNextBand || 'Increase proportion of error-free complex sentences.'
      }
    };

    const finalResult: AssessmentResult = {
      taskType,
      wordCount,
      overallBand: calculation.roundedOverall,
      calculationBreakdown: calculation,
      summary: parsed.summary || 'Detailed IELTS Writing Assessment completed.',
      criteria: formattedCriteria,
      grammarCorrections: parsed.grammarCorrections || [],
      vocabularyAnalysis: parsed.vocabularyAnalysis || {
        repetitiveVocabulary: [],
        inaccurateWordChoices: [],
        awkwardCollocations: [],
        informalExpressions: [],
        precisionOpportunities: []
      },
      coherenceAnalysis: parsed.coherenceAnalysis || {
        paragraphStructure: 'Evaluated paragraph structure.',
        logicalProgression: 'Evaluated logical flow.',
        linkingDevices: [],
        referencingAndSubstitution: 'Evaluated referencing.',
        overallCoherenceComment: 'Coherence assessment completed.'
      },
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      refinedEssay: parsed.refinedEssay || {
        refinedText: essayText,
        keyChangesMade: [],
        preservationNotes: 'Original content retained.'
      },
      improvementPlan: parsed.improvementPlan || [],
      visualAnalysis: taskType === 'task1' ? parsed.visualAnalysis || visualExtraction : undefined,
      promptAnalysis: taskType === 'task2' ? parsed.promptAnalysis : undefined,
      modelUsed: completion.model || targetModel,
      evaluatedAt: new Date().toISOString()
    };

    return finalResult;
  }

  private cleanJsonString(str: string): string {
    let clean = str.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Extract outer-most JSON object bounds
    const firstBrace = clean.indexOf('{');
    if (firstBrace !== -1) {
      const lastBrace = clean.lastIndexOf('}');
      if (lastBrace !== -1 && lastBrace > firstBrace) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }
    }
    return clean;
  }

  private formatGroqError(err: any): Error {
    const status = err.status || err.statusCode;
    const msg = err.message || '';

    if (status === 401 || msg.includes('Invalid API Key') || msg.includes('unauthorized')) {
      return new Error('Invalid Groq API Key. Please verify your GROQ_API_KEY in .env or the Settings dialog.');
    }
    if (status === 429 || msg.includes('Rate limit') || msg.includes('tokens per minute')) {
      return new Error('Groq API rate limit reached. Please wait a moment before trying again.');
    }
    if (status === 404 || msg.includes('model_not_found') || msg.includes('decommissioned')) {
      return new Error(`The requested Groq model is currently unavailable or decommissioned: ${msg}`);
    }
    if (status === 413 || msg.includes('context_length_exceeded') || msg.includes('too large')) {
      return new Error('The essay or question text exceeded the model context window. Please shorten the input.');
    }
    return new Error(`Groq AI service error: ${msg || 'Unknown error occurred'}`);
  }
}

export const groqService = new GroqService();
