// Version: v1.0 - Tier 4.1 Major Trend Reversal (MTR) Interactive Sandbox
import { useState, useMemo } from 'react';
import { evaluateMTRStructure } from '../../utils/mtrEvaluator.js';

export default function MTRStructureMapper() {
  const [priorTrendStrength, setPriorTrendStrength] = useState('channel'); // 'micro_channel' | 'channel' | 'range'
  const [trendlineBroken, setTrendlineBroken] = useState(true);
  const [breakoutMomentumBars, setBreakoutMomentumBars] = useState(2);
  const [retestType, setRetestType] = useState('lower_high'); // 'lower_high' | 'higher_high' | 'double_top'
  const [signalBarQuality, setSignalBarQuality] = useState('strong_bear'); // 'strong_bear' | 'weak_doji' | 'bull_body'

  const evaluation = useMemo(() => {
    return evaluateMTRStructure({
      trendlineBroken,
      breakoutMomentumBars,
      retestType,
      signalBarQuality,
      priorTrendStrength,
    });
  }, [trendlineBroken, breakoutMomentumBars, retestType, signalBarQuality, priorTrendStrength]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-900/60">
            Interactive Capstone Lab 4.1
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Major Trend Reversal (MTR) Structure Mapper
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Grade:</span>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              evaluation.isValidMTR
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500 text-rose-300'
            }`}
          >
            {evaluation.grade} ({(evaluation.winRate * 100).toFixed(0)}% Win Rate)
          </span>
        </div>
      </div>

      {/* SVG PREVIEW CANVAS */}
      <div className="w-full h-52 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <svg className="w-full h-full max-h-44" viewBox="0 0 460 160" fill="none">
          {/* Prior Trend Line */}
          <line
            x1="30"
            y1="130"
            x2="210"
            y2="30"
            stroke={trendlineBroken ? '#38bdf8' : '#64748b'}
            strokeWidth="2"
            strokeDasharray={trendlineBroken ? '4 4' : '0'}
          />
          <text x="70" y="110" fill="#64748b" fontSize="9" fontFamily="monospace">
            Dominant Bull Trendline
          </text>

          {/* Leg 1: Bull Trend Bars */}
          <rect x="50" y="95" width="12" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="80" y="70" width="12" height="40" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="110" y="50" width="12" height="38" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <rect x="140" y="25" width="14" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="147" y="15" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            Trend High
          </text>

          {/* Step 1: Trendline Break Swing */}
          {trendlineBroken ? (
            <g>
              <line x1="154" y1="50" x2="220" y2="105" stroke="#f43f5e" strokeWidth="2" />
              <rect x="175" y="60" width="12" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
              {breakoutMomentumBars >= 2 && (
                <rect x="195" y="80" width="12" height="32" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" />
              )}
              <text x="210" y="125" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                1. TL Break ({breakoutMomentumBars} Bars)
              </text>
            </g>
          ) : (
            <text x="210" y="110" fill="#64748b" fontSize="9" fontFamily="monospace">
              [No Break]
            </text>
          )}

          {/* Step 2: Retest Leg */}
          {trendlineBroken && (
            <g>
              {retestType === 'lower_high' && (
                <g>
                  <line x1="220" y1="105" x2="290" y2="45" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect x="250" y="75" width="12" height="25" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                  <text x="310" y="40" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                    2. Lower High Retest
                  </text>
                </g>
              )}

              {retestType === 'higher_high' && (
                <g>
                  <line x1="220" y1="105" x2="295" y2="18" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect x="255" y="65" width="12" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                  <text x="305" y="15" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                    2. Higher High Trap
                  </text>
                </g>
              )}

              {retestType === 'double_top' && (
                <g>
                  <line x1="220" y1="105" x2="290" y2="25" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <line x1="140" y1="25" x2="290" y2="25" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="305" y="22" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                    2. Double Top
                  </text>
                </g>
              )}

              {/* Step 3: Signal Bar */}
              <g transform="translate(320, 30)">
                {signalBarQuality === 'strong_bear' && (
                  <g>
                    <line x1="10" y1="0" x2="10" y2="55" stroke="#f43f5e" strokeWidth="1.5" />
                    <rect x="2" y="10" width="16" height="40" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
                    <line x1="-15" y1="52" x2="35" y2="52" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="40" y="55" fill="#38bdf8" fontSize="8" fontFamily="monospace">Sell Stop (-1 Tick)</text>
                    <text x="10" y="72" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      3. Bear Signal Bar
                    </text>
                  </g>
                )}

                {signalBarQuality === 'weak_doji' && (
                  <g>
                    <line x1="10" y1="0" x2="10" y2="50" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x="2" y="23" width="16" height="4" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="10" y="68" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      3. Doji (Indecisive)
                    </text>
                  </g>
                )}

                {signalBarQuality === 'bull_body' && (
                  <g>
                    <line x1="10" y1="0" x2="10" y2="50" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x="2" y="8" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="10" y="68" fill="#3b82f6" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      3. Bull Bar (No Signal)
                    </text>
                  </g>
                )}
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
        {/* Prior Trend Strength */}
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">Prior Trend Regime:</label>
          <div className="flex gap-1.5">
            {[
              { id: 'channel', label: 'Broad Channel' },
              { id: 'micro_channel', label: 'Micro Channel' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPriorTrendStrength(t.id)}
                className={`flex-1 py-1.5 px-2 rounded border transition-all ${
                  priorTrendStrength === t.id
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trendline Break & Momentum */}
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-slate-400 font-semibold">1. Trendline Break:</label>
            <button
              onClick={() => setTrendlineBroken(!trendlineBroken)}
              className={`px-2 py-0.5 rounded text-[10px] border ${
                trendlineBroken
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950 border-rose-500 text-rose-300'
              }`}
            >
              {trendlineBroken ? 'Broken' : 'Intact'}
            </button>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-slate-500">Displacement:</span>
            <input
              type="range"
              min="0"
              max="4"
              value={breakoutMomentumBars}
              disabled={!trendlineBroken}
              onChange={(e) => setBreakoutMomentumBars(Number(e.target.value))}
              className="flex-1 accent-blue-500 disabled:opacity-30"
            />
            <span className="text-blue-400 w-12 text-right">{breakoutMomentumBars} bars</span>
          </div>
        </div>

        {/* Retest Leg Type */}
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <label className="text-slate-400 font-semibold block">2. Retest Geometry:</label>
          <select
            value={retestType}
            disabled={!trendlineBroken}
            onChange={(e) => setRetestType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-30"
          >
            <option value="lower_high">Lower High (Preferred)</option>
            <option value="higher_high">Higher High (Sweep Trap)</option>
            <option value="double_top">Double Top (Equal Extreme)</option>
          </select>
        </div>

        {/* Signal Bar Quality */}
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2 md:col-span-2 lg:col-span-3">
          <label className="text-slate-400 font-semibold block">3. Signal Bar Anatomy:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'strong_bear', label: 'Strong Bear Body (Top 20% Close)', note: 'A+ Setup' },
              { id: 'weak_doji', label: 'Doji / Neutral Body', note: 'Wait for Low 2' },
              { id: 'bull_body', label: 'Bull Close Against Reversal', note: 'Untradable' },
            ].map((s) => (
              <button
                key={s.id}
                disabled={!trendlineBroken}
                onClick={() => setSignalBarQuality(s.id)}
                className={`py-2 px-3 rounded border text-left transition-all flex flex-col gap-0.5 disabled:opacity-30 ${
                  signalBarQuality === s.id
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{s.label}</span>
                <span className="text-[10px] text-slate-500">{s.note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EVALUATION FEEDBACK CARD */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono font-bold text-amber-400">
            Brooksian Execution Directive:
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {evaluation.reason}
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/60">
          👉 {evaluation.actionableAdvice}
        </p>
      </div>
    </div>
  );
}
