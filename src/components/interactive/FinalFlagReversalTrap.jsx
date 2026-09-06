// Version: v1.1 - Tier 4.3 Final Flag Lab with Explicit Lab Exercise Guidance
import { useState, useMemo } from 'react';

export default function FinalFlagReversalTrap() {
  const [trendBarsCount, setTrendBarsCount] = useState(16);
  const [breakoutQuality, setBreakoutQuality] = useState('exhaustion');

  const evaluation = useMemo(() => {
    const isLateInTrend = trendBarsCount >= 12;
    const isFailedBreakout = breakoutQuality === 'exhaustion';

    if (isLateInTrend && isFailedBreakout) {
      return {
        grade: 'A+',
        reversalProbability: 0.70,
        verdict: 'Textbook Final Flag Failure',
        advice: 'A horizontal flag after 15+ bars of trend is usually the Final Flag. The breakout will fail within 1-3 bars and magnetically retest the bottom of the flag.'
      };
    }
    if (!isLateInTrend) {
      return {
        grade: 'B-',
        reversalProbability: 0.40,
        verdict: 'Early Trend Continuation Flag',
        advice: 'Only 5-10 bars into the trend. This flag is likely a continuation pattern, not the final flag. Fading the breakout is low probability.'
      };
    }
    return {
      grade: 'C',
      reversalProbability: 0.30,
      verdict: 'Valid Trend Resumption',
      advice: 'Breakout printed consecutive trend bars with strong follow-through. The trend has successfully re-accelerated.'
    };
  }, [trendBarsCount, breakoutQuality]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl text-slate-100">
      
      {/* HEADER & GRADE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-900/60">
            Interactive Capstone Lab 4.3
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Final Flag Failure & Retest Engine
          </h3>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border self-start md:self-auto ${
          evaluation.reversalProbability >= 0.60
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
            : 'bg-rose-950/60 border-rose-500 text-rose-300'
        }`}>
          {evaluation.verdict} ({(evaluation.reversalProbability * 100).toFixed(0)}% Reversal Chance)
        </span>
      </div>

      {/* EXPLICIT LAB EXERCISE INSTRUCTIONS CARD */}
      <div className="p-4 bg-blue-950/20 border border-blue-900/50 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
          <span>🧪</span> Lab Exercise: Recognizing the Exhaustion Flag
        </div>
        <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed font-sans">
          <li><strong>Step 1 (Trend Duration Context):</strong> Compare a trend maturity of 6 bars vs. 18 bars. In early trends, flags are buying opportunities; in late trends (15+ bars), flags become exhaustion structures.</li>
          <li><strong>Step 2 (The Trap Trigger):</strong> Set breakout behavior to &ldquo;1-Bar Trap &amp; Reversal&rdquo;. Watch how the upside breakout immediately sucks in late breakout buyers before trapping them with a swift bear reversal.</li>
          <li><strong>Step 3 (The Magnet Retest):</strong> Inspect the red dashed projection arrow. Notice how failed final flags magnetically pull price back to the bottom of the flag within 5 to 10 bars.</li>
        </ol>
      </div>

      {/* SVG CANVAS */}
      <div className="w-full h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <svg className="w-full h-full max-h-48" viewBox="0 0 460 180" fill="none">
          <line x1="30" y1="150" x2="180" y2="70" stroke="#3b82f6" strokeWidth="3" />
          <text x="60" y="110" fill="#94a3b8" fontSize="9" fontFamily="monospace">Extended Trend ({trendBarsCount} Bars)</text>

          <rect x="190" y="55" width="90" height="35" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" rx="2" />
          <text x="235" y="75" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">Final Flag</text>

          <rect x="200" y="60" width="8" height="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="215" y="65" width="8" height="22" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
          <rect x="230" y="62" width="8" height="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="245" y="66" width="8" height="20" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />

          {breakoutQuality === 'exhaustion' ? (
            <g>
              <rect x="290" y="30" width="12" height="30" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="296" y="20" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Breakout Trap</text>
              <rect x="310" y="35" width="14" height="45" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
              <line x1="317" y1="25" x2="317" y2="85" stroke="#f43f5e" strokeWidth="1.5" />
              <path d="M 330 65 Q 360 85 360 115 L 235 115" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              <text x="365" y="118" fill="#ef4444" fontSize="9" fontFamily="monospace">Retest Magnet</text>
            </g>
          ) : (
            <g>
              <rect x="290" y="35" width="12" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="310" y="15" width="12" height="38" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="330" y="25" fill="#10b981" fontSize="9" fontFamily="monospace">Strong Follow-Through</text>
            </g>
          )}
        </svg>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Preceding Trend Maturity:</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="25"
              value={trendBarsCount}
              onChange={(e) => setTrendBarsCount(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="text-blue-400 font-bold w-14 text-right">{trendBarsCount} bars</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Late trend = 15+ bars without significant correction</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Flag Breakout Behavior:</label>
          <div className="flex gap-2">
            {[
              { id: 'exhaustion', label: '1-Bar Trap & Reversal' },
              { id: 'strong_followthrough', label: 'Multi-Bar Follow-Through' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBreakoutQuality(b.id)}
                className={`flex-1 py-2 px-2.5 rounded border transition-all ${
                  breakoutQuality === b.id
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAKEAWAY */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
        <span className="text-xs uppercase font-mono font-bold text-amber-400">
          Brooks Execution Directive:
        </span>
        <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/60">
          👉 {evaluation.advice}
        </p>
      </div>
    </div>
  );
}
