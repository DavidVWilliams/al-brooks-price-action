// Version: v1.0 - Al Brooks Trader's Equation & Risk Engine
// Evaluates: E = (P * Rw) - ((1 - P) * Rk)

/**
 * Evaluates trade parameters against the Trader's Equation.
 *
 * @param {Object} params
 * @param {number} params.entry - Order entry price
 * @param {number} params.stop - Protective stop price
 * @param {number} params.target - Profit target price
 * @param {'LONG'|'SHORT'} [params.direction='LONG'] - Trade direction
 * @param {number} [params.probability=0.50] - Estimated probability of success (0.00 to 1.00)
 * @param {Object} params.instrument - Contract specs from simulatorData.json (tickSize, pointValue, etc.)
 * @returns {Object} Full mathematical evaluation and Brooksian assessment
 */
export function evaluateTradersEquation({
  entry,
  stop,
  target,
  direction = 'LONG',
  probability = 0.50,
  instrument = {
    tickSize: 0.25,
    tickValue: 12.50,
    pointValue: 50.00,
    priceDecimals: 2
  }
}) {
  const isLong = direction.toUpperCase() === 'LONG';

  // 1. Calculate Risk (Rk) and Reward (Rw) in price points
  const riskPoints = isLong ? entry - stop : stop - entry;
  const rewardPoints = isLong ? target - entry : entry - target;

  // Validation: Guard against invalid price placement
  const isValidGeometry = riskPoints > 0 && rewardPoints > 0;

  if (!isValidGeometry) {
    return {
      isValid: false,
      error: isLong
        ? 'Invalid LONG order: Stop must be below entry and Target must be above entry.'
        : 'Invalid SHORT order: Stop must be above entry and Target must be below entry.',
      metrics: null
    };
  }

  // 2. Conversion to Ticks and Dollar amounts
  const tickSize = instrument.tickSize || 0.25;
  const pointValue = instrument.pointValue || 50.00;

  const riskTicks = Math.round((riskPoints / tickSize) * 10) / 10;
  const rewardTicks = Math.round((rewardPoints / tickSize) * 10) / 10;

  const riskDollars = riskPoints * pointValue;
  const rewardDollars = rewardPoints * pointValue;

  // 3. Ratios & Break-Even Math
  const riskRewardRatio = Math.round((rewardPoints / riskPoints) * 100) / 100; // Reward : Risk
  const requiredWinRate = Math.round((riskPoints / (rewardPoints + riskPoints)) * 1000) / 1000; // P_req = Rk / (Rw + Rk)

  // 4. Net Expectancy Calculation: E = (P * Rw) - ((1 - P) * Rk)
  const clampedProb = Math.min(Math.max(probability, 0), 1);
  const expectancyPoints = (clampedProb * rewardPoints) - ((1 - clampedProb) * riskPoints);
  const expectancyDollars = expectancyPoints * pointValue;

  // 5. Al Brooks Tactical Verdict
  let status = 'NEUTRAL';
  let qualityBadge = 'Marginal Equation';
  let commentary = '';

  if (expectancyDollars > 0) {
    if (riskRewardRatio >= 2.0 && clampedProb >= 0.50) {
      status = 'EXCELLENT';
      qualityBadge = 'Ideal Trader\'s Equation';
      commentary = 'High-probability swing setup with reward at least double the risk. Ideal institutional posture.';
    } else if (clampedProb >= 0.60 && riskRewardRatio >= 1.0) {
      status = 'STRONG';
      qualityBadge = 'Solid Trend Trade';
      commentary = 'High probability (>=60%) offsets moderate reward. Typical for breakout follow-through and tight channel entries.';
    } else {
      status = 'POSITIVE';
      qualityBadge = 'Positive Expectancy';
      commentary = 'Mathematically viable trade. Ensure stop management is respected to preserve edge.';
    }
  } else {
    status = 'NEGATIVE';
    qualityBadge = 'Weak Trader\'s Equation';
    commentary = 'Negative expectancy. Either the risk is too large for the target, or the estimated setup probability does not support the required win rate.';
  }

  return {
    isValid: true,
    error: null,
    metrics: {
      direction,
      risk: {
        points: Number(riskPoints.toFixed(instrument.priceDecimals || 2)),
        ticks: riskTicks,
        dollars: Number(riskDollars.toFixed(2))
      },
      reward: {
        points: Number(rewardPoints.toFixed(instrument.priceDecimals || 2)),
        ticks: rewardTicks,
        dollars: Number(rewardDollars.toFixed(2))
      },
      riskRewardRatio,
      probability: clampedProb,
      requiredWinRate,
      expectancy: {
        points: Number(expectancyPoints.toFixed(instrument.priceDecimals || 2)),
        dollars: Number(expectancyDollars.toFixed(2)),
        status,
        qualityBadge,
        commentary
      }
    }
  };
}

/**
 * Helper to compute default Brooks order boundaries from a Signal Bar.
 *
 * @param {Object} signalBar - OHLC object of the signal bar
 * @param {'BUY'|'SELL'} type - Setup signal direction
 * @param {Object} instrument - Instrument contract specs
 * @returns {Object} Suggested entry, stop, and standard 2:1 target
 */
export function computeBrooksSignalDefaults(signalBar, type, instrument) {
  const tick = instrument.tickSize || 0.25;
  const isBuy = type.toUpperCase() === 'BUY';

  if (isBuy) {
    const entry = signalBar.high + tick;
    const stop = signalBar.low - tick;
    const risk = entry - stop;
    const target = entry + (risk * 2); // Standard Brooks 2:1 swing target
    return { entry, stop, target, direction: 'LONG' };
  } else {
    const entry = signalBar.low - tick;
    const stop = signalBar.high + tick;
    const risk = stop - entry;
    const target = entry - (risk * 2);
    return { entry, stop, target, direction: 'SHORT' };
  }
}
