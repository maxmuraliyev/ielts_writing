import { describe, it, expect } from 'vitest';
import { TASK_1_DESCRIPTORS, TASK_2_DESCRIPTORS } from '../src/services/bandDescriptors.js';

describe('Official May 2023 Band Descriptors Reference', () => {
  it('covers all bands 0 to 9 for Task 1 across all 4 criteria', () => {
    const criteria = ['taskAchievement', 'coherenceCohesion', 'lexicalResource', 'grammaticalRangeAccuracy'] as const;

    for (const c of criteria) {
      for (let b = 0; b <= 9; b++) {
        expect(TASK_1_DESCRIPTORS[c][b]).toBeDefined();
        expect(TASK_1_DESCRIPTORS[c][b].band).toBe(b);
        expect(TASK_1_DESCRIPTORS[c][b].description.length).toBeGreaterThan(0);
      }
    }
  });

  it('covers all bands 0 to 9 for Task 2 across all 4 criteria', () => {
    const criteria = ['taskResponse', 'coherenceCohesion', 'lexicalResource', 'grammaticalRangeAccuracy'] as const;

    for (const c of criteria) {
      for (let b = 0; b <= 9; b++) {
        expect(TASK_2_DESCRIPTORS[c][b]).toBeDefined();
        expect(TASK_2_DESCRIPTORS[c][b].band).toBe(b);
        expect(TASK_2_DESCRIPTORS[c][b].description.length).toBeGreaterThan(0);
      }
    }
  });

  it('includes limiting features for Task 1 Band 5 and 6', () => {
    expect(TASK_1_DESCRIPTORS.taskAchievement[5].limitingFeatures).toBeDefined();
    expect(TASK_1_DESCRIPTORS.taskAchievement[5].limitingFeatures?.length).toBeGreaterThan(0);

    expect(TASK_1_DESCRIPTORS.taskAchievement[6].limitingFeatures).toBeDefined();
    expect(TASK_1_DESCRIPTORS.taskAchievement[6].limitingFeatures?.length).toBeGreaterThan(0);
  });
});
