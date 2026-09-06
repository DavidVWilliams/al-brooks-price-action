// Version: v1.0 - Tier 1 Inside Bar Compression & Breakout Trap Sandbox
// Demonstrates volatility coiling and the 60% failure rate of range breakouts.

import { useState } from 'react';

export default function InsideBarCompressionLab() {
  const [compressionLevel, setCompressionLevel] = useState(1); // 1 = Mother Bar, 2 = Inside Bar (IB), 3 = II, 4 = III (Coiled Spring)
  const [testResult, setTestResult] = useState(null); // 'success', 'trap', null

  const handleReset = () => {
    setCompressionLevel(1);
    setTestResult(null);
  };

  const handleTestBreakout = () => {
    // Statistically, higher compression (II or III) in a trading range leads to traps/failures ~60-70% of the time.
    const isTrap = compressionLevel >= 2 ? Math.random() < 0.70 : Math.random() < 0.40;
    setTestResult(isTrap ? 'trap' : 'success');
  };

  // Dimensions for SVG rendering
  const svgH = 220;

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
              Inside Bar (IB, II, III) Volatility Coiling Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate volatility compression and test institutional breakout success versus retail trap rates.
          </p>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Click the <strong className="text-amber-400">Add Inside Bar (II / III)</strong> button to coil the spring. Notice how the price range shrinks.</li>
          <li>Click <strong className="text-blue-400">Test Breakout</strong> to execute a breakout trade out of the compression zone.</li>
          <li><strong>Takeaway:</strong> The deeper the compression (II or III), the more retail traders get trapped when the breakout reverses back into the range.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-5 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Compression Visualizer
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 260 220">
            {/* Grid Lines */}
            {[40, 80, 120, 160, 200].map((y) => (
              <line key={y} x1="20" y1={y} x2="240" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
            ))}

            {/* Mother Bar (Bar 1) */}
            <g opacity={compressionLevel >= 1 ? '1' : '0.2'}>
              <line x1="60" y1="30" x2="60" y2="190" stroke="#3b82f6" strokeWidth="2" />
              <rect x="45" y="50" width="30" height="120" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
              <text x="60" y="205" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">Mother (1)</text>
            </g>

            {/* Inside Bar 1 (Bar 2 - IB) */}
            {compressionLevel >= 2 && (
              <g className="animate-fadeIn">
                <line x1="120" y1="65" x2="120" y2="155" stroke="#f59e0b" strokeWidth="2" />
                <rect x="105" y="80" width="30" height="60" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                <text x="120" y="170" fill="#fbbf24" fontSize="8" fontFamily="monospace" textAnchor="middle">IB (2)</text>
              </g>
            )}

            {/* Inside Bar 2 (Bar 3 - II) */}
            {compressionLevel >= 3 && (
              <g className="animate-fadeIn">
                <line x1="180" y1="90" x2="180" y2="130" stroke="#ec4899" strokeWidth="2" />
                <rect x="165" y="100" width="30" height="20" fill="#831843" stroke="#ec4899" strokeWidth="2" rx="2" />
                <text x="180" y="145" fill="#f472b6" fontSize="8" fontFamily="monospace" textAnchor="middle">II (3)</text>
              </g>
            )}

            {/* Inside Bar 3 (Bar 4 - III / Coiled) */}
            {compressionLevel >= 4 && (
              <g className="animate-fadeIn">
                <line x1="230" y1="102" x2="230" y2="118" stroke="#a855f7" strokeWidth="2" />
                <rect x="220" y="107" width="20" height="6" fill="#581c87" stroke="#a855f7" strokeWidth="1" rx="1" />
                <text x="230" y="132" fill="#c084fc" fontSize="8" fontFamily="monospace" textAnchor="middle">III (4)</text>
              </g>
            )}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>State: <strong className="text-slate-200">{compressionLevel === 1 ? 'Mother Bar' : compressionLevel === 2 ? 'Inside Bar (IB)' : compressionLevel === 3 ? 'Double Inside (II)' : 'Triple Inside (III - Coiled)'}</strong></span>
          </div>
        </div>

        {/* RIGHT: TELEMETRY & BREAKOUT SIMULATOR */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">Market Microstructure</span>
              <h4 className="text-lg font-bold text-white">
                {compressionLevel === 1 && 'Initial Volatility Range Expansion'}
                {compressionLevel === 2 && 'First Contraction (IB)'}
                {compressionLevel === 3 && 'Double Inside Bar (II) - Spring Coiling'}
                {compressionLevel === 4 && 'Triple Inside Bar (III) - Extreme Compression'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {compressionLevel === 1 && 'Standard 5-minute bar establishing high and low boundaries. Range is normal.'}
                {compressionLevel === 2 && 'Bar 2 is completely contained within Bar 1. Volatility is contracting as market participants hesitate.'}
                {compressionLevel === 3 && 'Two consecutive inside bars. Stop orders are accumulating heavily just outside the mother bar high and low.'}
                {compressionLevel === 4 && 'Maximum compression. Energy is tightly coiled. Retail traders are eager to buy or sell the breakout.'}
              </p>
            </div>

            {/* Test Result Box */}
            {testResult && (
              <div className={`p-4 rounded-xl border animate-fadeIn space-y-1 ${
                testResult === 'trap' ? 'bg-rose-950/40 border-rose-900 text-rose-200' : 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <span>{testResult === 'trap' ? '🚨' : '✅'}</span>
                  <span>{testResult === 'trap' ? 'Breakout Failed (Retail Trap)' : 'Successful Trend Continuation'}</span>
                </div>
                <p className="text-xs leading-relaxed">
                  {testResult === 'trap' 
                    ? 'Price poked slightly above/below the mother bar range to trigger retail stop orders, then immediately reversed violently back into the range. Smart money faded the breakout.'
                    : 'Unusually strong momentum broke the range cleanly without a reversal. Rare in tight trading ranges (~30% occurrence).'}
                </p>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCompressionLevel(prev => Math.min(4, prev + 1));
                  setTestResult(null);
                }}
                disabled={compressionLevel >= 4}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                + Add Inside Bar (Coil Spring)
              </button>

              <button
                onClick={handleTestBreakout}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                ⚡ Test Breakout Trade
              </button>
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-t border-slate-800 pt-2">
              <span>Failure Probability: <strong className="text-rose-400">{compressionLevel >= 3 ? '65% - 70%' : '50%'}</strong></span>
              <button onClick={handleReset} className="text-slate-500 hover:text-slate-300 transition-colors">
                ↺ Reset Sandbox
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
