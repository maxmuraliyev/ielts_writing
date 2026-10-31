/**
 * IELTS Scoring Methodology & Rounding Engine
 * 
 * Implements the official IELTS rounding rules:
 * - Arithmetic mean of the four assessment criteria.
 * - If the fractional part of the average is less than 0.25, it rounds down to the nearest whole band.
 * - If the fractional part is >= 0.25 and < 0.75, it rounds to the half band (0.5).
 * - If the fractional part is >= 0.75, it rounds up to the next whole band.
 * 
 * Examples:
 * - 6.125 -> 6.0
 * - 6.25  -> 6.5 (Official: .25 rounds up to next half band)
 * - 6.375 -> 6.5
 * - 6.50  -> 6.5
 * - 6.625 -> 6.5
 * - 6.75  -> 7.0 (Official: .75 rounds up to next whole band)
 * - 6.875 -> 7.0
 */

export interface ScoreCalculationResult {
  individualScores: {
    taskAchievementOrResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRangeAccuracy: number;
  };
  rawAverage: number;
  roundedOverall: number;
  ruleApplied: string;
}

/**
 * Validates and clamps a band score to valid IELTS range [0.0 - 9.0] in 0.5 increments.
 */
export function normalizeBandScore(score: number): number {
  if (isNaN(score) || score < 0) return 0;
  if (score > 9) return 9;
  // Snap to nearest 0.5
  return Math.round(score * 2) / 2;
}

/**
 * Calculates the overall IELTS band score following official rounding rules.
 */
export function calculateOverallBand(
  score1: number,
  score2: number,
  score3: number,
  score4: number
): ScoreCalculationResult {
  const s1 = normalizeBandScore(score1);
  const s2 = normalizeBandScore(score2);
  const s3 = normalizeBandScore(score3);
  const s4 = normalizeBandScore(score4);

  const rawAverage = (s1 + s2 + s3 + s4) / 4;
  const whole = Math.floor(rawAverage);
  const fraction = Number((rawAverage - whole).toFixed(4));

  let roundedOverall: number;
  let ruleApplied: string;

  if (fraction < 0.25) {
    roundedOverall = whole;
    ruleApplied = `Average is ${rawAverage.toFixed(3)} (fraction ${fraction} < 0.25) -> Rounded down to ${roundedOverall.toFixed(1)}`;
  } else if (fraction < 0.75) {
    roundedOverall = whole + 0.5;
    ruleApplied = `Average is ${rawAverage.toFixed(3)} (0.25 <= fraction ${fraction} < 0.75) -> Rounded to half-band ${roundedOverall.toFixed(1)}`;
  } else {
    roundedOverall = whole + 1.0;
    ruleApplied = `Average is ${rawAverage.toFixed(3)} (fraction ${fraction} >= 0.75) -> Rounded up to next whole band ${roundedOverall.toFixed(1)}`;
  }

  // Cap at 9.0 max
  roundedOverall = Math.min(9.0, roundedOverall);

  return {
    individualScores: {
      taskAchievementOrResponse: s1,
      coherenceCohesion: s2,
      lexicalResource: s3,
      grammaticalRangeAccuracy: s4
    },
    rawAverage: Number(rawAverage.toFixed(3)),
    roundedOverall,
    ruleApplied
  };
}

/**
 * Accurately calculates word count for IELTS essays.
 * Removes excess whitespace and counts words matching IELTS testing standards.
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  // Strip code blocks or html tags if any
  const clean = text.replace(/<[^>]*>/g, ' ').trim();
  const words = clean.match(/\b[\w'-]+\b/g);
  return words ? words.length : 0;
}
