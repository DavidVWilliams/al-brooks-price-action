// Version: v1.1 - Tier 4.2 Climax Overshoot Lab with Explicit Lab Exercise Guidance
import { useState, useMemo } from 'react';

export default function ClimaxTCLOvershootLab() {
  const [consecutiveBars, setConsecutiveBars] = useState(4);
  const [overshootTicks, setOvershootTicks] = useState(6);
  const [reversalBarClose, setReversalBarClose] = useState('bottom_20');

  const evaluation = useMemo(() => {
    const isExhaustion = consecutiveBars >= 3 && overshootTicks >= 4;
    const hasStrongRejection = reversalBarClose === 'bottom_20';

    if (isExhaustion && hasStrongRejection) {
      return {
        grade: 'A+',
        winRate: 0.65,
        type: 'Exhaustion Climax Reversal',
        advice: 'TCL overshoot of 4+ ticks followed by a bottom 20% close confirms institutional profit-taking. Place sell stop 1 tick below reversal bar.'
      };
    }
    if (overshootTicks === 0) {
      return {
        grade: 'C',
        winRate: 0.35,
        type: 'Channel Containment',
        advice: 'Price has not penetrated the trend channel line. Fading without an overshoot climax is low probability.'
      };
    }
    if (reversalBarClose !== 'bottom_20') {
      return {
        grade: 'B-',
        winRate: 0.45,
        type: 'Incomplete Rejection',
        advice: 'TCL overshot, but the bar failed to close in its bottom 20%. Wait for an entry bar or a second reversal attempt.'
      };
    }
    return {
      grade: 'B',
      winRate: 0.50,
      type: 'Minor Climax',
      advice: 'Moderate climax. Expect at least a 2-legged sideways-to-down correction to the moving average.'
    };
  }, [consecutiveBars, overshootTicks, reversalBarClose]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl text-slate-100">
      
      {/* HEADER & GRADE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-900/60">
            Interactive Capstone Lab 4.2
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Exhaustion Climax & TCL Overshoot Simulator
          </h3>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border self-start md:self-auto ${
          evaluation.winRate >= 0.60
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
            : 'bg-amber-950/60 border-amber-500 text-amber-300'
        }`}>
          Grade {evaluation.grade} ({(evaluation.winRate * 100).toFixed(0)}% Win Rate)
        </span>
      </div>

      {/* EXPLICIT LAB EXERCISE INSTRUCTIONS CARD */}
      <div className="p-4 bg-blue-950/20 border border-blue-900/50 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
          <span>🧪</span> Lab Exercise: Quantifying Buy Climax Exhaustion
        </div>
        <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed font-sans">
          <li><strong>Step 1 (Accelerate the Trend):</strong> Increase &ldquo;Consecutive Climax Bars&rdquo; to 4 or 5. Notice how expanding bar ranges indicate an unsustainable vacuum move rather than measured buying.</li>
          <li><strong>Step 2 (The Overshoot):</strong> Slide &ldquo;TCL Overshoot Distance&rdquo; from 0 to 8 ticks. A 4+ tick overshoot signals that buyers are paying desperate market order prices outside the channel boundary.</li>
          <li><strong>Step 3 (Reversal Bar Verdict):</strong> Change the Reversal Bar Close from &ldquo;Top 20%&rdquo; (blow-off acceleration) to &ldquo;Bottom 20%&rdquo; (climax rejection). Observe how the grade surges to A+ with a 65% expectancy for a 2-legged correction.</li>
        </ol>
      </div>

      {/* SVG CANVAS */}
      <div className="w-full h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <svg className="w-full h-full max-h-48" viewBox="0 0 460 180" fill="none">
          <line x1="40" y1="140" x2="380" y2="70" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="50" y="155" fill="#3b82f6" fontSize="9" fontFamily="monospace">Trend Line</text>

          <line x1="80" y1="90" x2="420" y2="20" stroke="#f59e0b" strokeWidth="2" />
          <text x="360" y="20" fill="#f59e0b" fontSize="9" fontFamily="monospace">TCL (Resistance)</text>

          <rect x="70" y="110" width="10" height="25" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="110" y="85" width="10" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="150" y="95" width="10" height="20" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
          <rect x="190" y="75" width="10" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />

          {consecutiveBars >= 1 && <rect x="230" y="60" width="12" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />}
          {consecutiveBars >= 2 && <rect x="255" y="45" width="14" height="42" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />}
          {consecutiveBars >= 3 && <rect x="285" y="28" width="16" height="50" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />}
          {consecutiveBars >= 4 && <rect x="320" y="15" width="18" height="58" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />}

          {overshootTicks > 0 && (
            <g transform={`translate(360, ${15 - overshootTicks * 2.5})`}>
              <line x1="10" y1="0" x2="10" y2="70" stroke="#ec4899" strokeWidth="1.5" />
              {reversalBarClose === 'bottom_20' && (
                <rect x="2" y="45" width="16" height="20" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
              )}
              {reversalBarClose === 'midpoint' && (
                <rect x="2" y="25" width="16" height="20" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" rx="1" />
              )}
              {reversalBarClose === 'top_20' && (
                <rect x="2" y="5" width="16" height="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
              )}
              <line x1="-15" y1="20" x2="35" y2="20" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
              <text x="38" y="23" fill="#f43f5e" fontSize="8" fontFamily="monospace">+{overshootTicks}t Overshoot</text>
            </g>
          )}
        </svg>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Consecutive Climax Bars:</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="5"
              value={consecutiveBars}
              onChange={(e) => setConsecutiveBars(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="text-blue-400 font-bold w-12 text-right">{consecutiveBars} bars</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">TCL Overshoot Distance:</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="12"
              value={overshootTicks}
              onChange={(e) => setOvershootTicks(Number(e.target.value))}
              className="flex-1 accent-pink-500"
            />
            <span className="text-pink-400 font-bold w-12 text-right">+{overshootTicks} ticks</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Reversal Bar Closing Extreme:</label>
          <select
            value={reversalBarClose}
            onChange={(e) => setReversalBarClose(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="bottom_20">Bottom 20% (A+ Bear Rejection)</option>
            <option value="midpoint">Midpoint 50% (Doji Equilibrium)</option>
            <option value="top_20">Top 20% (Continuation / No Rejection)</option>
          </select>
        </div>
      </div>

      {/* FEEDBACK */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono font-bold text-amber-400">
            Institutional Takeaway:
          </span>
          <span className="text-xs text-slate-300 font-mono font-semibold">{evaluation.type}</span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/60">
          👉 {evaluation.advice}
        </p>
      </div>
    </div>
  );
}
