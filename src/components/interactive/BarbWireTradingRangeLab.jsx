// Version: v1.0 - Tier 3 Barb Wire & BLSHS Arena
// Changelog:
// - v1.0: Interactive tight trading range sandbox demonstrating whipsaw breakout traps vs. limit-order fading discipline.

import { useState } from 'react';

const BARB_WIRE_BARS = [
  // 6 tight, overlapping bars piercing a completely flat 20 EMA at 5020.00
  { id: 1, open: 5019.5, high: 5022.0, low: 5018.0, close: 5021.0, type: 'bull_doji' },
  { id: 2, open: 5021.0, high: 5022.5, low: 5018.5, close: 5019.0, type: 'bear_doji' },
  { id: 3, open: 5019.0, high: 5023.0, low: 5018.0, close: 5021.5, type: 'bull_doji' },
  { id: 4, open: 5021.5, high: 5022.0, low: 5017.5, close: 5018.5, type: 'bear_doji' },
  { id: 5, open: 5018.5, high: 5023.5, low: 5018.0, close: 5021.0, type: 'bull_doji' },
  { id: 6, open: 5021.0, high: 5022.0, low: 5017.5, close: 5019.5, type: 'bear_doji' },
];

export default function BarbWireTradingRangeLab() {
  const [selectedAction, setSelectedAction] = useState(null); // 'breakout_stop', 'fade_limit', 'stand_aside'
  const [outcome, setOutcome] = useState(null);

  const handleAction = (action) => {
    setSelectedAction(action);

    if (action === 'breakout_stop') {
      setOutcome({
        status: 'error',
        title: '🚨 Trapped in Barb Wire: Stop Run & Instant Reversal',
        text: 'You bought on a stop at 5023.50 as Bar 5 poked above the range. The breakout had no follow-through. Smart money faded your buy stop with limit sells, and price instantly fell back to 5019.50. You took maximum slippage and a loss.'
      });
    } else if (action === 'fade_limit') {
      setOutcome({
        status: 'success',
        title: '✅ Institutional BLSHS Scalp: Limit Fade Executed',
        text: 'You placed a passive limit order to sell at 5023.00 (above prior bars) and scalped 1 point as price reverted back to the 20 EMA midpoint. Notice that while profitable, profits are small and risk of sudden breakout expansion is high.'
      });
    } else {
      setOutcome({
        status: 'optimal',
        title: '🏆 Al Brooks Master Discipline: Stand Aside (Best Choice)',
        text: 'In Barb Wire, smart money recognizes a low-probability, negative-expectancy environment. Over 70% of breakout attempts fail and whipsaw. The highest EV play is to conserve capital until a strong breakout bar closes completely outside the wire with follow-through.'
      });
    }
  };

  const handleReset = () => {
    setSelectedAction(null);
    setOutcome(null);
  };

  // SVG Geometry
  const minP = 5015.0;
  const maxP = 5025.0;
  const svgH = 220;
  const getY = (p) => svgH - 20 - ((p - minP) / (maxP - minP)) * (svgH - 40);

  const emaY = getY(5020.0); // Completely flat 20 EMA

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
              Barb Wire & BLSHS Tight Trading Range Arena
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze the market's most toxic structure: horizontal body overlap, flat 20 EMA, and the graveyard of breakout stops.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          State: <span className="text-amber-400 font-bold">BARB WIRE (TIGHT TR)</span>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Observe the 4 diagnostic hallmarks of Barb Wire: <strong>(1)</strong> 3+ overlapping bars, <strong>(2)</strong> prominent tails, <strong>(3)</strong> alternating dojis, and <strong>(4)</strong> the flat cyan 20 EMA slicing right through the center.</li>
          <li>Select <strong className="text-rose-400">Buy Breakout Stop (+1 Tick Above High)</strong> to see how retail momentum buyers get trapped.</li>
          <li>Select <strong className="text-amber-400">Fade with Limit Order (BLSHS)</strong> or <strong className="text-emerald-400">Stand Aside / Wait for Breakout</strong> to evaluate professional protocols.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Barb Wire Footprint (ES 5-Min)
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 320 220">
            {/* Price Grid */}
            {[5017, 5020, 5023].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="305" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="310" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Flat 20 EMA passing through middle */}
            <line x1="15" y1={emaY} x2="305" y2={emaY} stroke="#38bdf8" strokeWidth="2" />
            <text x="305" y={emaY - 6} fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">
              Flat 20 EMA (5020.00)
            </text>

            {/* Barb Wire Boundary Zone */}
            <rect
              x="25"
              y={getY(5023.0)}
              width="265"
              height={getY(5017.5) - getY(5023.0)}
              fill="#f59e0b"
              opacity="0.08"
              rx="4"
            />
            <line x1="20" y1={getY(5023.0)} x2="295" y2={getY(5023.0)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1={getY(5017.5)} x2="295" y2={getY(5017.5)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

            {/* Bars */}
            {BARB_WIRE_BARS.map((b, i) => {
              const x = 45 + i * 40;
              const isBull = b.type.startsWith('bull');
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));

              return (
                <g key={b.id}>
                  {/* Wicks with prominent tails */}
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke={isBull ? '#10b981' : '#f43f5e'} strokeWidth="1.5" />
                  {/* Small / Doji Body */}
                  <rect
                    x={x - 11}
                    y={bodyTop}
                    width="22"
                    height={bodyH}
                    fill={isBull ? '#065f46' : '#881337'}
                    stroke={isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                    rx="1"
                  />
                  {/* Bar Number */}
                  <text x={x} y={svgH - 5} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    B{b.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Range Thickness: <strong className="text-amber-400">5.50 pts (Tight Churn)</strong></span>
            <span>Overlapping Bodies: <strong className="text-white">100% of Bars</strong></span>
          </div>
        </div>

        {/* RIGHT: ACTION SELECTION & INSTITUTIONAL RULES */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Execution Strategy Audit
              </span>
              <h4 className="text-base font-bold text-white">
                How should you manage active capital in Barb Wire?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test the three classic responses: breakout stop chasing, limit-order fading (BLSHS), or waiting for clear resolution.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleAction('breakout_stop')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono font-bold transition-all flex items-center justify-between ${
                    selectedAction === 'breakout_stop'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500'
                  }`}
                >
                  <span>1. Buy Breakout Stop (+1 Tick Above High)</span>
                  <span className="text-[10px] text-rose-400 font-normal">Chasing</span>
                </button>

                <button
                  onClick={() => handleAction('fade_limit')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono font-bold transition-all flex items-center justify-between ${
                    selectedAction === 'fade_limit'
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500'
                  }`}
                >
                  <span>2. Fade Range High with Limit Order (BLSHS)</span>
                  <span className="text-[10px] text-amber-400 font-normal">Scalping</span>
                </button>

                <button
                  onClick={() => handleAction('stand_aside')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono font-bold transition-all flex items-center justify-between ${
                    selectedAction === 'stand_aside'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  <span>3. Stand Aside (Wait for Decisive Breakout)</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Optimal EV</span>
                </button>
              </div>
            </div>

            {/* Outcome Banner */}
            {outcome && (
              <div
                className={`p-3.5 rounded-xl border animate-fadeIn space-y-1 ${
                  outcome.status === 'error'
                    ? 'bg-rose-950/40 border-rose-900 text-rose-200'
                    : outcome.status === 'success'
                    ? 'bg-amber-950/40 border-amber-900 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
                }`}
              >
                <span className="text-xs font-mono font-bold uppercase block">
                  {outcome.title}
                </span>
                <p className="text-xs leading-relaxed">{outcome.text}</p>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
            >
              ↺ Reset Scenario
            </button>

            <div className="text-[10px] font-mono text-slate-400">
              Rule: <span className="text-amber-400">Never buy stops in barb wire</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
