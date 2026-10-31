import { describe, it, expect } from 'vitest';
import { calculateOverallBand, normalizeBandScore, countWords } from '../src/services/scoringEngine.js';

describe('IELTS Scoring Engine', () => {
  describe('normalizeBandScore', () => {
    it('should clamp scores below 0 to 0', () => {
      expect(normalizeBandScore(-1)).toBe(0);
    });

    it('should clamp scores above 9 to 9', () => {
      expect(normalizeBandScore(10)).toBe(9);
    });

    it('should snap to nearest half band', () => {
      expect(normalizeBandScore(6.2)).toBe(6.0);
      expect(normalizeBandScore(6.3)).toBe(6.5);
      expect(normalizeBandScore(6.8)).toBe(7.0);
    });
  });

  describe('calculateOverallBand - Official IELTS Rounding Rules', () => {
    it('rounds up to half band when average ends in .25', () => {
      // 6.5 + 6.5 + 6.0 + 6.0 = 25 / 4 = 6.25 -> rounds up to 6.5
      const result = calculateOverallBand(6.5, 6.5, 6.0, 6.0);
      expect(result.rawAverage).toBe(6.25);
      expect(result.roundedOverall).toBe(6.5);
    });

    it('rounds up to next whole band when average ends in .75', () => {
      // 7.0 + 7.0 + 6.5 + 6.5 = 27 / 4 = 6.75 -> rounds up to 7.0
      const result = calculateOverallBand(7.0, 7.0, 6.5, 6.5);
      expect(result.rawAverage).toBe(6.75);
      expect(result.roundedOverall).toBe(7.0);
    });

    it('rounds down to whole band when average fraction < 0.25 (e.g. .125)', () => {
      // 6.5 + 6.0 + 6.0 + 6.0 = 24.5 / 4 = 6.125 -> rounds down to 6.0
      const result = calculateOverallBand(6.5, 6.0, 6.0, 6.0);
      expect(result.rawAverage).toBe(6.125);
      expect(result.roundedOverall).toBe(6.0);
    });

    it('rounds up to half band when average fraction is .375', () => {
      // 6.5 + 6.5 + 6.5 + 6.0 = 25.5 / 4 = 6.375 -> rounds up to 6.5
      const result = calculateOverallBand(6.5, 6.5, 6.5, 6.0);
      expect(result.rawAverage).toBe(6.375);
      expect(result.roundedOverall).toBe(6.5);
    });

    it('rounds down to half band when average fraction is .625', () => {
      // 7.0 + 6.5 + 6.5 + 6.5 = 26.5 / 4 = 6.625 -> rounds to 6.5
      const result = calculateOverallBand(7.0, 6.5, 6.5, 6.5);
      expect(result.rawAverage).toBe(6.625);
      expect(result.roundedOverall).toBe(6.5);
    });

    it('rounds up to next whole band when average fraction is .875', () => {
      // 7.5 + 7.0 + 6.5 + 6.5 = 27.5 / 4 = 6.875 -> rounds up to 7.0
      const result = calculateOverallBand(7.5, 7.0, 6.5, 6.5);
      expect(result.rawAverage).toBe(6.875);
      expect(result.roundedOverall).toBe(7.0);
    });

    it('retains exact whole and half bands', () => {
      expect(calculateOverallBand(7, 7, 7, 7).roundedOverall).toBe(7.0);
      expect(calculateOverallBand(6.5, 6.5, 6.5, 6.5).roundedOverall).toBe(6.5);
    });
  });

  describe('countWords', () => {
    it('returns 0 for empty string', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('counts words accurately handling punctuation and hyphenation', () => {
      const text = 'The chart illustrates the consumption of fast-food in the UK between 1970 and 1990.';
      expect(countWords(text)).toBe(14);
    });
  });

});
