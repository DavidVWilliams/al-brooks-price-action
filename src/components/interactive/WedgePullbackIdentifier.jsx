// Version: v1.0 - Tier 3 Three-Push Wedge Pullback Visualizer & Identifier
// Changelog:
// - v1.0: Interactive 3-push pullback simulator with push tracking and trend resumption trigger.

import { useState } from 'react';

const WEDGE_BARS = [
  // Setup: Strong Bull Trend Leg
  { id: 1, open: 5015.0, high: 5022.0, low: 5014.5, close: 5021.5, type: 'bull', push: 0 },
  { id: 2, open: 5021.5, high: 5028.0, low: 5021.0, close: 5027.5, type: 'bull', push: 0 }, // Swing High at 5028.00
  // Push 1 Down
  { id: 3, open: 5027.5, high: 5027.5, low: 5022.0, close: 5022.5, type: 'bear', push: 1, label: 'Push 1 Low' },
  // Pullback from Push 1
  { id: 4, open: 5022.5, high: 5025.0, low: 5022.0, close: 5024.5, type: 'bull', push: 0 },
  // Push 2 Down (Breaks Push 1 low with less follow-through)
  { id: 5, open: 5024.5, high: 5024.5, low: 5019.5, close: 5020.0, type: 'bear', push: 2, label: 'Push 2 Low' },
  // Pullback from Push 2
  { id: 6, open: 5020.0, high: 5023.0, low: 5020.0, close: 5022.0, type: 'bull', push: 0 },
  // Push 3 Down (Exhaustion push into key 20 EMA support)
  { id: 7, open: 5022.0, high: 5022.5, low: 5018.0, close: 5018.5, type: 'bear', push: 3, label: 'Push 3 Low' },
  // Wedge Reversal Trigger Bar (Bull Reversal Hammer)
  { id: 8, open: 5018.5, high: 5024.0, low: 5017.5, close: 5023.5, type: 'bull', push: 0, label: 'Wedge Trigger' },
];

const RESUMPTION_BARS = [
  { id: 9, open: 5023.5, high: 5028.0, low: 5023.0, close: 5027.5, type: 'bull', push: 0 },
  { id: 10, open: 5027.5, high: 5031.5, low: 5027.0, close: 5031.0, type: 'bull', push: 0 },
];

export default function WedgePullbackIdentifier() {
  const [identifiedPushes, setIdentifiedPushes] = useState([]); // Array of detected pushes [1, 2, 3]
  const [steppedResumption, setSteppedResumption] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleRegisterPush = (pushNum) => {
    if (identifiedPushes.includes(pushNum)) return;

    // Must identify in chronological order: 1 -> 2 -> 3
    const expected = identifiedPushes.length + 1;
    if (pushNum === expected) {
      const nextPushes = [...identifiedPushes, pushNum];
      setIdentifiedPushes(nextPushes);

      if (nextPushes.length === 3) {
        setFeedback({
          correct: true,
          title: '🏆 Three-Push Wedge Pattern Confirmed!',
          text: 'You have identified all three downward pushes. Push 3 printed with diminishing displacement into 20 EMA support. Countertrend bears are exhausted. Bar 8 triggers a high-probability bull trend resumption.'
        });
      } else {
        setFeedback({
          correct: true,
          title: `✓ Push ${pushNum} Confirmed`,
          text: pushNum === 1
            ? 'First leg of the pullback complete at 5022.00.'
            : 'Push 2 exceeded Push 1 low but met immediate responsive institutional bidding.'
        });
      }
    } else {
      setFeedback({
        correct: false,
        title: `✕ Sequence Error: Look for Push ${expected}`,
        text: `Wedges require sequential three-push counting. Identify Push ${expected} before advancing.`
      });
    }
  };

  const handleReset = () => {
    setIdentifiedPushes([]);
    setSteppedResumption(false);
    setFeedback(null);
  };

  // Active bar list
  const activeBars = steppedResumption ? [...WEDGE_BARS, ...RESUMPTION_BARS] : WEDGE_BARS;

  // SVG Geometry
  const minP = 5013.0;
  const maxP = 5033.0;
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
              Three-Push Wedge Pullback Visualizer
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master the anatomy of corrective three-push wedges: identify diminishing momentum and spot institutional resumption triggers.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Pushes Identified: <span className="text-amber-400 font-bold">{identifiedPushes.length}</span> / 3
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Inspect the downward corrective flag following the strong bull rally to 5028.00.</li>
          <li>Click the buttons to identify <strong className="text-blue-400">Push 1</strong> (Bar 3), <strong className="text-amber-400">Push 2</strong> (Bar 5), and <strong className="text-emerald-400">Push 3</strong> (Bar 7) in order.</li>
          <li>Once all three pushes are confirmed, click <strong className="text-emerald-400">Execute Wedge Reversal ➔</strong> to watch price surge back above the prior swing high.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS WITH WEDGE CONVERGENCE */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Wedge Pullback Geometry (ES 5-Min)
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 340 220">
            {/* Grid */}
            {[5015, 5020, 5025, 5030].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="325" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="330" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Wedge Converging Support Trendline (Connecting Push 1, 2, and 3 lows) */}
            {identifiedPushes.length >= 2 && (
              <g className="animate-fadeIn">
                <line
                  x1={85}
                  y1={getY(5022.0)}
                  x2={230}
                  y2={getY(5017.5)}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="235" y={getY(5017.5) + 12} fill="#38bdf8" fontSize="7" fontFamily="monospace">
                  Wedge Lower Trendline
                </text>
              </g>
            )}

            {/* Wedge Upper Trendline (Connecting Highs of Bars 2, 4, 6) */}
            {identifiedPushes.length === 3 && (
              <line
                x1={55}
                y1={getY(5028.0)}
                x2={220}
                y2={getY(5022.0)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Candlesticks */}
            {activeBars.map((b, i) => {
              const x = 25 + i * 31;
              const isBull = b.type === 'bull';
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));
              const isIdentifiedPush = identifiedPushes.includes(b.push);

              return (
                <g key={b.id} className={i >= 8 ? 'animate-fadeIn' : ''}>
                  {/* Push Indicator Circles */}
                  {isIdentifiedPush && (
                    <g>
                      <circle cx={x} cy={lowY + 10} r="7" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x={x} y={lowY + 13} fill="#60a5fa" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {b.push}
                      </text>
                    </g>
                  )}

                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <rect
                    x={x - 9}
                    y={bodyTop}
                    width="18"
                    height={bodyH}
                    fill={isBull ? '#065f46' : '#881337'}
                    stroke={isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth="1"
                    rx="1"
                  />
                  {/* Bar Number */}
                  <text
                    x={x}
                    y={svgH - 5}
                    fill={b.id === 8 ? '#34d399' : '#64748b'}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight={b.id === 8 ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    B{b.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Pattern State: <strong className={identifiedPushes.length === 3 ? 'text-emerald-400' : 'text-amber-400'}>{identifiedPushes.length === 3 ? '3-PUSH WEDGE COMPLETE' : `${identifiedPushes.length}/3 Pushes Logged`}</strong></span>
            <span>Trigger Bar: <strong className="text-white">Bar 8 (Bull Hammer)</strong></span>
          </div>
        </div>

        {/* RIGHT: IDENTIFICATION CONTROLS & RULES */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Push Identification Caliper
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click each push in chronological order as price creates lower lows during the corrective pullback:
              </p>

              {/* Push Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRegisterPush(1)}
                  disabled={identifiedPushes.includes(1)}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    identifiedPushes.includes(1)
                      ? 'bg-blue-950 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500'
                  }`}
                >
                  Push 1 (Bar 3)
                </button>
                <button
                  onClick={() => handleRegisterPush(2)}
                  disabled={identifiedPushes.includes(2)}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    identifiedPushes.includes(2)
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500'
                  }`}
                >
                  Push 2 (Bar 5)
                </button>
                <button
                  onClick={() => handleRegisterPush(3)}
                  disabled={identifiedPushes.includes(3)}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    identifiedPushes.includes(3)
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  Push 3 (Bar 7)
                </button>
              </div>
            </div>

            {/* Feedback Banner */}
            {feedback && (
              <div
                className={`p-3.5 rounded-xl border animate-fadeIn space-y-1 ${
                  feedback.correct
                    ? 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-900 text-rose-200'
                }`}
              >
                <span className="text-xs font-mono font-bold uppercase block">
                  {feedback.title}
                </span>
                <p className="text-xs leading-relaxed">{feedback.text}</p>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <button
              onClick={() => setSteppedResumption(true)}
              disabled={identifiedPushes.length < 3 || steppedResumption}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded text-xs font-mono font-bold transition-colors shadow-md"
            >
              Execute Wedge Reversal (Buy Stop) ➔
            </button>

            <button
              onClick={handleReset}
              className="w-full py-1 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors text-center"
            >
              ↺ Reset Pattern
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
