// Version: v1.0 - Tier 3 Low 1 / Low 2 Bear Trend Execution Lab
// Changelog:
// - v1.0: Interactive bear rally bar-counting simulator demonstrating L1, pause, and high-expectancy L2 short triggers.

import { useState } from 'react';

const BEAR_PULLBACK_SEQUENCE = [
  { id: 1, open: 5028.0, high: 5028.5, low: 5018.0, close: 5018.5, type: 'bear', label: 'Trend Low', correctType: 'none', note: 'Strong Bear Trend Bar printing the swing low at 5018.00. Corrective rally begins on Bar 2.' },
  { id: 2, open: 5018.5, high: 5022.0, low: 5018.5, close: 5021.5, type: 'bull', label: 'Leg 1 Up', correctType: 'none', note: 'First bar of corrective rally. Higher high, higher low. Awaiting the first bar to trade below the prior bar low.' },
  { id: 3, open: 5021.5, high: 5023.0, low: 5020.0, close: 5020.5, type: 'bear', label: 'Low 1 (L1)', correctType: 'L1', note: 'LOW 1 (L1): First bar whose low ticks below the prior bar low (5020.00 < 5021.50). First bear attempt to resume trend.' },
  { id: 4, open: 5020.5, high: 5024.5, low: 5020.5, close: 5024.0, type: 'bull', label: 'Leg 2 Up', correctType: 'none', note: 'L1 fails to sustain downward momentum. Bulls push a second corrective leg higher toward the falling 20 EMA.' },
  { id: 5, open: 5024.0, high: 5025.5, low: 5023.5, close: 5024.5, type: 'bull', label: 'Push 2 Extension', correctType: 'none', note: 'Second leg probes higher to test 20 EMA overhead resistance at 5025.50.' },
  { id: 6, open: 5024.5, high: 5025.0, low: 5024.0, close: 5024.5, type: 'doji', label: 'Inside Bar (Pause)', correctType: 'PAUSE', note: 'INSIDE BAR: Contained completely within Bar 5 range. Inside bars pause the count; they do not increment or reset it.' },
  { id: 7, open: 5024.5, high: 5025.0, low: 5020.0, close: 5020.5, type: 'bear', label: 'Low 2 (L2 Trigger)', correctType: 'L2', note: 'LOW 2 (L2): Second time price breaks below the prior bar low. Two-legged ABC pullback complete at 20 EMA! ~60% Win Rate Short Setup.' },
];

export default function Low1Low2BearCounter() {
  const [currentStep, setCurrentStep] = useState(2); // Start inspecting Bar 3 (L1)
  const [userChoice, setUserChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const activeBar = BEAR_PULLBACK_SEQUENCE[currentStep];

  const handleClassify = (choice) => {
    setUserChoice(choice);
    const isCorrect = choice === activeBar.correctType;

    if (isCorrect) {
      setFeedback({
        correct: true,
        title: `✓ Correct Classification: ${choice === 'L1' ? 'Low 1 (First Attempt)' : choice === 'L2' ? 'Low 2 (A-Grade Short Setup)' : choice === 'PAUSE' ? 'Inside Bar (Pause)' : 'Correct Read'}`,
        text: activeBar.note
      });
    } else {
      setFeedback({
        correct: false,
        title: `✕ Miscount on Bar ${activeBar.id}`,
        text: activeBar.note
      });
    }
  };

  const handleNext = () => {
    if (currentStep < BEAR_PULLBACK_SEQUENCE.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setUserChoice(null);
      setFeedback(null);
    }
  };

  const handleReset = () => {
    setCurrentStep(2);
    setUserChoice(null);
    setFeedback(null);
  };

  // SVG Geometry
  const minP = 5016.0;
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
              Low 1 / Low 2 Bear Trend Execution Lab
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master the inverse Brooks bar counting methodology: identify L1, inside-bar pauses, and high-probability L2 short setups.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Inspecting: <span className="text-blue-400 font-bold">Bar {activeBar.id}</span> / {BEAR_PULLBACK_SEQUENCE.length}
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Examine the countertrend bear rally originating from the swing low at Bar 1.</li>
          <li>For the highlighted bar, evaluate whether it represents a <strong className="text-blue-400">Low 1 (L1)</strong>, an <strong className="text-amber-400">Inside Bar Pause</strong>, or a <strong className="text-rose-400">Low 2 (L2)</strong> short trigger.</li>
          <li>Click your classification to verify against institutional rules, then use <strong className="text-blue-400">Step Next Bar ➔</strong> to progress through the two-legged ABC correction.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Bear Flag Structure (ES 5-Min)
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 320 220">
            {/* Price Grid */}
            {[5018, 5022, 5026, 5030].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="305" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="310" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* Falling 20 EMA Overhead Resistance Line */}
            <path
              d="M 20 60 Q 150 75, 300 85"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="none"
            />
            <text x="295" y="75" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="end">
              Falling 20 EMA Resistance
            </text>

            {/* Bars up to currentStep */}
            {BEAR_PULLBACK_SEQUENCE.slice(0, currentStep + 1).map((b, i) => {
              const x = 30 + i * 38;
              const isBull = b.type === 'bull';
              const isDoji = b.type === 'doji';
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(3, Math.abs(openY - closeY));
              const isCurrent = i === currentStep;

              return (
                <g key={b.id}>
                  {/* Focus Marker */}
                  {isCurrent && (
                    <circle cx={x} cy={highY - 8} r="3.5" fill="#38bdf8" />
                  )}

                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isDoji ? '#94a3b8' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth={isCurrent ? '2.5' : '1.5'}
                  />
                  {/* Body */}
                  <rect
                    x={x - 11}
                    y={bodyTop}
                    width="22"
                    height={bodyH}
                    fill={isDoji ? '#475569' : isBull ? '#065f46' : '#881337'}
                    stroke={isDoji ? '#94a3b8' : isBull ? '#10b981' : '#f43f5e'}
                    strokeWidth={isCurrent ? '2' : '1'}
                    rx="1.5"
                  />
                  {/* Bar Number */}
                  <text
                    x={x}
                    y={svgH - 5}
                    fill={isCurrent ? '#38bdf8' : '#64748b'}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight={isCurrent ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    B{b.id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>Inspecting: <strong className="text-white">Bar {activeBar.id}</strong></span>
            <span>Low: <strong className="text-slate-200">{activeBar.low.toFixed(2)}</strong></span>
            <span>Prior Low: <strong className="text-slate-400">{BEAR_PULLBACK_SEQUENCE[currentStep - 1].low.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* RIGHT: CLASSIFICATION TERMINAL */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Bear Bar Counting Terminal
              </span>
              <h4 className="text-base font-bold text-white">
                How is Bar {activeBar.id} classified in this rally?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compare Bar {activeBar.id}'s low against Bar {activeBar.id - 1}'s low. Does it trigger an initial short attempt (L1), pause the count, or complete a two-legged Low 2 setup?
              </p>

              {/* Classification Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleClassify('L1')}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    userChoice === 'L1'
                      ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500'
                  }`}
                >
                  Low 1 (L1)
                </button>
                <button
                  onClick={() => handleClassify('L2')}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    userChoice === 'L2'
                      ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500'
                  }`}
                >
                  Low 2 (L2)
                </button>
                <button
                  onClick={() => handleClassify('PAUSE')}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    userChoice === 'PAUSE'
                      ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500'
                  }`}
                >
                  Inside Bar (Pause)
                </button>
                <button
                  onClick={() => handleClassify('none')}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    userChoice === 'none'
                      ? 'bg-slate-800 border-slate-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  Up Leg Bar
                </button>
              </div>
            </div>

            {/* Real-time Feedback Banner */}
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
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
            >
              ↺ Reset
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep >= BEAR_PULLBACK_SEQUENCE.length - 1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded text-xs font-mono font-semibold transition-colors"
            >
              Step Next Bar ➔
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
