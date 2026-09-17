// Version: v2.0 - Fixed Candlestick Coordinates and Brooks Bar Counting Truth
import { useState } from 'react';

const PULLBACK_SEQUENCE = [
  {
    id: 1,
    name: 'Bar 1',
    open: 5016.0,
    high: 5025.0,
    low: 5015.5,
    close: 5024.75,
    type: 'bull',
    classification: 'Trend High',
    explanation: 'The swing high of the bull spike. The bar count starts on the first pullback bar after this extreme.',
  },
  {
    id: 2,
    name: 'Bar 2',
    open: 5024.5,
    high: 5024.0,
    low: 5020.0,
    close: 5020.5,
    type: 'bear',
    classification: 'Down Leg Bar',
    explanation: 'First bar of the pullback. High is lower than Bar 1 (5024.00 < 5025.00). Leg 1 down begins.',
  },
  {
    id: 3,
    name: 'Bar 3',
    open: 5020.75,
    high: 5023.0,
    low: 5021.0,
    close: 5022.5,
    type: 'bull',
    classification: 'Inside Bar (Pause)',
    explanation: 'Inside Bar: High (5023.00) is below Bar 2 high (5024.00), and Low (5021.00) is above Bar 2 low (5020.00). Pauses the count without triggering an H1.',
  },
  {
    id: 4,
    name: 'Bar 4',
    open: 5022.5,
    high: 5024.25,
    low: 5021.5,
    close: 5023.5,
    type: 'bull',
    classification: 'High 1 (H1)',
    explanation: 'HIGH 1 (H1): First bar in the pullback whose high extends at least 1 tick above the prior bar (5024.25 > 5023.00). Ends Leg 1.',
  },
  {
    id: 5,
    name: 'Bar 5',
    open: 5023.25,
    high: 5023.5,
    low: 5017.5,
    close: 5018.0,
    type: 'bear',
    classification: 'Down Leg Bar',
    explanation: 'Leg 2 Down: Strong bear bar trades below Bar 4 low, failing the H1 and initiating the second leg of the correction.',
  },
  {
    id: 6,
    name: 'Bar 6',
    open: 5018.0,
    high: 5019.0,
    low: 5016.0,
    close: 5018.75,
    type: 'bull',
    classification: 'Down Leg Bar',
    explanation: 'Tests the rising 20 EMA support. Lower high than Bar 5 (5019.00 < 5023.50). Prepares the High 2 signal.',
  },
  {
    id: 7,
    name: 'Bar 7',
    open: 5018.75,
    high: 5022.0,
    low: 5018.5,
    close: 5021.5,
    type: 'bull',
    classification: 'High 2 (H2)',
    explanation: 'HIGH 2 (H2): High breaks above Bar 6 high (5022.00 > 5019.00) near the 20 EMA. High-probability institutional long entry (~60% win rate).',
  },
];

export default function High1High2BarCounter() {
  const [currentStep, setCurrentStep] = useState(2); // start inspecting Bar 3 (index 2)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const activeBar = PULLBACK_SEQUENCE[currentStep];
  const priorBar = PULLBACK_SEQUENCE[currentStep - 1];

  const handleSelectClassification = (choice) => {
    setSelectedAnswer(choice);
    if (choice === activeBar.classification) {
      setFeedback({
        isCorrect: true,
        message: `CORRECT: ${activeBar.explanation}`,
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `MISCOUNT ON ${activeBar.name}: Correct is "${activeBar.classification}". ${activeBar.explanation}`,
      });
    }
  };

  const handleNextBar = () => {
    if (currentStep < PULLBACK_SEQUENCE.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    }
  };

  const handleReset = () => {
    setCurrentStep(2);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  // SVG coordinate helpers (scale 5014-5026 to height 180)
  const priceToY = (price) => {
    const minP = 5014;
    const maxP = 5026;
    return 180 - ((price - minP) / (maxP - minP)) * 160 - 10;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-900/60">
            Interactive Capstone Lab 3.1
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            High 1 / High 2 Pullback Practice Trainer
          </h3>
          <p className="text-xs text-slate-400">
            Master the Brooks bar counting methodology: identify H1, inside-bar pauses, and high-probability H2 entries.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-950 rounded border border-slate-800 self-start md:self-auto">
          Inspecting: <strong className="text-blue-400">{activeBar.name}</strong> / 7
        </span>
      </div>

      {/* LAB EXERCISE GUIDANCE CARD */}
      <div className="p-4 bg-blue-950/20 border border-blue-900/50 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
          <span>🧪</span> Lab Exercise: Precision Bar Counting
        </div>
        <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed font-sans">
          <li><strong>Examine the Current Bar:</strong> Compare the high of the highlighted bar against the high of the immediately preceding bar.</li>
          <li><strong>Apply the Rule:</strong> If the high exceeds the prior high, it is a <strong>High 1</strong> (or <strong>High 2</strong> if after Leg 1). If the high is lower and range is contained, it is an <strong>Inside Bar (Pause)</strong>.</li>
          <li><strong>Click Your Classification:</strong> Verify against institutional execution rules, then click <strong>Step Next Bar ➔</strong>.</li>
        </ol>
      </div>

      {/* MAIN LAB WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART DISPLAY (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-2">
            <span>PULLBACK STRUCTURE (ES 5-MIN)</span>
            <span>20 EMA PULLBACK BENCHMARK</span>
          </div>

          <div className="w-full h-64 flex items-center justify-center relative">
            <svg className="w-full h-full" viewBox="0 0 380 190">
              {/* Grid Lines */}
              <line x1="20" y1={priceToY(5025)} x2="360" y2={priceToY(5025)} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.75" />
              <text x="362" y={priceToY(5025) + 3} fill="#64748b" fontSize="8" fontFamily="monospace">5025</text>

              <line x1="20" y1={priceToY(5020)} x2="360" y2={priceToY(5020)} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.75" />
              <text x="362" y={priceToY(5020) + 3} fill="#64748b" fontSize="8" fontFamily="monospace">5020</text>

              {/* 20 EMA line at 5016.5 */}
              <path d="M 20 170 Q 180 168 360 162" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="260" y="156" fill="#38bdf8" fontSize="8" fontFamily="monospace">20 EMA Support</text>

              {/* Render Bars up to currentStep */}
              {PULLBACK_SEQUENCE.slice(0, currentStep + 1).map((bar, idx) => {
                const x = 40 + idx * 45;
                const openY = priceToY(bar.open);
                const closeY = priceToY(bar.close);
                const highY = priceToY(bar.high);
                const lowY = priceToY(bar.low);
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(Math.abs(closeY - openY), 3);
                const isBull = bar.type === 'bull';
                const isCurrent = idx === currentStep;

                return (
                  <g key={bar.id}>
                    {/* Wick */}
                    <line
                      x1={x + 10}
                      y1={highY}
                      x2={x + 10}
                      y2={lowY}
                      stroke={isBull ? '#10b981' : '#f43f5e'}
                      strokeWidth="2"
                    />
                    {/* Body */}
                    <rect
                      x={x}
                      y={bodyTop}
                      width="20"
                      height={bodyHeight}
                      fill={isBull ? '#065f46' : '#4c0519'}
                      stroke={isBull ? '#10b981' : '#f43f5e'}
                      strokeWidth="1.5"
                      rx="1"
                    />
                    {/* Current Highlight Marker */}
                    {isCurrent && (
                      <circle cx={x + 10} cy={highY - 10} r="3.5" fill="#38bdf8" />
                    )}
                    {/* Bar Label */}
                    <text
                      x={x + 10}
                      y="185"
                      fill={isCurrent ? '#38bdf8' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isCurrent ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      B{bar.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
            <span>Inspecting: <strong className="text-slate-200">{activeBar.name}</strong></span>
            <span>High: <strong className="text-blue-300">{activeBar.high.toFixed(2)}</strong></span>
            <span>Prior High: <strong className="text-slate-300">{priorBar.high.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* CLASSIFICATION TERMINAL (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              BAR COUNTING TERMINAL
            </span>
            <h4 className="text-base font-bold text-slate-100">
              How is {activeBar.name} classified in this pullback?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare {activeBar.name}&apos;s high against {priorBar.name}&apos;s high. Does it create an attempt to resume the trend, pause the count, or continue downward?
            </p>
          </div>

          {/* Classification Options */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              'High 1 (H1)',
              'High 2 (H2)',
              'Inside Bar (Pause)',
              'Down Leg Bar',
            ].map((option) => (
              <button
                key={option}
                onClick={() => handleSelectClassification(option)}
                className={`py-3 px-2 rounded-lg border text-xs font-mono font-semibold transition-all ${
                  selectedAnswer === option
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback Area */}
          {feedback && (
            <div
              className={`p-4 rounded-lg border text-xs leading-relaxed font-mono ${
                feedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={handleReset}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono transition-colors"
            >
              ↺ Reset
            </button>
            <button
              onClick={handleNextBar}
              disabled={currentStep >= PULLBACK_SEQUENCE.length - 1}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              {currentStep < PULLBACK_SEQUENCE.length - 1 ? 'Step Next Bar ➔' : 'Pullback Sequence Complete ✓'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
