// Version: v1.0 - Tier 3 20 EMA Gap Bar Reversal & Magnet Engine
// Changelog:
// - v1.0: Interactive Moving Average Gap Bar (MAGB) simulator demonstrating the 75% trend-high retest rule.

import { useState } from 'react';

const EXTENDED_TREND_BARS = [
  { id: 25, open: 5022.0, high: 5026.0, low: 5021.5, close: 5025.5, type: 'bull', isGap: false },
  { id: 26, open: 5025.5, high: 5029.0, low: 5025.0, close: 5028.5, type: 'bull', isGap: false },
  { id: 27, open: 5028.5, high: 5030.0, low: 5027.0, close: 5029.5, type: 'bull', isGap: false }, // Trend High
  { id: 28, open: 5029.5, high: 5030.0, low: 5024.0, close: 5024.5, type: 'bear', isGap: false }, // Correction begins
  { id: 29, open: 5024.5, high: 5025.0, low: 5021.0, close: 5021.5, type: 'bear', isGap: false }, // Touches EMA
  // Bar 30: Moving Average Gap Bar (High is 5020.50, Low is 5017.00 - COMPLETELY below 20 EMA at 5021.50)
  { id: 30, open: 5021.0, high: 5020.5, low: 5017.0, close: 5018.0, type: 'bear', isGap: true },
];

const RESUMPTION_BARS = [
  { id: 31, open: 5018.0, high: 5023.0, low: 5017.5, close: 5022.5, type: 'bull', isGap: false },
  { id: 32, open: 5022.5, high: 5027.0, low: 5022.0, close: 5026.5, type: 'bull', isGap: false },
  { id: 33, open: 5026.5, high: 5030.5, low: 5026.0, close: 5030.0, type: 'bull', isGap: false }, // Retests prior trend high!
];

export default function MovingAverageGapBarLab() {
  const [phase, setPhase] = useState(0); // 0 = At Gap Bar (Bar 30), 1 = Action Taken, 2 = Resumption to High
  const [userAction, setUserAction] = useState(null); // 'buy_gap' or 'short_breakdown'
  const [feedback, setFeedback] = useState(null);

  const handleAction = (action) => {
    setUserAction(action);
    setPhase(1);

    if (action === 'buy_gap') {
      setFeedback({
        correct: true,
        title: '🎯 Institutional Play: Buying the 20 EMA Gap Bar Discount',
        text: 'After 25+ bars above the moving average, a bar completely below the 20 EMA is a major buying opportunity, not a reversal. Institutional limit orders buy below this bar, anticipating a test of the 5030.00 trend high ~75% of the time.'
      });
    } else {
      setFeedback({
        correct: false,
        title: '🚨 Fading the Trend: Trapped on False Breakdown',
        text: 'You shorted a gap bar below the 20 EMA in a strong bull trend. First touches or gap bars almost never initiate a bear trend. You are short into institutional value buyers.'
      });
    }
  };

  const handleStepResumption = () => {
    setPhase(2);
  };

  const handleReset = () => {
    setPhase(0);
    setUserAction(null);
    setFeedback(null);
  };

  // Bars to display
  const activeBars = phase === 2 ? [...EXTENDED_TREND_BARS, ...RESUMPTION_BARS] : EXTENDED_TREND_BARS;

  // SVG Geometry
  const minP = 5014.0;
  const maxP = 5033.0;
  const svgH = 220;
  const getY = (p) => svgH - 20 - ((p - minP) / (maxP - minP)) * (svgH - 40);

  // Dynamic 20 EMA Points: smoothly sloping upward from 5018 to 5024
  const emaY_start = getY(5018.0);
  const emaY_bar30 = getY(5021.5);
  const emaY_end = getY(5024.5);

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
              20 EMA Gap Bar Reversal & Magnet Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe the first gap bar below the 20 EMA after an extended 30-bar bull trend and verify the 75% trend-high retest rule.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          20 EMA: <span className="text-blue-400 font-bold">5021.50</span>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Look at Bar 30. Its high (5020.50) is completely below the cyan 20 EMA (5021.50)—this is a true **Moving Average Gap Bar**.</li>
          <li>Choose your decision: <strong className="text-emerald-400">Buy the Gap Bar Discount</strong> or <strong className="text-rose-400">Short the Moving Average Breakdown</strong>.</li>
          <li>Click <strong className="text-blue-400">Step Resumption to Prior High ➔</strong> to watch algorithms aggressively buy the discount and surge price straight back to 5030.00.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS WITH 20 EMA OVERLAY */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            20 EMA Interaction Canvas
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 340 220">
            {/* Price Grid */}
            {[5015, 5020, 5025, 5030].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="325" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="330" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Prior Trend High Line */}
            <line x1="15" y1={getY(5030.0)} x2="325" y2={getY(5030.0)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
            <text x="25" y={getY(5030.0) - 4} fill="#fbbf24" fontSize="8" fontFamily="monospace">
              Prior Trend High: 5030.00
            </text>

            {/* Rising 20 EMA Line */}
            <path
              d={`M 15 ${emaY_start} Q 180 ${emaY_bar30}, 325 ${emaY_end}`}
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
            />
            <text x="325" y={emaY_end - 6} fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">
              20 EMA
            </text>

            {/* Candlesticks */}
            {activeBars.map((b, i) => {
              const x = 25 + i * 33;
              const isBull = b.type === 'bull';
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));

              return (
                <g key={b.id} className={i >= 6 ? 'animate-fadeIn' : ''}>
                  {/* Highlight Bar 30 (Gap Bar) */}
                  {b.isGap && (
                    <g>
                      <rect x={x - 14} y={highY - 4} width="28" height={(lowY - highY) + 8} fill="#38bdf8" opacity="0.15" rx="3" />
                      <text x={x} y={lowY + 14} fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        GAP BAR
                      </text>
                    </g>
                  )}

                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={b.isGap ? '#38bdf8' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth={b.isGap ? '2.5' : '1.5'}
                  />
                  {/* Body */}
                  <rect
                    x={x - 10}
                    y={bodyTop}
                    width="20"
                    height={bodyH}
                    fill={isBull ? '#065f46' : '#881337'}
                    stroke={b.isGap ? '#38bdf8' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth={b.isGap ? '2' : '1'}
                    rx="1.5"
                  />
                  {/* Bar Number */}
                  <text
                    x={x}
                    y={svgH - 5}
                    fill={b.isGap ? '#38bdf8' : '#64748b'}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight={b.isGap ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    B{b.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Bars Above 20 EMA: <strong className="text-emerald-400">29 Consecutive Bars</strong></span>
            <span>Bar 30 High: <strong className="text-blue-400">5020.50 (Gap: 1.00 pt)</strong></span>
          </div>
        </div>

        {/* RIGHT: DECISION TERMINAL & PRINCIPLES */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Decision Terminal
              </span>
              <h4 className="text-base font-bold text-white">
                Bar 30 printed completely below the 20 EMA. What is your trade?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Retail traders view this as a moving average breakdown. How do institutional algorithms position when an extended trend touches its 20 EMA for the first time?
              </p>

              {/* Trade Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleAction('buy_gap')}
                  disabled={phase !== 0}
                  className={`p-3 rounded-lg border font-mono text-xs font-bold transition-all ${
                    userAction === 'buy_gap'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400'
                  }`}
                >
                  + Buy the Gap Bar (Discount)
                </button>
                <button
                  onClick={() => handleAction('short_breakdown')}
                  disabled={phase !== 0}
                  className={`p-3 rounded-lg border font-mono text-xs font-bold transition-all ${
                    userAction === 'short_breakdown'
                      ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500 hover:text-rose-400'
                  }`}
                >
                  - Short the Breakdown (Fade)
                </button>
              </div>
            </div>

            {/* Real-time Feedback Banner */}
            {feedback && (
              <div
                className={`p-3.5 rounded-xl border animate-fadeIn space-y-1 ${
                  feedback.correct
                    ? 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-900 text-rose-200'
                }`}
              >
                <span className="text-xs font-mono font-bold uppercase block">
                  {feedback.title}
                </span>
                <p className="text-xs leading-relaxed">{feedback.text}</p>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
            >
              ↺ Reset
            </button>

            <button
              onClick={handleStepResumption}
              disabled={phase === 0 || phase === 2}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded text-xs font-mono font-semibold transition-colors"
            >
              Step Resumption to Prior High ➔
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
