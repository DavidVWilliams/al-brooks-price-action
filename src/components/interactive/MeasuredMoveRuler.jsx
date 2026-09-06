// Version: v1.0 - Tier 2 Interactive Measured Move Ruler & Projection Caliper
// Changelog:
// - v1.0: Dynamic caliper projection calculating Leg 1 = Leg 2 Profit-Taking Zone (PTZ) targets.

import { useState } from 'react';

export default function MeasuredMoveRuler() {
  // Price anchors (default ES numbers)
  const [leg1Start, setLeg1Start] = useState(5010.00);
  const [leg1High, setLeg1High] = useState(5022.00);
  const [pullbackLow, setPullbackLow] = useState(5016.00);
  const [showProjection, setShowProjection] = useState(true);
  const [steppedToTarget, setSteppedToTarget] = useState(false);

  // Math
  const leg1Points = Math.max(1, +(leg1High - leg1Start).toFixed(2));
  const measuredTarget = +(pullbackLow + leg1Points).toFixed(2);

  const handleReset = () => {
    setLeg1Start(5010.00);
    setLeg1High(5022.00);
    setPullbackLow(5016.00);
    setSteppedToTarget(false);
  };

  // SVG Geometry mappings
  const minP = 5006.00;
  const maxP = 5032.00;
  const svgH = 220;
  const getY = (p) => svgH - 20 - ((p - minP) / (maxP - minP)) * (svgH - 40);

  const yLeg1Start = getY(leg1Start);
  const yLeg1High = getY(leg1High);
  const yPBLow = getY(pullbackLow);
  const yTarget = getY(measuredTarget);

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
              Measured Move Ruler (Leg 1 = Leg 2 Projection Caliper)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculate algorithmic take-profit targets: project the exact height of Leg 1 from the pullback low.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          PTZ Target: <span className="text-amber-400 font-bold">{measuredTarget.toFixed(2)}</span>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Examine <strong className="text-blue-400">Leg 1</strong> (5010.00 to 5022.00 = 12.00 pts) and its corrective pullback to 5016.00.</li>
          <li>Adjust the sliders on the right to change the size of Leg 1 or the depth of the pullback.</li>
          <li>Notice how the gold <strong className="text-amber-400">Profit-Taking Zone (PTZ)</strong> caliper dynamically moves: <span className="font-mono text-slate-200">5016.00 + 12.00 = 5028.00</span>.</li>
          <li>Click <strong className="text-emerald-400">Simulate Bar Steps to Target ➔</strong> to watch algorithms lock in profits at the measured move target.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK & MEASURED MOVE CANVAS */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Algorithmic Projection Canvas
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 320 220">
            {/* Price Grid */}
            {[5010, 5015, 5020, 5025, 5030].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="305" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="310" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Target Price Line (Gold PTZ) */}
            {showProjection && (
              <g className="animate-fadeIn">
                <line x1="15" y1={yTarget} x2="305" y2={yTarget} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                <rect x="180" y={yTarget - 9} width="120" height="18" fill="#78350f" opacity="0.8" rx="3" />
                <text x="240" y={yTarget + 3} fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  PTZ: {measuredTarget.toFixed(2)} (Leg 1 = 2)
                </text>
              </g>
            )}

            {/* Leg 1 Ray */}
            <line x1="45" y1={yLeg1Start} x2="95" y2={yLeg1High} stroke="#38bdf8" strokeWidth="3" />
            {/* Caliper Bracket for Leg 1 */}
            <line x1="28" y1={yLeg1Start} x2="36" y2={yLeg1Start} stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="32" y1={yLeg1Start} x2="32" y2={yLeg1High} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="28" y1={yLeg1High} x2="36" y2={yLeg1High} stroke="#38bdf8" strokeWidth="1.5" />
            <text x="24" y={(yLeg1Start + yLeg1High) / 2 + 3} fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="end">
              Leg 1: {leg1Points}p
            </text>

            {/* Pullback Ray */}
            <line x1="95" y1={yLeg1High} x2="135" y2={yPBLow} stroke="#f43f5e" strokeWidth="2.5" />

            {/* Leg 2 Ray */}
            <line
              x1="135"
              y1={yPBLow}
              x2={steppedToTarget ? "220" : "175"}
              y2={steppedToTarget ? yTarget : getY((pullbackLow + measuredTarget) / 2)}
              stroke="#10b981"
              strokeWidth="3"
            />

            {/* Caliper Bracket for Leg 2 Target */}
            {showProjection && (
              <g>
                <line x1="145" y1={yPBLow} x2="153" y2={yPBLow} stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="149" y1={yPBLow} x2="149" y2={yTarget} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="145" y1={yTarget} x2="153" y2={yTarget} stroke="#f59e0b" strokeWidth="1.5" />
                <text x="156" y={(yPBLow + yTarget) / 2 + 3} fill="#f59e0b" fontSize="8" fontFamily="monospace">
                  Leg 2: +{leg1Points}p
                </text>
              </g>
            )}

            {/* Candlesticks overlay */}
            {/* Leg 1 Bars */}
            <rect x="40" y={getY(5015)} width="10" height={getY(5010) - getY(5015)} fill="#065f46" stroke="#10b981" strokeWidth="1" rx="1" />
            <rect x="58" y={getY(5018)} width="10" height={getY(5014) - getY(5018)} fill="#065f46" stroke="#10b981" strokeWidth="1" rx="1" />
            <rect x="76" y={getY(5022)} width="10" height={getY(5017) - getY(5022)} fill="#065f46" stroke="#10b981" strokeWidth="1" rx="1" />
            {/* Pullback Bars */}
            <rect x="98" y={getY(5021)} width="10" height={getY(5018) - getY(5021)} fill="#881337" stroke="#f43f5e" strokeWidth="1" rx="1" />
            <rect x="116" y={getY(5019)} width="10" height={getY(5016) - getY(5019)} fill="#881337" stroke="#f43f5e" strokeWidth="1" rx="1" />
            
            {/* Resumption Bars */}
            {steppedToTarget && (
              <g className="animate-fadeIn">
                <rect x="140" y={getY(5020)} width="10" height={getY(5016) - getY(5020)} fill="#065f46" stroke="#10b981" strokeWidth="1" rx="1" />
                <rect x="160" y={getY(5024)} width="10" height={getY(5019) - getY(5024)} fill="#065f46" stroke="#10b981" strokeWidth="1" rx="1" />
                <rect x="180" y={getY(5027)} width="10" height={getY(5023) - getY(5027)} fill="#065f46" stroke="#10b981" strokeWidth="1" rx="1" />
                <rect x="200" y={yTarget} width="12" height={getY(5025) - yTarget} fill="#065f46" stroke="#10b981" strokeWidth="1.5" rx="1" />
                <circle cx="206" cy={yTarget} r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
              </g>
            )}

            {/* Labels */}
            <text x="70" y={svgH - 5} fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Leg 1</text>
            <text x="115" y={svgH - 5} fill="#f43f5e" fontSize="8" fontFamily="monospace" textAnchor="middle">Pullback</text>
            <text x="180" y={svgH - 5} fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">Leg 2 Resumption</text>
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Leg 1 Range: <strong className="text-blue-400">{leg1Points.toFixed(2)} pts</strong></span>
            <span>Target Reached: <strong className={steppedToTarget ? 'text-emerald-400' : 'text-slate-500'}>{steppedToTarget ? 'YES (100% MM FILLED)' : 'PROJECTED'}</strong></span>
          </div>
        </div>

        {/* RIGHT: CALIPER CONTROLS & RULES */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            {/* Live Sliders */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Caliper Anchor Parameters
              </span>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Leg 1 High</span>
                  <span className="text-blue-400 font-bold">{leg1High.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="5018" max="5025" step="0.5" value={leg1High}
                  onChange={(e) => {
                    setLeg1High(parseFloat(e.target.value));
                    setSteppedToTarget(false);
                  }}
                  className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Pullback Low</span>
                  <span className="text-rose-400 font-bold">{pullbackLow.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="5012" max="5018" step="0.5" value={pullbackLow}
                  onChange={(e) => {
                    setPullbackLow(parseFloat(e.target.value));
                    setSteppedToTarget(false);
                  }}
                  className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Equation:</span>
                <span className="text-amber-400 font-bold">
                  {pullbackLow.toFixed(2)} + {leg1Points.toFixed(2)} = {measuredTarget.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-950/30 border-l-4 border-blue-500 rounded-r text-xs text-slate-300 leading-relaxed">
              <strong className="text-blue-400 block mb-0.5 uppercase font-mono text-[10px]">Al Brooks Principle:</strong>
              "When Leg 2 equals Leg 1, institutions that bought early take profits with limit orders, while aggressive countertrend traders sell short. Expect a pause or pullback almost every time."
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <button
              onClick={() => setSteppedToTarget(true)}
              disabled={steppedToTarget}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-mono font-bold transition-colors shadow-md"
            >
              Simulate Bar Steps to Target ➔
            </button>

            <div className="flex justify-between items-center text-xs font-mono pt-1">
              <button
                onClick={() => setShowProjection(!showProjection)}
                className="text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
              >
                {showProjection ? 'Hide Caliper' : 'Show Caliper'}
              </button>
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-300 transition-colors text-[11px]"
              >
                ↺ Reset Anchors
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
