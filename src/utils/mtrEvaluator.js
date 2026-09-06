// Version: v1.0 - Tier 4.1 Major Trend Reversal (MTR) Structure Evaluator
export function evaluateMTRStructure({
  trendlineBroken = false,
  breakoutMomentumBars = 0,
  retestType = 'lower_high', // 'lower_high' | 'higher_high' | 'double_top'
  signalBarQuality = 'strong_bear', // 'strong_bear' | 'weak_doji' | 'bull_body'
  priorTrendStrength = 'channel' // 'micro_channel' | 'channel' | 'range'
}) {
  // Al Brooks Rule: An MTR requires (1) a prior trendline break with momentum,
  // (2) a retest of the prior extreme, and (3) a high-quality signal bar.
  if (priorTrendStrength === 'micro_channel') {
    return {
      isValidMTR: false,
      grade: 'Untradable',
      winRate: 0.20,
      reason: 'Micro channel in play. First reversal attempt almost always fails into a bull flag.',
      actionableAdvice: 'Wait for a major trendline break and at least 5-10 bars of two-sided trading before seeking an MTR.'
    };
  }

  if (!trendlineBroken) {
    return {
      isValidMTR: false,
      grade: 'Invalid',
      winRate: 0.25,
      reason: 'No prior trendline break. Counter-trend trades without a trendline break have poor expectancy.',
      actionableAdvice: 'Wait for a strong counter-trend swing that convincingly closes beyond the dominant trendline.'
    };
  }

  if (breakoutMomentumBars < 2) {
    return {
      isValidMTR: false,
      grade: 'C-',
      winRate: 0.35,
      reason: 'Weak trendline break lacks institutional displacement (requires 2+ consecutive counter-trend closes).',
      actionableAdvice: 'Treat as a minor pullback unless sellers demonstrate aggressive follow-through.'
    };
  }

  const isStrongSignal = signalBarQuality === 'strong_bear';
  const isLowerHigh = retestType === 'lower_high';

  if (isStrongSignal && isLowerHigh) {
    return {
      isValidMTR: true,
      grade: 'A+',
      winRate: 0.60,
      reason: 'Textbook Major Trend Reversal: Convincing trendline break followed by a lower high test and strong bear signal bar.',
      actionableAdvice: 'Place a sell stop order at 1 tick below the signal bar low. Initial stop at 1 tick above the lower high extreme.'
    };
  }

  if (isStrongSignal && retestType === 'higher_high') {
    return {
      isValidMTR: true,
      grade: 'B+',
      winRate: 0.55,
      reason: 'Higher High MTR: False breakout sweep above the prior extreme rejected sharply by institutions.',
      actionableAdvice: 'Enter on stop at 1 tick below signal bar. Expect initial target to test the trendline breakout low.'
    };
  }

  return {
    isValidMTR: false,
    grade: 'Weak',
    winRate: 0.40,
    reason: 'Retest printed a poor signal bar (doji or bull close), indicating ongoing two-sided stalemate rather than conviction.',
    actionableAdvice: 'Do not enter on poor signal bar. Wait for a second entry (Low 2) or an established bear trend bar close.'
  };
}
