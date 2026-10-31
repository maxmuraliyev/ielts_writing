export type TaskType = 'task1' | 'task2';

export interface CriterionAssessment {
  score: number;
  criterionName: string;
  explanation: string;
  descriptorCharacteristics: string[];
  specificEvidence: string[];
  whatPreventsNextBand: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  category: 'Verb Tense & Agreement' | 'Article & Preposition' | 'Sentence Structure' | 'Punctuation' | 'Word Form' | 'Other';
}

export interface VocabularyAnalysis {
  repetitiveVocabulary: {
    word: string;
    count: number;
    suggestedAlternatives: string[];
  }[];
  inaccurateWordChoices: {
    original: string;
    suggested: string;
    context: string;
    reason: string;
  }[];
  awkwardCollocations: {
    original: string;
    naturalAlternative: string;
    explanation: string;
  }[];
  informalExpressions: {
    original: string;
    formalAlternative: string;
    explanation: string;
  }[];
  precisionOpportunities: {
    original: string;
    preciseAlternative: string;
    explanation: string;
  }[];
}

export interface LinkingDeviceAnalysis {
  device: string;
  appropriateness: 'effective' | 'mechanical' | 'inaccurate' | 'overused';
  comment: string;
}

export interface CoherenceAnalysis {
  paragraphStructure: string;
  logicalProgression: string;
  linkingDevices: LinkingDeviceAnalysis[];
  referencingAndSubstitution: string;
  overallCoherenceComment: string;
}

export interface RefinedEssay {
  refinedText: string;
  keyChangesMade: string[];
  preservationNotes: string;
}

export interface Task1VisualAnalysis {
  visualType: string;
  titleSubject: string;
  timePeriods?: string;
  categories?: string[];
  units?: string;
  keyTrends: string[];
  highLowValues: string[];
  significantComparisons: string[];
  overviewIdentifiedInEssay: boolean;
  numericalAccuracyNotes: string;
}

export interface Task2PromptAnalysis {
  questionType: 'opinion' | 'discussion' | 'advantages_disadvantages' | 'problem_solution' | 'two_part' | 'positive_negative_development' | 'mixed';
  allPartsIdentified: string[];
  positionClarity: string;
}

export interface ImprovementAction {
  priority: number;
  action: string;
  rationale: string;
  targetCriterion: 'Task Achievement / Task Response' | 'Coherence & Cohesion' | 'Lexical Resource' | 'Grammatical Range & Accuracy';
}

export interface AssessmentResult {
  taskType: TaskType;
  wordCount: number;
  overallBand: number;
  calculationBreakdown: {
    individualScores: {
      taskAchievementOrResponse: number;
      coherenceCohesion: number;
      lexicalResource: number;
      grammaticalRangeAccuracy: number;
    };
    rawAverage: number;
    roundedOverall: number;
    ruleApplied: string;
  };
  summary: string;
  criteria: {
    taskAchievementOrResponse: CriterionAssessment;
    coherenceCohesion: CriterionAssessment;
    lexicalResource: CriterionAssessment;
    grammaticalRangeAccuracy: CriterionAssessment;
  };
  grammarCorrections: GrammarCorrection[];
  vocabularyAnalysis: VocabularyAnalysis;
  coherenceAnalysis: CoherenceAnalysis;
  strengths: string[];
  weaknesses: string[];
  refinedEssay: RefinedEssay;
  improvementPlan: ImprovementAction[];
  visualAnalysis?: Task1VisualAnalysis;
  promptAnalysis?: Task2PromptAnalysis;
  modelUsed?: string;
  evaluatedAt: string;
}

export interface AppSettings {
  apiKey: string;
  textModel: string;
  visionModel: string;
}
