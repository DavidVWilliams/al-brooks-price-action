// Version: v1.0 - Tier 4.4 Double Top/Bottom Pullback Simulator
import { useState, useMemo } from 'react';

export default function DoubleTopBottomPullbackLab() {
  const [patternType, setPatternType] = useState('double_bottom'); // 'double_bottom' | 'double_top'
  const [secondTestOffset, setSecondTestOffset] = useState(0); // -2 (lower low), 0 (exact), +2 (higher low)
  const [pullbackHolding, setPullbackHolding] = useState(true);

  const evaluation = useMemo(() => {
    const isDB = patternType === 'double_bottom';
    if (isDB) {
      if (secondTestOffset > 0 && pullbackHolding) {
        return {
          grade: 'A+',
          winRate: 0.65,
          setupName: 'Double Bottom Higher Low Bull Flag',
          advice: 'Aggressive institutional buying before the prior low confirms strong bulls. Enter on stop 1 tick above the pullback signal bar.'
        };
      }
      if (secondTestOffset < 0 && pullbackHolding) {
        return {
          grade: 'A-',
          winRate: 0.60,
          setupName: 'Double Bottom Lower Low Trap',
          advice: 'False breakout below the prior low trapped bears. Breakout pullback holding confirms long entry.'
        };
      }
    } else {
      if (secondTestOffset < 0 && pullbackHolding) {
        return {
          grade: 'A+',
          winRate: 0.65,
          setupName: 'Double Top Lower High Bear Flag',
          advice: 'Bears asserted control below prior high. Enter short on stop 1 tick below pullback bar.'
        };
      }
    }
    return {
      grade: 'B',
      winRate: 0.50,
      setupName: 'Standard Test & Pullback',
      advice: 'Clean test of prior extreme. Wait for entry bar confirmation.'
    };
  }, [patternType, secondTestOffset, pullbackHolding]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-900/60">
            Interactive Capstone Lab 4.4
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Double Top / Bottom Pullback Scanner
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border bg-emerald-950/60 border-emerald-500 text-emerald-300">
          Grade {evaluation.grade} ({(evaluation.winRate * 100).toFixed(0)}% Win Rate)
        </span>
      </div>

      {/* SVG CANVAS */}
      <div className="w-full h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <svg className="w-full h-full max-h-48" viewBox="0 0 460 180" fill="none">
          {patternType === 'double_bottom' ? (
            <g>
              {/* Neckline */}
              <line x1="40" y1="50" x2="420" y2="50" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="360" y="45" fill="#f59e0b" fontSize="9" fontFamily="monospace">Neckline (Resistance)</text>

              {/* Push 1 Down */}
              <path d="M 50 40 L 100 130" stroke="#f43f5e" strokeWidth="3" />
              <text x="95" y="145" fill="#94a3b8" fontSize="9" fontFamily="monospace">Low 1</text>

              {/* Bounce to Neckline */}
              <path d="M 100 130 L 180 50" stroke="#3b82f6" strokeWidth="2.5" />

              {/* Push 2 Down */}
              <path d={`M 180 50 L 260 ${130 - secondTestOffset * 10}`} stroke="#f43f5e" strokeWidth="3" />
              <text x="255" y={145 - secondTestOffset * 10} fill="#38bdf8" fontSize="9" fontFamily="monospace">
                Low 2 ({secondTestOffset > 0 ? 'Higher Low' : secondTestOffset < 0 ? 'Lower Low' : 'Equal'})
              </text>

              {/* Breakout & Pullback */}
              <path d={`M 260 ${130 - secondTestOffset * 10} L 330 35`} stroke="#10b981" strokeWidth="3" />
              {pullbackHolding && (
                <g>
                  <path d="M 330 35 L 365 52 L 410 15" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
                  <circle cx="365" cy="52" r="4" fill="#10b981" />
                  <text x="375" y="65" fill="#10b981" fontSize="9" fontFamily="monospace">Breakout Pullback (Holds Neckline)</text>
                </g>
              )}
            </g>
          ) : (
            <g>
              {/* Neckline */}
              <line x1="40" y1="120" x2="420" y2="120" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="360" y="135" fill="#f59e0b" fontSize="9" fontFamily="monospace">Neckline (Support)</text>

              {/* Push 1 Up */}
              <path d="M 50 130 L 100 40" stroke="#3b82f6" strokeWidth="3" />
              <text x="95" y="30" fill="#94a3b8" fontSize="9" fontFamily="monospace">Top 1</text>

              {/* Pullback to Neckline */}
              <path d="M 100 40 L 180 120" stroke="#f43f5e" strokeWidth="2.5" />

              {/* Push 2 Up */}
              <path d={`M 180 120 L 260 ${40 + secondTestOffset * 10}`} stroke="#3b82f6" strokeWidth="3" />
              <text x="255" y={30 + secondTestOffset * 10} fill="#38bdf8" fontSize="9" fontFamily="monospace">
                Top 2 ({secondTestOffset < 0 ? 'Lower High' : secondTestOffset > 0 ? 'Higher High' : 'Equal'})
              </text>

              {/* Breakout Below Neckline & Pullback */}
              <path d={`M 260 ${40 + secondTestOffset * 10} L 330 135`} stroke="#f43f5e" strokeWidth="3" />
              {pullbackHolding && (
                <g>
                  <path d="M 330 135 L 365 118 L 410 155" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
                  <circle cx="365" cy="118" r="4" fill="#f43f5e" />
                  <text x="375" y="112" fill="#f43f5e" fontSize="9" fontFamily="monospace">Breakout Pullback (Fails Neckline)</text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Structure Type:</label>
          <div className="flex gap-2">
            {[
              { id: 'double_bottom', label: 'Double Bottom' },
              { id: 'double_top', label: 'Double Top' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPatternType(p.id)}
                className={`flex-1 py-1.5 rounded border transition-all ${
                  patternType === p.id
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Second Test Extremes:</label>
          <div className="flex gap-1">
            {[
              { val: 1, label: patternType === 'double_bottom' ? 'Higher Low' : 'Higher High' },
              { val: 0, label: 'Equal Extreme' },
              { val: -1, label: patternType === 'double_bottom' ? 'Lower Low' : 'Lower High' },
            ].map((o) => (
              <button
                key={o.val}
                onClick={() => setSecondTestOffset(o.val)}
                className={`flex-1 py-1.5 px-1 rounded border text-[11px] transition-all ${
                  secondTestOffset === o.val
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Breakout Pullback Status:</label>
          <button
            onClick={() => setPullbackHolding(!pullbackHolding)}
            className={`w-full py-1.5 rounded border font-semibold transition-all ${
              pullbackHolding
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}
          >
            {pullbackHolding ? 'Pullback Holds Neckline' : 'Breakout Aborted'}
          </button>
        </div>
      </div>

      {/* FEEDBACK */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono font-bold text-amber-400">
            Setup Pattern:
          </span>
          <span className="text-xs text-slate-300 font-mono font-bold">{evaluation.setupName}</span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/60">
          👉 {evaluation.advice}
        </p>
      </div>
    </div>
  );
}
