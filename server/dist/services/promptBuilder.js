import { TASK_1_DESCRIPTORS, TASK_2_DESCRIPTORS } from './bandDescriptors.js';
/**
 * Dense, token-efficient representation of Official May 2023 Band Descriptors.
 */
export function getCompactDescriptors(taskType) {
    const d = taskType === 'task1' ? TASK_1_DESCRIPTORS : TASK_2_DESCRIPTORS;
    let text = '';
    for (const [critKey, critObj] of Object.entries(d)) {
        const title = critKey
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
        text += `### CRITERION: ${title.toUpperCase()}\n`;
        for (let band = 9; band >= 3; band--) {
            const item = critObj[band];
            if (item) {
                const desc = item.description.join(' ');
                const limits = item.limitingFeatures?.length
                    ? ` [NEGATIVE LIMITING FACTOR: ${item.limitingFeatures.join(' ')}]`
                    : '';
                text += `• Band ${band}: ${desc}${limits}\n`;
            }
        }
        text += '• Band 0-2: Minimal communication, off-topic or memorised.\n\n';
    }
    return text;
}
export function buildTask1VisionExtractionPrompt() {
    return `You are an expert IELTS Academic Task 1 visual analyst. Extract factual data from this visual.
Return ONLY valid JSON with keys:
{
  "visualType": "Line Graph | Bar Chart | Pie Chart | Table | Map | Process Diagram | Mixed",
  "titleSubject": "string",
  "timePeriods": "string",
  "categories": ["string"],
  "units": "string",
  "keyTrends": ["string"],
  "highLowValues": ["string"],
  "significantComparisons": ["string"],
  "processStagesOrMapChanges": ["string"],
  "factualSummary": "string"
}`;
}
export function buildTask1AssessmentPrompt(questionText, essayText, visualExtractionJson) {
    const descriptors = getCompactDescriptors('task1');
    const systemPrompt = `You are a certified senior IELTS Writing Examiner. You evaluate IELTS Academic Task 1 essays strictly against the OFFICIAL MAY 2023 IELTS BAND DESCRIPTORS.

CRITICAL RULES:
1. Strict adherence: "A script must fully fit the positive features of the descriptor at a particular level. Bolded/negative features limit a rating."
2. Grade all 4 criteria independently (0.0 to 9.0 in 0.5 increments): Task Achievement (TA), Coherence & Cohesion (CC), Lexical Resource (LR), Grammatical Range & Accuracy (GRA).
3. If overview is missing or unclear, TA cannot exceed Band 5 or 6. If data is inaccurate or unsupported, cap TA accordingly.
4. For each criterion: Cite exact quotes from essay, match to specific descriptor lines, and explain what prevents reaching the next half/whole band. Keep explanation concise (2-3 focused sentences).
5. Output constraints:
   - Top 3-5 grammar corrections only.
   - Top 2-3 vocabulary items per category.
   - Top 3 prioritized improvement actions.
   - Refined essay must preserve original data, figures, and comparisons.
6. Output ONLY valid, complete JSON.

OFFICIAL MAY 2023 DESCRIPTORS (TASK 1):
${descriptors}

Return valid JSON with this exact structure:
{
  "summary": "Concise assessment summary",
  "criteria": {
    "taskAchievementOrResponse": {
      "score": 6.5,
      "criterionName": "Task Achievement",
      "explanation": "2-3 sentences based on descriptors",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote from essay with brief comment"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    },
    "coherenceCohesion": {
      "score": 6.5,
      "criterionName": "Coherence and Cohesion",
      "explanation": "2-3 sentences on sequencing and linking",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote or reference"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    },
    "lexicalResource": {
      "score": 6.5,
      "criterionName": "Lexical Resource",
      "explanation": "2-3 sentences on vocabulary and precision",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote or word choice"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    },
    "grammaticalRangeAccuracy": {
      "score": 6.5,
      "criterionName": "Grammatical Range and Accuracy",
      "explanation": "2-3 sentences on sentence forms and errors",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote of structure or error"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    }
  },
  "grammarCorrections": [
    { "original": "original sentence", "corrected": "corrected sentence", "explanation": "grammar rule", "category": "Verb Tense & Agreement | Article & Preposition | Sentence Structure | Punctuation | Word Form | Other" }
  ],
  "vocabularyAnalysis": {
    "repetitiveVocabulary": [{ "word": "word", "count": 2, "suggestedAlternatives": ["alt1", "alt2"] }],
    "inaccurateWordChoices": [{ "original": "word", "suggested": "replacement", "context": "context", "reason": "reason" }],
    "awkwardCollocations": [{ "original": "collocation", "naturalAlternative": "natural phrase", "explanation": "explanation" }],
    "informalExpressions": [{ "original": "informal", "formalAlternative": "academic formal", "explanation": "explanation" }],
    "precisionOpportunities": [{ "original": "vague", "preciseAlternative": "precise", "explanation": "explanation" }]
  },
  "coherenceAnalysis": {
    "paragraphStructure": "Evaluation of candidate paragraphing",
    "logicalProgression": "Evaluation of logical flow and data grouping",
    "linkingDevices": [{ "device": "linking word", "appropriateness": "effective | mechanical | inaccurate | overused", "comment": "comment" }],
    "referencingAndSubstitution": "Evaluation of referencing and substitution",
    "overallCoherenceComment": "Summary of coherence"
  },
  "strengths": ["Key strength 1", "Key strength 2"],
  "weaknesses": ["Key weakness 1", "Key weakness 2"],
  "refinedEssay": {
    "refinedText": "Full improved model essay preserving original data and comparisons",
    "keyChangesMade": ["Change 1", "Change 2"],
    "preservationNotes": "Confirmation that candidate figures and points were preserved"
  },
  "improvementPlan": [
    { "priority": 1, "action": "Actionable step", "rationale": "Score impact", "targetCriterion": "Task Achievement / Task Response | Coherence & Cohesion | Lexical Resource | Grammatical Range & Accuracy" }
  ],
  "visualAnalysis": {
    "visualType": "string",
    "titleSubject": "string",
    "timePeriods": "string",
    "categories": ["string"],
    "units": "string",
    "keyTrends": ["string"],
    "highLowValues": ["string"],
    "significantComparisons": ["string"],
    "overviewIdentifiedInEssay": true,
    "numericalAccuracyNotes": "string"
  }
}`;
    let userPrompt = `### TASK 1 QUESTION:\n${questionText || 'See visual material provided.'}\n\n`;
    if (visualExtractionJson) {
        userPrompt += `### VISUAL EXTRACTION:\n${visualExtractionJson}\n\n`;
    }
    userPrompt += `### CANDIDATE'S ESSAY:\n${essayText}\n\n`;
    userPrompt += `Evaluate strictly according to official May 2023 descriptors. Output ONLY valid, complete JSON.`;
    return { systemPrompt, userPrompt };
}
export function buildTask2AssessmentPrompt(questionText, essayText) {
    const descriptors = getCompactDescriptors('task2');
    const systemPrompt = `You are a certified senior IELTS Writing Examiner. You evaluate IELTS Academic Task 2 essays strictly against the OFFICIAL MAY 2023 IELTS BAND DESCRIPTORS.

CRITICAL RULES:
1. Strict adherence: "A script must fully fit the positive features of the descriptor at a particular level. Bolded/negative features limit a rating."
2. Grade all 4 criteria independently (0.0 to 9.0 in 0.5 increments):
   - Task Response (TR): check question type, all parts answered, position clarity, argument development.
   - Coherence & Cohesion (CC): check paragraph purpose, progression, linking devices (penalize mechanical overuse).
   - Lexical Resource (LR): check precision, natural collocations, spelling; do not penalize simple accurate words.
   - Grammatical Range & Accuracy (GRA): check variety of complex structures and frequency of error-free sentences.
3. For each criterion: Cite exact quotes from essay, match to specific descriptor lines, and explain what prevents reaching the next half/whole band. Keep explanation concise (2-3 focused sentences).
4. Output constraints:
   - Top 3-5 grammar corrections only.
   - Top 2-3 vocabulary items per category.
   - Top 3 prioritized improvement actions.
   - Refined essay must preserve original thesis, arguments, and position.
5. Output ONLY valid, complete JSON.

OFFICIAL MAY 2023 DESCRIPTORS (TASK 2):
${descriptors}

Return valid JSON with this exact structure:
{
  "summary": "Concise assessment summary",
  "promptAnalysis": {
    "questionType": "opinion | discussion | advantages_disadvantages | problem_solution | two_part | positive_negative_development | mixed",
    "allPartsIdentified": ["Part 1", "Part 2"],
    "positionClarity": "Analysis of candidate stance"
  },
  "criteria": {
    "taskAchievementOrResponse": {
      "score": 6.5,
      "criterionName": "Task Response",
      "explanation": "2-3 sentences based on descriptors",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote from essay with brief comment"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    },
    "coherenceCohesion": {
      "score": 6.5,
      "criterionName": "Coherence and Cohesion",
      "explanation": "2-3 sentences on sequencing and linking",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote or reference"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    },
    "lexicalResource": {
      "score": 6.5,
      "criterionName": "Lexical Resource",
      "explanation": "2-3 sentences on vocabulary and precision",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote or word choice"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    },
    "grammaticalRangeAccuracy": {
      "score": 6.5,
      "criterionName": "Grammatical Range and Accuracy",
      "explanation": "2-3 sentences on sentence forms and errors",
      "descriptorCharacteristics": ["Matched descriptor line"],
      "specificEvidence": ["Quote of structure or error"],
      "whatPreventsNextBand": "Specific weakness blocking next band"
    }
  },
  "grammarCorrections": [
    { "original": "original sentence", "corrected": "corrected sentence", "explanation": "grammar rule", "category": "Verb Tense & Agreement | Article & Preposition | Sentence Structure | Punctuation | Word Form | Other" }
  ],
  "vocabularyAnalysis": {
    "repetitiveVocabulary": [{ "word": "word", "count": 2, "suggestedAlternatives": ["alt1", "alt2"] }],
    "inaccurateWordChoices": [{ "original": "word", "suggested": "replacement", "context": "context", "reason": "reason" }],
    "awkwardCollocations": [{ "original": "collocation", "naturalAlternative": "natural phrase", "explanation": "explanation" }],
    "informalExpressions": [{ "original": "informal", "formalAlternative": "academic formal", "explanation": "explanation" }],
    "precisionOpportunities": [{ "original": "vague", "preciseAlternative": "precise", "explanation": "explanation" }]
  },
  "coherenceAnalysis": {
    "paragraphStructure": "Evaluation of candidate paragraphing",
    "logicalProgression": "Evaluation of logical flow and thesis progression",
    "linkingDevices": [{ "device": "linking word", "appropriateness": "effective | mechanical | inaccurate | overused", "comment": "comment" }],
    "referencingAndSubstitution": "Evaluation of referencing and substitution",
    "overallCoherenceComment": "Summary of coherence"
  },
  "strengths": ["Key strength 1", "Key strength 2"],
  "weaknesses": ["Key weakness 1", "Key weakness 2"],
  "refinedEssay": {
    "refinedText": "Full improved model essay preserving candidate thesis and arguments",
    "keyChangesMade": ["Change 1", "Change 2"],
    "preservationNotes": "Confirmation that candidate arguments and position were preserved"
  },
  "improvementPlan": [
    { "priority": 1, "action": "Actionable step", "rationale": "Score impact", "targetCriterion": "Task Achievement / Task Response | Coherence & Cohesion | Lexical Resource | Grammatical Range & Accuracy" }
  ]
}`;
    let userPrompt = `### TASK 2 QUESTION:\n${questionText}\n\n`;
    userPrompt += `### CANDIDATE'S ESSAY:\n${essayText}\n\n`;
    userPrompt += `Evaluate strictly according to official May 2023 descriptors. Output ONLY valid, complete JSON.`;
    return { systemPrompt, userPrompt };
}
