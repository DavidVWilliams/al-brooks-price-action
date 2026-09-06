// Version: v1.0 - Tier 1 Market State Classifier & Order Style Matrix
// Changelog:
// - v1.0: Interactive toggle between Trend and Trading Range environments to demonstrate institutional order mechanics.

import { useState } from 'react';

const TREND_BARS = [
  { id: 1, open: 5010.0, high: 5014.0, low: 5009.5, close: 5013.5, type: 'bull' },
  { id: 2, open: 5013.5, high: 5018.0, low: 5013.0, close: 5017.5, type: 'bull' },
  { id: 3, open: 5017.5, high: 5022.0, low: 5016.75, close: 5021.25, type: 'bull' },
  { id: 4, open: 5021.25, high: 5025.5, low: 5020.5, close: 5024.75, type: 'bull' },
  { id: 5, open: 5024.75, high: 5028.0, low: 5024.0, close: 5027.5, type: 'bull' },
];

const RANGE_BARS = [
  { id: 1, open: 5018.0, high: 5024.0, low: 5017.0, close: 5023.0, type: 'bull' },
  { id: 2, open: 5023.0, high: 5024.5, low: 5016.5, close: 5017.5, type: 'bear' },
  { id: 3, open: 5017.5, high: 5022.0, low: 5016.0, close: 5021.0, type: 'bull' },
  { id: 4, open: 5021.0, high: 5023.0, low: 5015.5, close: 5016.5, type: 'bear' },
  { id: 5, open: 5016.5, high: 5022.5, low: 5016.0, close: 5020.0, type: 'bull' },
];

export default function MarketStateClassifier() {
  const [selectedState, setSelectedState] = useState('trend'); // 'trend' or 'range'

  const bars = selectedState === 'trend' ? TREND_BARS : RANGE_BARS;

  // Geometry
  const minP = 5008.0;
  const maxP = 5030.0;
  const svgH = 220;
  const getY = (p) => svgH - 20 - ((p - minP) / (maxP - minP)) * (svgH - 40);

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
              Market State Matrix: Trend vs. Trading Range
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle between market regimes to inspect how institutional order types flip from stop momentum to limit BLSHS.
          </p>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Toggle between <strong className="text-blue-400">Trend Regime</strong> and <strong className="text-amber-400">Trading Range Regime</strong>.</li>
          <li>Notice the visual footprint: Trend bars have large bodies and small wicks; ranges feature alternating colors, deep overlaps, and long tails.</li>
          <li><strong>Takeaway:</strong> Using breakout stop orders inside trading ranges leads to instant failure. Range regimes require fading extremes with limit orders.</li>
        </ol>
      </div>

      {/* TOGGLE SELECTOR */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedState('trend')}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedState === 'trend'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📈 Trend State (30–40% Frequency)
          </button>
          <button
            onClick={() => setSelectedState('range')}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedState === 'range'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚖️ Trading Range State (60–70% Frequency)
          </button>
        </div>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-6 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {selectedState === 'trend' ? 'Trend Structure (Displacement)' : 'Trading Range Structure (Equilibrium)'}
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 280 220">
            {/* Grid Lines */}
            {[5010, 5015, 5020, 5025].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="265" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="270" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Range Boundaries in Range Mode */}
            {selectedState === 'range' && (
              <>
                <line x1="20" y1={getY(5024)} x2="260" y2={getY(5024)} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="25" y={getY(5024) - 4} fill="#f43f5e" fontSize="8" fontFamily="monospace">Sell High (Resistance: 5024)</text>

                <line x1="20" y1={getY(5016)} x2="260" y2={getY(5016)} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="25" y={getY(5016) + 12} fill="#10b981" fontSize="8" fontFamily="monospace">Buy Low (Support: 5016)</text>
              </>
            )}

            {/* Bars */}
            {bars.map((b, i) => {
              const x = 45 + i * 45;
              const isBull = b.type === 'bull';
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));

              return (
                <g key={b.id}>
                  {/* Wick */}
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke={isBull ? '#10b981' : '#f43f5e'} strokeWidth="2" />
                  {/* Body */}
                  <rect
                    x={x - 14}
                    y={bodyTop}
                    width="28"
                    height={bodyH}
                    fill={isBull ? '#065f46' : '#881337'}
                    stroke={isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                    rx="1.5"
                  />
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Dominant Order Type: <strong className={selectedState === 'trend' ? 'text-blue-400' : 'text-amber-400'}>{selectedState === 'trend' ? 'Stop Orders (Urgency)' : 'Limit Orders (Fade)'}</strong></span>
            <span>Follow-Through: <strong className={selectedState === 'trend' ? 'text-emerald-400' : 'text-rose-400'}>{selectedState === 'trend' ? 'High (~80%)' : 'Poor (~20%)'}</strong></span>
          </div>
        </div>

        {/* RIGHT: INSTITUTIONAL PROTOCOL MATRIX */}
        <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
              selectedState === 'trend' ? 'bg-blue-950/30 border-blue-900/60' : 'bg-amber-950/30 border-amber-900/60'
            }`}>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                selectedState === 'trend' ? 'text-blue-400' : 'text-amber-400'
              }`}>
                {selectedState === 'trend' ? 'Institutional Trend Playbook' : 'Institutional BLSHS Protocol'}
              </span>
              <h4 className="text-lg font-bold text-white">
                {selectedState === 'trend' ? 'Momentum Aggression & With-Trend Stops' : 'Buy Low, Sell High, Scalp (BLSHS)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedState === 'trend'
                  ? 'In a trend, the market is imbalanced. Institutions buy at market, buy breakouts of prior highs on stop orders, and hold for swing multiples. Countertrend trades are strictly prohibited.'
                  : 'In a range, the market is in two-sided equilibrium. Breakouts fail 80% of the time. Smart money fades all pushes beyond the boundaries using passive limit orders, scalping quick profits.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Entry Style</span>
                <strong className={selectedState === 'trend' ? 'text-blue-400' : 'text-amber-400'}>
                  {selectedState === 'trend' ? 'Stop / Market Orders' : 'Limit Orders (Fade)'}
                </strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Target Objective</span>
                <strong className="text-white">
                  {selectedState === 'trend' ? 'Measured Swing (2x+)' : 'Scalp to Midpoint (1x)'}
                </strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400 block mb-1 uppercase font-mono text-[10px]">Al Brooks Rule of Thumb:</strong>
            {selectedState === 'trend'
              ? '"Assume every pullback will fail and the trend will resume. Do not exit unless there is a confirmed major trend reversal."'
              : '"Assume every breakout attempt will fail and reverse. Buy below bars near the bottom, sell above bars near the top, and scalp."'}
          </div>

        </div>

      </div>
    </div>
  );
}
