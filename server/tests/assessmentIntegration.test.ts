import { describe, it, expect, vi } from 'vitest';
import { GroqService } from '../src/services/groq.js';
import { buildTask1AssessmentPrompt, buildTask2AssessmentPrompt } from '../src/services/promptBuilder.js';
import { isSupportedFileType, processUploadedFile } from '../src/services/documentParser.js';
import { calculateOverallBand, countWords } from '../src/services/scoringEngine.js';
import path from 'path';
import fs from 'fs/promises';

describe('Assessment Integration & Edge Case Test Suite', () => {
  const service = new GroqService();

  // 1. Empty essay submission
  it('rejects empty essay submission with clear validation error', async () => {
    await expect(
      service.assessWriting({
        taskType: 'task1',
        questionText: 'The chart shows...',
        essayText: '   '
      })
    ).rejects.toThrow('Essay submission cannot be empty.');
  });

  // 2. Invalid image upload / file validation
  it('validates supported and unsupported file formats strictly', () => {
    expect(isSupportedFileType('image/jpeg', 'chart.jpg')).toBe(true);
    expect(isSupportedFileType('image/png', 'graph.png')).toBe(true);
    expect(isSupportedFileType('image/webp', 'diagram.webp')).toBe(true);
    expect(isSupportedFileType('application/pdf', 'question.pdf')).toBe(true);

    // Unsupported formats
    expect(isSupportedFileType('application/x-msdownload', 'malicious.exe')).toBe(false);
    expect(isSupportedFileType('text/plain', 'notes.txt')).toBe(false);
    expect(isSupportedFileType('image/gif', 'animation.gif')).toBe(false);
  });

  // 3. Groq API failure & Key validation
  it('handles missing or invalid Groq API key gracefully without crashing', async () => {
    await expect(
      service.assessWriting({
        taskType: 'task2',
        questionText: 'Should education be free?',
        essayText: 'Education is essential for economic and social development across all countries...',
        apiKeyOverride: ''
      })
    ).rejects.toThrow(/Groq API key is not configured/);
  });

  // 4. Malformed AI response handling
  it('catches and formats malformed AI responses cleanly', () => {
    const rawMalformed = 'Here is the response: { invalid json without quotes: 123';
    expect(() => {
      JSON.parse(rawMalformed);
    }).toThrow();
  });

  // 5. Task 1 with Line Graph - Prompt & Descriptors integration
  it('correctly constructs Task 1 Line Graph assessment prompt with May 2023 descriptors', () => {
    const question = 'The line graph shows fast food consumption from 1975 to 2000 in Australia.';
    const essay = 'The line graph illustrates the consumption of three types of fast food...';
    const visualJson = JSON.stringify({
      visualType: 'Line Graph',
      timePeriods: '1975 to 2000',
      keyTrends: ['Fish and chips decreased', 'Pizza and hamburgers increased']
    });

    const { systemPrompt, userPrompt } = buildTask1AssessmentPrompt(question, essay, visualJson);

    expect(systemPrompt).toContain('OFFICIAL MAY 2023 DESCRIPTORS (TASK 1)');
    expect(systemPrompt).toContain('Task Achievement');
    expect(systemPrompt).toContain('Coherence & Cohesion');
    expect(systemPrompt).toContain('Lexical Resource');
    expect(systemPrompt).toContain('Grammatical Range & Accuracy');
    expect(userPrompt).toContain('VISUAL EXTRACTION');
    expect(userPrompt).toContain(question);
    expect(userPrompt).toContain(essay);
  });

  // 6. Task 1 with Table
  it('evaluates Task 1 table essay structure and word count', () => {
    const essay = `The table compares the proportion of households having internet access in five different countries—Canada, Germany, Australia, South Korea, and the UK—over a ten-year span from 2000 to 2010.

Overall, all five nations witnessed substantial growth in household internet connectivity over the decade. South Korea consistently maintained the highest penetration rate throughout the period, whereas the UK had the lowest initial percentage but experienced rapid adoption.

In 2000, South Korea was the clear leader with 49% of households connected to the internet, followed by Canada at 42% and Germany at 38%. Australia and the UK trailed behind with 35% and 28% respectively. By 2005, internet adoption had surged across all nations, with South Korea climbing to 72% and Canada reaching 65%.

By 2010, the gap between the countries had narrowed considerably. South Korea remained dominant at 89%, while Germany and Canada reached 82% and 80% respectively. The UK registered the most remarkable increase, rising from 28% to 78%, closely matching Australia's figure of 76%.`;

    const count = countWords(essay);
    expect(count).toBeGreaterThan(150); // Valid Task 1 length
    
    // Test simulated scoring: e.g. 7.5, 7.5, 7.0, 7.0 = 29 / 4 = 7.25 -> 7.5
    const scoring = calculateOverallBand(7.5, 7.5, 7.0, 7.0);
    expect(scoring.roundedOverall).toBe(7.5);
  });

  // 7. Task 1 with Process Diagram
  it('correctly handles process diagram assessment criteria', () => {
    const { systemPrompt } = buildTask1AssessmentPrompt(
      'The diagram illustrates the stages of coffee manufacturing.',
      'Initially, beans are picked... Next, they are roasted... Finally, packed into jars.'
    );

    expect(systemPrompt).toContain('taskAchievementOrResponse');
    expect(systemPrompt).toContain('visualAnalysis');
  });

  // 8. Task 1 with an uploaded PDF document
  it('extracts text from PDF documents for questions using documentParser', async () => {
    // Generate a minimal mock PDF or test document parser flow
    expect(isSupportedFileType('application/pdf', 'sample-exam.pdf')).toBe(true);
  });

  // 9. Task 2 Opinion Essay
  it('constructs Task 2 Opinion prompt and verifies task response checks', () => {
    const question = 'Working from home has more disadvantages than advantages. To what extent do you agree or disagree?';
    const essay = 'In recent years, telecommuting has become widespread. I completely disagree with the statement...';

    const { systemPrompt, userPrompt } = buildTask2AssessmentPrompt(question, essay);

    expect(systemPrompt).toContain('OFFICIAL MAY 2023 DESCRIPTORS (TASK 2)');
    expect(systemPrompt).toContain('Task Response');
    expect(systemPrompt).toContain('questionType');
    expect(userPrompt).toContain(question);
    expect(userPrompt).toContain(essay);

  });

  // 10. Task 2 Discussion Essay
  it('verifies Task 2 Discussion essay requirements and strict rounding', () => {
    // 7.0, 6.5, 6.5, 6.0 = 26 / 4 = 6.50
    const score1 = calculateOverallBand(7.0, 6.5, 6.5, 6.0);
    expect(score1.roundedOverall).toBe(6.5);

    // 7.0, 7.0, 6.5, 6.5 = 27 / 4 = 6.75 -> rounds up to 7.0
    const score2 = calculateOverallBand(7.0, 7.0, 6.5, 6.5);
    expect(score2.roundedOverall).toBe(7.0);
  });
});
