/**
 * Lab Scaffolding (Simplified - Deep Dive only)
 */

export type DifficultyLevel = 'understand' | 'apply' | 'analyze' | 'deep-dive';

export interface DifficultyConfig {
  level: DifficultyLevel;
  showHints: boolean;
  showStepByStep: boolean;
  allowHints: boolean;
  feedbackDetail: 'basic' | 'detailed' | 'comprehensive';
  predictionPhase: boolean;
  showDerivations: boolean;
  showFrontierApplications: boolean;
  showResearchConnections: boolean;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  understand: {
    level: 'understand',
    showHints: true,
    showStepByStep: true,
    allowHints: true,
    feedbackDetail: 'detailed',
    predictionPhase: false,
    showDerivations: false,
    showFrontierApplications: false,
    showResearchConnections: false,
  },
  apply: {
    level: 'apply',
    showHints: true,
    showStepByStep: false,
    allowHints: true,
    feedbackDetail: 'detailed',
    predictionPhase: true,
    showDerivations: true,
    showFrontierApplications: false,
    showResearchConnections: false,
  },
  analyze: {
    level: 'analyze',
    showHints: false,
    showStepByStep: false,
    allowHints: false,
    feedbackDetail: 'comprehensive',
    predictionPhase: true,
    showDerivations: true,
    showFrontierApplications: true,
    showResearchConnections: false,
  },
  'deep-dive': {
    level: 'deep-dive',
    showHints: false,
    showStepByStep: false,
    allowHints: false,
    feedbackDetail: 'comprehensive',
    predictionPhase: true,
    showDerivations: true,
    showFrontierApplications: true,
    showResearchConnections: true,
  },
};

export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_CONFIGS[level];
}

export interface PredictionChallenge {
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export function createPredictionChallenge(
  scenario: string,
  predictions: string[],
  correct: number,
  reasoning: string
): PredictionChallenge {
  return {
    question: scenario,
    options: predictions,
    correctOption: correct,
    explanation: reasoning,
  };
}
