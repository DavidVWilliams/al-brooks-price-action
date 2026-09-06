// Version: v1.0 - Tier 2 The 80% Rule Breakout & Trap Sandbox
// Changelog:
// - v1.0: Interactive trading range breakout simulator modeling the 80% failure rate vs. 20% genuine breakout.

import { useState } from 'react';

const BASE_RANGE_BARS = [
  { id: 1, open: 5018.0, high: 5023.0, low: 5017.0, close: 5022.5, type: 'bull' },
  { id: 2, open: 5022.5, high: 5024.0, low: 5016.5, close: 5017.0, type: 'bear' },
  { id: 3, open: 5017.0, high: 5022.0, low: 5016.0, close: 5021.5, type: 'bull' },
  { id: 4, open: 5021.5, high: 5023.5, low: 5017.0, close: 5018.0, type: 'bear' },
  { id: 5, open: 5018.0, high: 5024.0, low: 5017.5, close: 5023.5, type: 'bull' },
];

export default function EightyPercentRuleSimulator() {
  const [attemptCount, setAttemptCount] = useState(0);
  const [stats, setStats] = useState({ failures: 0, successes: 0 });
  const [lastOutcome, setLastOutcome] = useState(null); // 'failed' or 'success'

  const resistancePrice = 5024.0;
  const supportPrice = 5016.0;

  const handleTriggerBreakout = () => {
    // Al Brooks 80% Rule: 80% of trading range breakouts fail and reverse into the range
    const isFailure = Math.random() < 0.80;
    const outcome = isFailure ? 'failed' : 'success';

    setLastOutcome(outcome);
    setAttemptCount((prev) => prev + 1);
    setStats((prev) => ({
      failures: prev.failures + (isFailure ? 1 : 0),
      successes: prev.successes + (isFailure ? 0 : 1),
    }));
  };

  const handleReset = () => {
    setAttemptCount(0);
    setStats({ failures: 0, successes: 0 });
    setLastOutcome(null);
  };

  // SVG Geometry
  const minP = 5012.0;
  const maxP = 5032.0;
  const svgH = 220;
  const getY = (p) => svgH - 20 - ((p - minP) / (maxP - minP)) * (svgH - 40);

  const resY = getY(resistancePrice);
  const supY = getY(supportPrice);

  // Dynamic Bar 6 based on outcome
  const breakoutBar = lastOutcome === 'failed'
    ? { id: 6, open: 5023.5, high: 5026.5, low: 5017.5, close: 5018.0, type: 'bear_trap' }
    : lastOutcome === 'success'
    ? { id: 6, open: 5023.5, high: 5029.5, low: 5023.0, close: 5029.0, type: 'bull_trend' }
    : null;

  const displayedBars = breakoutBar ? [...BASE_RANGE_BARS, breakoutBar] : BASE_RANGE_BARS;

  const failureRate = attemptCount > 0 ? Math.round((stats.failures / attemptCount) * 100) : 80;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-2xl space-y-6 text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-xs font-semibold border border-blue-900/60">
              Interactive Micro-Lab
            </span>
            <h3 className="text-base md:text-lg font-bold text-white">
              The 80% Rule Breakout & Trap Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate breakout attempts beyond trading range resistance and verify the statistical dominance of the 80% failure rule.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Trials Executed: <span className="text-blue-400 font-bold">{attemptCount}</span>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Notice price coiling between established Range Resistance (5024.00) and Support (5016.00).</li>
          <li>Click <strong className="text-blue-400">Trigger Breakout Attempt ⚡</strong> multiple times to test institutional liquidity absorption.</li>
          <li>Observe how frequently Bar 6 sweeps above 5024.00 to trap retail breakout buyers before plunging right back to the bottom of the range.</li>
          <li><strong>Takeaway:</strong> Range trading demands the BLSHS protocol (Buy Low, Sell High, Scalp). Always assume breakouts will fail until proven otherwise.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Trading Range Boundary Simulator
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 300 220">
            {/* Range Resistance & Support Fill Box */}
            <rect
              x="20"
              y={resY}
              width="260"
              height={supY - resY}
              fill="#1e293b"
              opacity="0.25"
              rx="2"
            />

            {/* Resistance Line (Sell High Zone) */}
            <line x1="15" y1={resY} x2="285" y2={resY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="20" y={resY - 4} fill="#fb7185" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Resistance: 5024.00 (Institutional Limit Sell Zone)
            </text>

            {/* Support Line (Buy Low Zone) */}
            <line x1="15" y1={supY} x2="285" y2={supY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="20" y={supY + 12} fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Support: 5016.00 (Institutional Limit Buy Zone)
            </text>

            {/* Bars */}
            {displayedBars.map((b, i) => {
              const x = 35 + i * 40;
              const isBull = b.type === 'bull' || b.type === 'bull_trend';
              const isTrap = b.type === 'bear_trap';
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));

              return (
                <g key={b.id} className={i === 5 ? 'animate-fadeIn' : ''}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isTrap ? '#f43f5e' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth={i === 5 ? '2.5' : '1.5'}
                  />
                  {/* Body */}
                  <rect
                    x={x - 12}
                    y={bodyTop}
                    width="24"
                    height={bodyH}
                    fill={isTrap ? '#881337' : isBull ? '#065f46' : '#881337'}
                    stroke={isTrap ? '#f43f5e' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth={i === 5 ? '2' : '1'}
                    rx="1.5"
                  />
                  {/* Bar Label */}
                  <text
                    x={x}
                    y={svgH - 5}
                    fill={i === 5 ? (isTrap ? '#fb7185' : '#34d399') : '#64748b'}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight={i === 5 ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {i === 5 ? (isTrap ? 'TRAP' : 'TREND') : `B${b.id}`}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Range Width: <strong className="text-white">8.00 pts</strong></span>
            <span>Last Attempt: <strong className={lastOutcome === 'failed' ? 'text-rose-400' : lastOutcome === 'success' ? 'text-emerald-400' : 'text-slate-500'}>{lastOutcome ? (lastOutcome === 'failed' ? '80% FAILURE (TRAP)' : '20% SUCCESS (TREND)') : 'READY'}</strong></span>
          </div>
        </div>

        {/* RIGHT: MONTE CARLO STATS & TELEMETRY */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            {/* Live Stats Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Empirical Breakdown Statistics
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 block">Failures (Traps)</span>
                  <strong className="text-xl font-mono text-rose-400">{stats.failures}</strong>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 block">Clean Breakouts</span>
                  <strong className="text-xl font-mono text-emerald-400">{stats.successes}</strong>
                </div>
              </div>

              {/* Probability Visual Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Empirical Failure Rate:</span>
                  <span className="text-amber-400 font-bold">{failureRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-500 transition-all duration-300"
                    style={{ width: `${failureRate}%` }}
                  />
                  <div
                    className="bg-emerald-500 transition-all duration-300"
                    style={{ width: `${100 - failureRate}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block pt-0.5 font-mono">
                  Theoretical Benchmark: 80% Reversal / 20% Trend
                </span>
              </div>
            </div>

            {/* Dynamic Outcome Banner */}
            {lastOutcome && (
              <div
                className={`p-3.5 rounded-xl border animate-fadeIn space-y-1 ${
                  lastOutcome === 'failed'
                    ? 'bg-rose-950/40 border-rose-900 text-rose-200'
                    : 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
                }`}
              >
                <span className="text-xs font-mono font-bold uppercase block">
                  {lastOutcome === 'failed' ? '🚨 80% Rule Confirmed: Breakout Failed' : '⚡ 20% Exception: Clean Trend Breakout'}
                </span>
                <p className="text-xs leading-relaxed">
                  {lastOutcome === 'failed'
                    ? 'Price ticked above 5024.00, filled retail buy stops, and immediately reversed down into Bar 6. Institutional limit sellers profited handsomely.'
                    : 'Strong institutional displacement broke through 5024.00 and closed near the high. This represents the rare 20% occurrence where a trend establishes.'}
                </p>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <button
              onClick={handleTriggerBreakout}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-bold transition-colors shadow-lg"
            >
              Trigger Breakout Attempt ⚡
            </button>

            <button
              onClick={handleReset}
              className="w-full py-1 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors text-center"
            >
              ↺ Reset Statistics
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
