// Version: v1.0 - Tier 3 High 1 / High 2 Pullback Practice Trainer
// Changelog:
// - v1.0: Interactive bar counting trainer testing H1, inside-bar pause, and H2 classification.

import { useState } from 'react';

const PULLBACK_SEQUENCE = [
  { id: 1, open: 5015.0, high: 5025.0, low: 5014.5, close: 5024.5, type: 'bull', label: 'Trend High', correctType: 'none', note: 'Bull Trend Bar printing swing high at 5025.00. Pullback begins on Bar 2.' },
  { id: 2, open: 5024.5, high: 5024.0, low: 5020.0, close: 5020.5, type: 'bear', label: 'Leg 1 Down', correctType: 'none', note: 'First bar of pullback. Lower high, lower low. Awaiting first attempt to break prior high.' },
  { id: 3, open: 5020.5, high: 5022.5, low: 5019.5, close: 5022.0, type: 'bull', label: 'High 1 (H1)', correctType: 'H1', note: 'HIGH 1 (H1): First bar whose high exceeds the prior bar high (5022.50 > 5022.00). Leg 1 pause.' },
  { id: 4, open: 5022.0, high: 5021.5, low: 5018.0, close: 5018.5, type: 'bear', label: 'Leg 2 Down', correctType: 'none', note: 'H1 fails to produce trend resumption. Bears drive price lower, creating Leg 2 down.' },
  { id: 5, open: 5018.5, high: 5019.5, low: 5017.0, close: 5018.0, type: 'bear', label: 'Push 2 Extension', correctType: 'none', note: 'Continued downward probe testing 20 EMA support.' },
  { id: 6, open: 5017.5, high: 5018.5, low: 5017.5, close: 5018.0, type: 'doji', label: 'Inside Bar (Pause)', correctType: 'PAUSE', note: 'INSIDE BAR: High is lower, low is higher than Bar 5. Inside bars pause the count and do not reset or increment it.' },
  { id: 7, open: 5018.0, high: 5022.0, low: 5016.5, close: 5021.5, type: 'bull', label: 'High 2 (H2 Trigger)', correctType: 'H2', note: 'HIGH 2 (H2): Second time price breaks above the prior bar high. Two-legged pullback complete! ~60% Win Rate Setup.' },
];

export default function High1High2BarCounter() {
  const [currentStep, setCurrentStep] = useState(2); // Start inspecting Bar 3 (H1)
  const [userChoice, setUserChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const activeBar = PULLBACK_SEQUENCE[currentStep];

  const handleClassify = (choice) => {
    setUserChoice(choice);
    const isCorrect = choice === activeBar.correctType;

    if (isCorrect) {
      setFeedback({
        correct: true,
        title: `✓ Correct Classification: ${choice === 'H1' ? 'High 1' : choice === 'H2' ? 'High 2 (A-Grade Setup)' : choice === 'PAUSE' ? 'Inside Bar (Pause)' : 'Correct Read'}`,
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
    if (currentStep < PULLBACK_SEQUENCE.length - 1) {
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
  const minP = 5013.0;
  const maxP = 5027.0;
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
              High 1 / High 2 Pullback Practice Trainer
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master the Brooks bar counting methodology: identify H1, inside-bar pauses, and high-probability H2 entries.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Inspecting: <span className="text-blue-400 font-bold">Bar {activeBar.id}</span> / {PULLBACK_SEQUENCE.length}
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Examine the pullback from the swing high on Bar 1.</li>
          <li>For the highlighted bar, determine whether it represents a <strong className="text-blue-400">High 1 (H1)</strong>, an <strong className="text-amber-400">Inside Bar Pause</strong>, or a <strong className="text-emerald-400">High 2 (H2)</strong>.</li>
          <li>Click your classification to verify against institutional rules, then use <strong className="text-blue-400">Step Next Bar ➔</strong> to progress through the two-legged correction.</li>
        </ol>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-7 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Pullback Structure (ES 5-Min)
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 320 220">
            {/* Price Grid */}
            {[5015, 5020, 5025].map((p) => (
              <g key={p}>
                <line x1="15" y1={getY(p)} x2="305" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="310" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p}
                </text>
              </g>
            ))}

            {/* 20 EMA Support Line */}
            <path
              d="M 20 180 Q 150 175, 300 170"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="none"
            />
            <text x="295" y="162" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="end">
              20 EMA Support
            </text>

            {/* Bars up to currentStep */}
            {PULLBACK_SEQUENCE.slice(0, currentStep + 1).map((b, i) => {
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
            <span>High: <strong className="text-slate-200">{activeBar.high.toFixed(2)}</strong></span>
            <span>Prior High: <strong className="text-slate-400">{PULLBACK_SEQUENCE[currentStep - 1].high.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* RIGHT: CLASSIFICATION TERMINAL */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                Bar Counting Terminal
              </span>
              <h4 className="text-base font-bold text-white">
                How is Bar {activeBar.id} classified in this pullback?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compare Bar {activeBar.id}'s high against Bar {activeBar.id - 1}'s high. Does it create an attempt to resume the trend, pause the count, or continue downward?
              </p>

              {/* Classification Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleClassify('H1')}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    userChoice === 'H1'
                      ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500'
                  }`}
                >
                  High 1 (H1)
                </button>
                <button
                  onClick={() => handleClassify('H2')}
                  className={`p-2.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    userChoice === 'H2'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  High 2 (H2)
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
                  Down Leg Bar
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
              disabled={currentStep >= PULLBACK_SEQUENCE.length - 1}
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
