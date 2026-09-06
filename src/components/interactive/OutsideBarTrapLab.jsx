// Version: v1.0 - Tier 1 Outside Bar Expansion & Double Trap Simulator
// Simulates false upside breakout sweep followed by full downside stop flush.

import { useState } from 'react';

export default function OutsideBarTrapLab() {
  const [phase, setPhase] = useState(0); // 0 = Prior Bar, 1 = Poked Above (Bull Trap), 2 = Swept Below (Bear Flush)
  const [trappedOrders, setTrappedOrders] = useState({ longs: 0, shorts: 0 });

  const handleStep = () => {
    if (phase === 0) {
      setPhase(1);
      setTrappedOrders({ longs: 420, shorts: 0 });
    } else if (phase === 1) {
      setPhase(2);
      setTrappedOrders({ longs: 420, shorts: 260 });
    } else {
      setPhase(0);
      setTrappedOrders({ longs: 0, shorts: 0 });
    }
  };

  const handleReset = () => {
    setPhase(0);
    setTrappedOrders({ longs: 0, shorts: 0 });
  };

  // Dimensions & geometries
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
              Outside Bar (OB, OO) Expansion & Stop-Running Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe the double-trap dynamic: retail buy stops trigger institutional limit fills before a full range plunge.
          </p>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Click <strong className="text-blue-400">Advance Phase ➔</strong> to trigger Phase 1 (Sweep High). Notice how retail breakout buy stops are executed.</li>
          <li>Click <strong className="text-blue-400">Advance Phase ➔</strong> again to trigger Phase 2 (Flush Low). Notice how price reverses below the bar, wiping out early buyers.</li>
          <li><strong>Takeaway:</strong> Outside bars represent 1-bar trading ranges. Trading breakouts of the prior bar inside ranges is a primary retail trap.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-5 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Outside Bar Lifecycle
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 240 220">
            {/* Reference levels */}
            <line x1="20" y1="60" x2="220" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
            <text x="25" y="55" fill="#64748b" fontSize="8" fontFamily="monospace">Prior High (5022.00)</text>

            <line x1="20" y1="160" x2="220" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
            <text x="25" y="172" fill="#64748b" fontSize="8" fontFamily="monospace">Prior Low (5016.00)</text>

            {/* Bar 1: Prior Bar */}
            <g>
              <line x1="70" y1="60" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" />
              <rect x="55" y="80" width="30" height="60" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
              <text x="70" y="190" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Bar 1 (Base)</text>
            </g>

            {/* Bar 2: Outside Bar */}
            {phase === 0 && (
              <g opacity="0.3">
                <circle cx="160" cy="110" r="4" fill="#64748b" />
                <text x="160" y="130" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">Bar 2 Awaiting Open</text>
              </g>
            )}

            {phase === 1 && (
              <g className="animate-fadeIn">
                {/* Wick poked above */}
                <line x1="160" y1="35" x2="160" y2="110" stroke="#10b981" strokeWidth="2" />
                {/* Temporary green body */}
                <rect x="145" y="50" width="30" height="60" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
                <polygon points="160,25 155,32 165,32" fill="#10b981" />
                <text x="160" y="20" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle">+1 Tick Breakout Trap</text>
                <text x="160" y="190" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle">Bar 2: Bull Trap</text>
              </g>
            )}

            {phase === 2 && (
              <g className="animate-fadeIn">
                {/* Full expanding outside wick */}
                <line x1="160" y1="35" x2="160" y2="190" stroke="#f43f5e" strokeWidth="2" />
                {/* Deep red body closing near bottom */}
                <rect x="145" y="80" width="30" height="95" fill="#881337" stroke="#f43f5e" strokeWidth="2" rx="2" />
                <polygon points="160,200 155,193 165,193" fill="#f43f5e" />
                <text x="160" y="212" fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle">Stop Sweep Low</text>
                <text x="160" y="15" fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle">Outside Bear (OB)</text>
              </g>
            )}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Bar 2 High: <strong className={phase >= 1 ? 'text-emerald-400' : 'text-slate-400'}>{phase >= 1 ? '5022.25' : '---'}</strong></span>
            <span>Bar 2 Low: <strong className={phase === 2 ? 'text-rose-400' : 'text-slate-400'}>{phase === 2 ? '5015.50' : '---'}</strong></span>
          </div>
        </div>

        {/* RIGHT: ORDER FLOW TELEMETRY & MECHANICS */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Auction Trap Progression
              </span>
              <h4 className="text-base md:text-lg font-bold text-white">
                {phase === 0 && 'Baseline: Clear High and Low Anchors Defined'}
                {phase === 1 && 'Phase 1: Retail Longs Hooked on +1 Tick Breakout'}
                {phase === 2 && 'Phase 2: Complete Institutional Liquidation & Reversal'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {phase === 0 && 'Price is resting within Bar 1 boundaries. Retail buy stops are clustered above 5022.00; sell stops below 5016.00.'}
                {phase === 1 && 'Price ticks to 5022.25. Breakout bots and retail momentum traders buy at the high. Institutional limit orders supply the liquidity.'}
                {phase === 2 && 'Having filled short inventory into the breakout liquidity, institutional sellers dump at market. Price plunges straight through 5016.00, executing long stops and trapping anyone who bought the high.'}
              </p>
            </div>

            {/* Trapped Orders Counter */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-500">Trapped Breakout Longs</span>
                <div className="text-lg font-mono font-bold text-rose-400">
                  {trappedOrders.longs} contracts
                </div>
                <span className="text-[10px] text-slate-500">Bought high, underwater</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-500">Institutional Sells Filled</span>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {phase === 2 ? '100% Filled & Green' : phase === 1 ? 'Accumulating at High' : 'Resting at Ask'}
                </div>
                <span className="text-[10px] text-slate-500">Passive liquidity capture</span>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleStep}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                {phase === 0 ? 'Step 1: Sweep Prior High ➔' : phase === 1 ? 'Step 2: Flush Prior Low ➔' : 'Restart Simulation ↺'}
              </button>

              <button
                onClick={handleReset}
                className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
              >
                ↺ Reset
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
