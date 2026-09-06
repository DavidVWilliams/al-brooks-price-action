// Version: v1.0 - Tier 1 Micro Channel "Never Fade" Simulator
// Changelog:
// - v1.0: Interactive bar-stepping simulator demonstrating micro channel momentum vs. countertrend fading traps.

import { useState } from 'react';

const BARS_DATA = [
  { id: 1, open: 5010.00, high: 5013.00, low: 5009.50, close: 5012.75 },
  { id: 2, open: 5012.75, high: 5015.50, low: 5012.50, close: 5015.00 },
  { id: 3, open: 5015.00, high: 5018.25, low: 5014.75, close: 5018.00 },
  { id: 4, open: 5018.00, high: 5021.00, low: 5017.75, close: 5020.50 },
  { id: 5, open: 5020.50, high: 5023.75, low: 5020.25, close: 5023.25 },
  { id: 6, open: 5023.25, high: 5026.50, low: 5023.00, close: 5026.00 },
  { id: 7, open: 5026.00, high: 5029.00, low: 5025.75, close: 5028.50 },
];

export default function MicroChannelDisciplineLab() {
  const [currentBarIndex, setCurrentBarIndex] = useState(2); // Start with 3 bars visible
  const [playerAction, setPlayerAction] = useState(null); // 'fade', 'follow', null
  const [feedback, setFeedback] = useState(null);

  const visibleBars = BARS_DATA.slice(0, currentBarIndex + 1);
  const currentBar = BARS_DATA[currentBarIndex];

  const handleNextBar = () => {
    if (currentBarIndex < BARS_DATA.length - 1) {
      setCurrentBarIndex((prev) => prev + 1);
      setPlayerAction(null);
      setFeedback(null);
    }
  };

  const handleFadeAction = () => {
    setPlayerAction('fade');
    setFeedback({
      status: 'error',
      title: '🚨 Fading Error: Trapped Countertrend',
      text: `You sold short at ${currentBar.close.toFixed(2)}. In a tight micro channel, every bar makes a higher low. Buyers absorb every minor dip instantly. You are trapped in underwater drawdowns.`
    });
  };

  const handleFollowAction = () => {
    setPlayerAction('follow');
    setFeedback({
      status: 'success',
      title: '✅ Institutional Alignment: Always In Long',
      text: `You joined with market orders or bought the close at ${currentBar.close.toFixed(2)}. Highs continue to expand without pullbacks. The path of least resistance is up.`
    });
  };

  const handleReset = () => {
    setCurrentBarIndex(2);
    setPlayerAction(null);
    setFeedback(null);
  };

  // SVG Geometry
  const minP = 5008.00;
  const maxP = 5031.00;
  const svgH = 220;
  const svgW = 280;
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
              Micro Channel "Never Fade" Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Experience why picking tops in consecutive higher-low channels creates catastrophic account drawdowns.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Bar Count: <span className="text-blue-400 font-bold">{currentBarIndex + 1}</span> / {BARS_DATA.length}
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Observe that every single bar has a low higher than the previous bar's low (no pullback).</li>
          <li>Click <strong className="text-rose-400">Fade (Short at Market)</strong> to experience the retail trap of trying to pick the top.</li>
          <li>Click <strong className="text-emerald-400">Step Next Bar ➔</strong> to watch the relentless momentum continue upward without letting shorts out.</li>
          <li><strong>Takeaway:</strong> First reversals in micro channels fail 80% of the time. Do not fade until there is a decisive breakout and retest.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-6 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Relentless Bull Micro Channel
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 280 220">
            {/* Horizontal Grid lines */}
            {[5010, 5015, 5020, 5025, 5030].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="265" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="270" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Micro Channel Support Trendline */}
            {visibleBars.length >= 2 && (
              <line
                x1={35}
                y1={getY(BARS_DATA[0].low)}
                x2={35 + (visibleBars.length - 1) * 35}
                y2={getY(visibleBars[visibleBars.length - 1].low)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Candlesticks */}
            {visibleBars.map((b, i) => {
              const x = 35 + i * 35;
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));

              return (
                <g key={b.id}>
                  {/* Wick */}
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke="#10b981" strokeWidth="2" />
                  {/* Body */}
                  <rect
                    x={x - 11}
                    y={bodyTop}
                    width="22"
                    height={bodyH}
                    fill="#065f46"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    rx="1.5"
                  />
                  {/* Bar Number */}
                  <text x={x} y={svgH - 5} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {b.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Consecutive Higher Lows: <strong className="text-emerald-400">{currentBarIndex + 1} Bars</strong></span>
            <span>Pullback Depth: <strong className="text-blue-400">0.00 pts</strong></span>
          </div>
        </div>

        {/* RIGHT: DECISION & DISCIPLINE AUDIT */}
        <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Channel Dynamics & Market Posture
              </span>
              <h4 className="text-base font-bold text-white">
                Always In Long (AIL) Dominance
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Notice that not a single bar has traded below the prior bar's low. Institutions are using limit orders to buy at the prior bar's close. Any trader attempting to short here is providing cheap exit liquidity for smart-money profit targets.
              </p>
            </div>

            {feedback && (
              <div className={`p-4 rounded-xl border animate-fadeIn space-y-1 ${
                feedback.status === 'error' ? 'bg-rose-950/40 border-rose-900 text-rose-200' : 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
              }`}>
                <span className="text-xs font-mono font-bold uppercase block">{feedback.title}</span>
                <p className="text-xs leading-relaxed">{feedback.text}</p>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleFollowAction}
                disabled={playerAction !== null}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                + Buy Close (Follow Channel)
              </button>

              <button
                onClick={handleFadeAction}
                disabled={playerAction !== null}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                - Fade (Short at Market)
              </button>

              <button
                onClick={handleNextBar}
                disabled={currentBarIndex >= BARS_DATA.length - 1}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                Step Next Bar ➔
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
