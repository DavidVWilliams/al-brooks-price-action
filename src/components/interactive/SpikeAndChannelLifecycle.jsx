// Version: v1.0 - Tier 2 Spike and Channel Trend Lifecycle Engine
// Changelog:
// - v1.0: Interactive 3-phase trend evolution visualizer (Spike -> Channel -> Retest of Origin).

import { useState } from 'react';

const LIFECYCLE_PHASES = [
  {
    phaseId: 1,
    name: 'Phase 1: The Breakout Spike',
    badge: 'Urgency / Pure Momentum',
    badgeColor: 'bg-emerald-950/70 border-emerald-500 text-emerald-300',
    barCount: 3,
    description: 'Consecutive strong bull trend bars closing on their highs. No pullbacks exist because smart money is aggressively buying at market. Fading this spike results in immediate account liquidation.',
    actionRule: 'Buy at market or buy closes. Never look for shorts.'
  },
  {
    phaseId: 2,
    name: 'Phase 2: The Grinding Bull Channel',
    badge: 'Two-Sided Participation',
    badgeColor: 'bg-blue-950/70 border-blue-500 text-blue-300',
    barCount: 6,
    description: 'Pullbacks begin to print and the upward slope becomes less steep. Profit-taking algorithms scale out, and bears begin shorting highs. While still Always In Long, the trend is weaker and vulnerable.',
    actionRule: 'Only buy pullbacks at the channel trendline or 20 EMA. Stop chasing breakouts.'
  },
  {
    phaseId: 3,
    name: 'Phase 3: Trendline Break & Retest of Origin',
    badge: 'Magnetic Reversal Target',
    badgeColor: 'bg-amber-950/70 border-amber-500 text-amber-300',
    barCount: 9,
    description: 'Bears break below the bull channel trendline. Price is now magnetically pulled back down to retest the Channel Origin (the low of Bar 4 where the channel began). This retest occurs ~75% of the time.',
    actionRule: 'Channel origin serves as the primary take-profit target for bears and support for range traders.'
  }
];

// 9-bar sequence illustrating Spike (1-3) -> Channel (4-6) -> Retest Breakdown (7-9)
const BARS = [
  // Spike (1 - 3)
  { id: 1, open: 5010.0, high: 5015.0, low: 5009.5, close: 5014.5, type: 'bull' },
  { id: 2, open: 5014.5, high: 5019.5, low: 5014.0, close: 5019.0, type: 'bull' },
  { id: 3, open: 5019.0, high: 5024.0, low: 5018.5, close: 5023.5, type: 'bull' },
  // Channel begins at Bar 4 low (Origin = 5021.00)
  { id: 4, open: 5023.5, high: 5026.0, low: 5021.0, close: 5025.0, type: 'bull' },
  { id: 5, open: 5025.0, high: 5027.5, low: 5022.5, close: 5026.5, type: 'bull' },
  { id: 6, open: 5026.5, high: 5029.0, low: 5024.0, close: 5027.5, type: 'bull' },
  // Retest breakdown (7 - 9)
  { id: 7, open: 5027.5, high: 5028.0, low: 5023.0, close: 5023.5, type: 'bear' },
  { id: 8, open: 5023.5, high: 5024.0, low: 5021.0, close: 5021.5, type: 'bear' },
  { id: 9, open: 5021.5, high: 5022.5, low: 5020.5, close: 5021.0, type: 'doji' }, // Hits origin at 5021.0
];

export default function SpikeAndChannelLifecycle() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0); // 0, 1, 2

  const currentPhase = LIFECYCLE_PHASES[activePhaseIndex];
  const visibleBars = BARS.slice(0, currentPhase.barCount);

  // SVG Geometry mappings
  const minP = 5008.0;
  const maxP = 5031.0;
  const svgH = 220;
  const getY = (p) => svgH - 20 - ((p - minP) / (maxP - minP)) * (svgH - 40);

  const originPrice = 5021.0;
  const originY = getY(originPrice);

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
              Spike and Channel Phase Transition Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe trend evolution from pure breakout momentum into a channel, concluding in a magnetic retest of the channel origin.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Phase <span className="text-blue-400 font-bold">{activePhaseIndex + 1}</span> of 3
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Start on <strong className="text-emerald-400">Phase 1 (The Spike)</strong>. Notice consecutive trend bars with no pullbacks.</li>
          <li>Click <strong className="text-blue-400">Phase 2 (The Channel)</strong>. Watch two-sided overlapping bars develop with a flatter slope.</li>
          <li>Click <strong className="text-amber-400">Phase 3 (The Retest)</strong>. Observe how the channel breaks downward and magnetically pulls price directly to the Channel Origin (5021.00).</li>
        </ol>
      </div>

      {/* PHASE SELECTOR BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {LIFECYCLE_PHASES.map((p, idx) => {
          const isActive = idx === activePhaseIndex;
          return (
            <button
              key={p.phaseId}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                isActive
                  ? 'bg-blue-950/80 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-400">0{p.phaseId}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${p.badgeColor}`}>
                  {p.phaseId === 1 ? 'Spike' : p.phaseId === 2 ? 'Channel' : 'Retest'}
                </span>
              </div>
              <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {p.name.split(': ')[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            5-Min ES Trend Evolution
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 320 220">
            {/* Horizontal Grid lines */}
            {[5010, 5015, 5020, 5025, 5030].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="305" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="310" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Channel Origin Reference Line (Active in Phase 2 & 3) */}
            {activePhaseIndex >= 1 && (
              <g className="animate-fadeIn">
                <line x1="120" y1={originY} x2="310" y2={originY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="125" y={originY - 4} fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  Channel Origin: 5021.00 (Magnetic Retest Target)
                </text>
              </g>
            )}

            {/* Bull Channel Trendline (Phase 2 & 3) */}
            {activePhaseIndex >= 1 && (
              <line
                x1={135}
                y1={getY(BARS[3].low)}
                x2={215}
                y2={getY(BARS[5].low)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Candlesticks */}
            {visibleBars.map((b, i) => {
              const x = 25 + i * 32;
              const isBull = b.type === 'bull';
              const isDoji = b.type === 'doji';
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));

              return (
                <g key={b.id}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isDoji ? '#94a3b8' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <rect
                    x={x - 10}
                    y={bodyTop}
                    width="20"
                    height={bodyH}
                    fill={isDoji ? '#475569' : isBull ? '#065f46' : '#881337'}
                    stroke={isDoji ? '#94a3b8' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                    rx="1.5"
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
            <span>Current Stage: <strong className="text-white">{currentPhase.name.split(': ')[1]}</strong></span>
            <span>Retest Target: <strong className="text-amber-400">5021.00</strong></span>
          </div>
        </div>

        {/* RIGHT: PHASE METRICS & INSTITUTIONAL RULES */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border inline-block ${currentPhase.badgeColor}`}>
                {currentPhase.badge}
              </span>
              <h4 className="text-base font-bold text-white">
                {currentPhase.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPhase.description}
              </p>
            </div>

            <div className="p-3 bg-blue-950/40 border-l-4 border-blue-500 rounded-r text-xs text-slate-200 leading-relaxed">
              <strong className="text-blue-400 block mb-1 uppercase font-mono text-[10px]">Institutional Playbook:</strong>
              {currentPhase.actionRule}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => setActivePhaseIndex(0)}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
            >
              ↺ Reset
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setActivePhaseIndex((prev) => Math.max(0, prev - 1))}
                disabled={activePhaseIndex === 0}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono transition-colors text-slate-200"
              >
                ◀ Prev Phase
              </button>
              <button
                onClick={() => setActivePhaseIndex((prev) => Math.min(2, prev + 1))}
                disabled={activePhaseIndex === 2}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-mono font-semibold transition-colors text-white"
              >
                Next Phase ▶
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
