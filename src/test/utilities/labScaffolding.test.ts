import { describe, it, expect } from 'vitest';
import {
  DIFFICULTY_CONFIGS,
  getDifficultyConfig,
  createPredictionChallenge,
} from '../../utils/labScaffolding';

describe('Difficulty configs', () => {
  it('returns configs for all four difficulty levels', () => {
    const levels = ['understand', 'apply', 'analyze', 'deep-dive'] as const;
    for (const level of levels) {
      const config = getDifficultyConfig(level);
      expect(config.level).toBe(level);
    }
  });

  it('shows hints for understand and apply, hides for analyze and deep-dive', () => {
    expect(getDifficultyConfig('understand').showHints).toBe(true);
    expect(getDifficultyConfig('apply').showHints).toBe(true);
    expect(getDifficultyConfig('analyze').showHints).toBe(false);
    expect(getDifficultyConfig('deep-dive').showHints).toBe(false);
  });

  it('shows step-by-step for understand only', () => {
    expect(getDifficultyConfig('understand').showStepByStep).toBe(true);
    expect(getDifficultyConfig('apply').showStepByStep).toBe(false);
    expect(getDifficultyConfig('analyze').showStepByStep).toBe(false);
    expect(getDifficultyConfig('deep-dive').showStepByStep).toBe(false);
  });

  it('escalates feedback detail with difficulty', () => {
    expect(getDifficultyConfig('understand').feedbackDetail).toBe('detailed');
    expect(getDifficultyConfig('apply').feedbackDetail).toBe('detailed');
    expect(getDifficultyConfig('deep-dive').feedbackDetail).toBe('comprehensive');
  });

  it('enables prediction phase from apply level', () => {
    expect(getDifficultyConfig('understand').predictionPhase).toBe(false);
    expect(getDifficultyConfig('apply').predictionPhase).toBe(true);
  });

  it('enables research connections only at deep-dive', () => {
    expect(getDifficultyConfig('understand').showResearchConnections).toBe(false);
    expect(getDifficultyConfig('apply').showResearchConnections).toBe(false);
    expect(getDifficultyConfig('analyze').showResearchConnections).toBe(false);
    expect(getDifficultyConfig('deep-dive').showResearchConnections).toBe(true);
  });
});

describe('createPredictionChallenge', () => {
  it('creates a well-formed challenge object', () => {
    const challenge = createPredictionChallenge(
      'What happens when you drop a ball?',
      ['It floats', 'It falls', 'It disappears'],
      1,
      'Gravity pulls the ball down.'
    );

    expect(challenge.question).toBe('What happens when you drop a ball?');
    expect(challenge.options).toHaveLength(3);
    expect(challenge.correctOption).toBe(1);
    expect(challenge.explanation).toContain('Gravity');
  });
});
