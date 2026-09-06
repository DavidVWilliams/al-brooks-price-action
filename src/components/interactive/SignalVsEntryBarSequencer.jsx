// Version: v1.0 - Tier 1 Signal Bar vs. Entry Bar Trigger Simulator
// Changelog:
// - v1.0: Interactive stop-order placement (+1 tick) with next-bar trigger verification.

import { useState } from 'react';

export default function SignalVsEntryBarSequencer() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [outcome, setOutcome] = useState(null); // 'triggered', 'untriggered', null

  const handlePlaceBuyStop = () => {
    setOrderPlaced(true);
    setOutcome(null);
  };

  const handleStepNextBar = (simulateSuccess = true) => {
    if (!orderPlaced) return;
    setOutcome(simulateSuccess ? 'triggered' : 'untriggered');
  };

  const handleReset = () => {
    setOrderPlaced(false);
    setOutcome(null);
  };

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
              Signal Bar vs. Entry Bar Trigger Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test the +1 tick stop order discipline: never anticipate an entry before price confirms the signal bar high.
          </p>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Click <strong className="text-blue-400">Place Buy Stop (+1 Tick @ 5020.25)</strong> to arm your institutional entry order above the signal bar.</li>
          <li>Click <strong className="text-emerald-400">Simulate Confirmation</strong> to watch Bar 2 trigger your fill and validate the setup.</li>
          <li>Click <strong className="text-amber-400">Simulate Failure (No Fill)</strong> to see how the stop discipline saves you from getting stuck in an unconfirmed fakeout.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-5 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Trigger Execution
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 240 220">
            {/* Signal High Line */}
            <line x1="20" y1="80" x2="220" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
            <text x="25" y="75" fill="#64748b" fontSize="8" fontFamily="monospace">Signal High: 5020.00</text>

            {/* Buy Stop Trigger Line (+1 tick = 5020.25) */}
            {orderPlaced && (
              <g className="animate-fadeIn">
                <line x1="20" y1="65" x2="220" y2="65" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="225" y="60" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="end">Buy Stop: 5020.25</text>
              </g>
            )}

            {/* Bar 1: Signal Bar (Bull Reversal Hammer) */}
            <g>
              <line x1="70" y1="80" x2="70" y2="180" stroke="#10b981" strokeWidth="2" />
              <rect x="55" y="80" width="30" height="35" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
              <text x="70" y="200" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle">Bar 1 (Signal)</text>
            </g>

            {/* Bar 2: Awaiting / Triggered / Untriggered */}
            {outcome === null && (
              <g opacity="0.3">
                <circle cx="160" cy="115" r="4" fill="#64748b" />
                <text x="160" y="140" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">Bar 2 Pending</text>
              </g>
            )}

            {outcome === 'triggered' && (
              <g className="animate-fadeIn">
                <line x1="160" y1="45" x2="160" y2="135" stroke="#10b981" strokeWidth="2" />
                <rect x="145" y="55" width="30" height="65" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
                <circle cx="160" cy="65" r="4" fill="#38bdf8" />
                <text x="160" y="35" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">FILLED (+1 Tick)</text>
                <text x="160" y="200" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle">Bar 2 (Entry Bar)</text>
              </g>
            )}

            {outcome === 'untriggered' && (
              <g className="animate-fadeIn">
                <line x1="160" y1="95" x2="160" y2="190" stroke="#f43f5e" strokeWidth="2" />
                <rect x="145" y="110" width="30" height="60" fill="#881337" stroke="#f43f5e" strokeWidth="2" rx="2" />
                <text x="160" y="90" fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle">NO TRIGGER (High: 5019.50)</text>
                <text x="160" y="200" fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle">Setup Aborted</text>
              </g>
            )}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Stop Order: <strong className={orderPlaced ? 'text-blue-400' : 'text-slate-500'}>{orderPlaced ? 'ARMED' : 'NONE'}</strong></span>
            <span>Fill Status: <strong className={outcome === 'triggered' ? 'text-emerald-400' : outcome === 'untriggered' ? 'text-rose-400' : 'text-slate-500'}>{outcome ? outcome.toUpperCase() : 'WAITING'}</strong></span>
          </div>
        </div>

        {/* RIGHT: RULES & EXECUTION METRICS */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                The Brooks Stop-Order Mandate
              </span>
              <h4 className="text-base md:text-lg font-bold text-white">
                {outcome === null && !orderPlaced && 'Awaiting Setup Arming'}
                {outcome === null && orderPlaced && 'Order Armed 1 Tick Above High'}
                {outcome === 'triggered' && 'Setup Confirmed: Entry Bar Validated'}
                {outcome === 'untriggered' && 'Discipline Paid Off: Trap Successfully Avoided'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {outcome === null && !orderPlaced && 'Bar 1 closed with a bullish rejection tail. It is a valid signal bar, but NOT an active trade yet.'}
                {outcome === null && orderPlaced && 'Your buy stop order is resting at 5020.25 (exactly 1 tick above 5020.00). If Bar 2 fails to exceed the high, no capital is risked.'}
                {outcome === 'triggered' && 'Bar 2 traded through 5020.25, filling your stop order. Bar 2 is now the entry bar. Initial protective stop is anchored 1 tick below Bar 1 low.'}
                {outcome === 'untriggered' && 'Bar 2 failed to tick above Bar 1 and dumped downward. Because you did not enter at market during Bar 1, you took zero loss on this failed reversal.'}
              </p>
            </div>

            <div className="p-3 bg-blue-950/30 border-l-4 border-blue-500 rounded-r text-xs text-slate-300">
              <strong className="text-blue-400 block mb-1 uppercase font-mono text-[10px]">Axiom:</strong>
              "A signal bar without an entry bar is just a pretty candlestick. Never enter on the close of a signal bar—demand the market prove its strength by breaking +1 tick into the entry bar."
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePlaceBuyStop}
                disabled={orderPlaced}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                + Place Buy Stop (+1 Tick @ 5020.25)
              </button>

              <button
                onClick={() => handleStepNextBar(true)}
                disabled={!orderPlaced || outcome !== null}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                Simulate Confirmation (Triggered)
              </button>

              <button
                onClick={() => handleStepNextBar(false)}
                disabled={!orderPlaced || outcome !== null}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                Simulate Failure (No Fill)
              </button>

              <button
                onClick={handleReset}
                className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors ml-auto"
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
