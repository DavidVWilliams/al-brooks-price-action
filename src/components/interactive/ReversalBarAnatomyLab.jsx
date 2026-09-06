// Version: v1.0 - Tier 1 Reversal Bar Anatomy & Setup Scoring Scanner
// Changelog:
// - v1.0: Interactive sliders for tail length, body position, and real-time setup grade scoring.

import { useState } from 'react';

export default function ReversalBarAnatomyLab() {
  // Percentages from bottom (0) to top (100)
  const [lowerTailPct, setLowerTailPct] = useState(55); // Bottom tail size in %
  const [bodyHeightPct, setBodyHeightPct] = useState(35); // Body height in %
  const [isBullBody, setIsBullBody] = useState(true);

  // Derived metrics
  const openPct = isBullBody ? lowerTailPct : lowerTailPct + bodyHeightPct;
  const closePct = isBullBody ? lowerTailPct + bodyHeightPct : lowerTailPct;
  const upperTailPct = Math.max(0, 100 - (lowerTailPct + bodyHeightPct));
  const closeLocationPct = closePct;

  // Grade calculation based on Al Brooks criteria
  const calculateGrade = () => {
    // Bull reversal bar criteria:
    // 1. Lower tail >= 50% (strong rejection)
    // 2. Close in top 25%
    // 3. Bull body (close > open)
    // 4. Little to no upper tail (<= 15%)
    let score = 0;
    const reasons = [];

    if (lowerTailPct >= 50) {
      score += 40;
      reasons.push('Prominent rejection tail (>=50% of range)');
    } else if (lowerTailPct >= 33) {
      score += 20;
      reasons.push('Moderate rejection tail (>=33% of range)');
    } else {
      reasons.push('Weak tail (<33%): insufficient liquidity rejection');
    }

    if (closeLocationPct >= 75) {
      score += 35;
      reasons.push('Close locked in the upper 25%');
    } else if (closeLocationPct >= 50) {
      score += 15;
      reasons.push('Close above midpoint, but not near extreme');
    } else {
      reasons.push('Poor close (bottom half): sellers remained in control');
    }

    if (isBullBody) {
      score += 15;
      reasons.push('Bullish body color (Close > Open)');
    } else {
      reasons.push('Bear body color creates hesitation');
    }

    if (upperTailPct <= 15) {
      score += 10;
      reasons.push('Minimal upper tail: no overhead pushback');
    } else {
      reasons.push('Upper tail shows selling pressure into the close');
    }

    if (score >= 85) {
      return {
        grade: 'A+ Institutional Signal',
        color: 'text-emerald-400',
        badge: 'bg-emerald-950/60 border-emerald-500 text-emerald-300',
        score,
        reasons
      };
    } else if (score >= 60) {
      return {
        grade: 'B-Grade (Requires Context)',
        color: 'text-amber-400',
        badge: 'bg-amber-950/60 border-amber-500 text-amber-300',
        score,
        reasons
      };
    } else {
      return {
        grade: 'Untradable / Probable Trap',
        color: 'text-rose-400',
        badge: 'bg-rose-950/60 border-rose-500 text-rose-300',
        score,
        reasons
      };
    }
  };

  const evaluation = calculateGrade();

  // SVG Geometry mappings
  const svgH = 220;
  const paddingY = 20;
  const getY = (pct) => (svgH - paddingY) - (pct / 100) * (svgH - paddingY * 2);

  const openY = getY(openPct);
  const closeY = getY(closePct);
  const highY = getY(100);
  const lowY = getY(0);

  const bodyTop = Math.min(openY, closeY);
  const bodyH = Math.max(3, Math.abs(openY - closeY));

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
              Reversal Bar Anatomy & Setup Scoring Scanner
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deconstruct reversal bars: tail proportion, closing extreme, and institutional grade metrics.
          </p>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Adjust the <strong className="text-slate-100">Lower Tail</strong> slider to 55% or higher, and verify the body is Bullish. Notice the <strong className="text-emerald-400">A+ Institutional Signal</strong> rating.</li>
          <li>Lower the tail down to 20% and toggle the body to <strong className="text-rose-400">Bearish</strong>. Observe how the setup degrades into an <strong className="text-rose-400">Untradable Trap</strong>.</li>
          <li><strong>Takeaway:</strong> A true reversal bar requires both a decisive liquidity flush (long tail) and a decisive close near its extreme.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS & SLIDERS */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center flex-1">
            <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Anatomy Visualizer
            </span>

            <svg className="w-full h-56 select-none" viewBox="0 0 240 220">
              {/* Reference Grid lines */}
              <line x1="30" y1={highY} x2="210" y2={highY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="25" y={highY + 3} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">High (100%)</text>

              <line x1="30" y1={getY(50)} x2="210" y2={getY(50)} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
              <text x="25" y={getY(50) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">50% Mid</text>

              <line x1="30" y1={lowY} x2="210" y2={lowY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="25" y={lowY + 3} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">Low (0%)</text>

              {/* Central Wick */}
              <line x1="120" y1={highY} x2="120" y2={lowY} stroke={isBullBody ? '#10b981' : '#f43f5e'} strokeWidth="2" />

              {/* Real Body */}
              <rect
                x="95"
                y={bodyTop}
                width="50"
                height={bodyH}
                fill={isBullBody ? '#065f46' : '#881337'}
                stroke={isBullBody ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                rx="2"
              />

              {/* Tail Highlight Bracket */}
              <line x1="155" y1={lowY} x2="155" y2={getY(lowerTailPct)} stroke="#38bdf8" strokeWidth="2" />
              <text x="162" y={getY(lowerTailPct / 2) + 3} fill="#38bdf8" fontSize="8" fontFamily="monospace">
                Tail: {lowerTailPct}%
              </text>

              {/* Close marker */}
              <circle cx="120" cy={closeY} r="3" fill="#f8fafc" />
              <text x="85" y={closeY + 3} fill="#f8fafc" fontSize="8" fontFamily="monospace" textAnchor="end">
                Close: {closeLocationPct}%
              </text>
            </svg>
          </div>

          {/* SLIDERS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Lower Rejection Tail</span>
                <span className="text-blue-400 font-bold">{lowerTailPct}%</span>
              </div>
              <input
                type="range" min="10" max="80" step="1" value={lowerTailPct}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setLowerTailPct(val);
                  if (val + bodyHeightPct > 95) setBodyHeightPct(95 - val);
                }}
                className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Body Height</span>
                <span className="text-slate-200 font-bold">{bodyHeightPct}%</span>
              </div>
              <input
                type="range" min="10" max={Math.max(10, 95 - lowerTailPct)} step="1" value={bodyHeightPct}
                onChange={(e) => setBodyHeightPct(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-slate-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono text-slate-400">Body Polarity:</span>
              <button
                onClick={() => setIsBullBody(!isBullBody)}
                className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors border ${
                  isBullBody ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-rose-950 text-rose-300 border-rose-600'
                }`}
              >
                {isBullBody ? '▲ Bull Body (Green)' : '▼ Bear Body (Red)'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME HUD & SCORING */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Quality Audit
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${evaluation.badge}`}>
                  Score: {evaluation.score} / 100
                </span>
              </div>

              <h4 className={`text-xl font-black ${evaluation.color}`}>
                {evaluation.grade}
              </h4>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                {evaluation.reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <span className={r.startsWith('Weak') || r.startsWith('Poor') || r.includes('hesitation') || r.includes('selling pressure') ? 'text-rose-400' : 'text-emerald-400'}>
                      {r.startsWith('Weak') || r.startsWith('Poor') || r.includes('hesitation') || r.includes('selling pressure') ? '✕' : '✓'}
                    </span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TAIL</span>
                <strong className={lowerTailPct >= 50 ? 'text-emerald-400' : 'text-slate-300'}>{lowerTailPct}%</strong>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CLOSE</span>
                <strong className={closeLocationPct >= 75 ? 'text-emerald-400' : 'text-slate-300'}>{closeLocationPct}%</strong>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">UPPER WICK</span>
                <strong className={upperTailPct <= 15 ? 'text-emerald-400' : 'text-rose-400'}>{upperTailPct}%</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-950/30 border-l-4 border-blue-500 rounded-r text-xs text-slate-300 leading-relaxed">
            <strong className="text-blue-400 block mb-0.5 uppercase font-mono text-[10px]">Al Brooks Rule:</strong>
            "Never buy a bull reversal bar that closes in the middle of its range or has a large upper tail. Smart money will not risk capital until buyers prove they can lock in the close near the absolute high."
          </div>

        </div>

      </div>
    </div>
  );
}
