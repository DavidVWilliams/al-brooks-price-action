// Version: v1.0 - Tier 0 Interactive Dual-Engine Architecture Diagram
// Visualizes the feedback loop: Theory -> Execution -> Mathematical Audit.

import { useState } from 'react';

export default function DualEngineArchitectureDiagram() {
  const [activeStep, setActiveStep] = useState(0); // 0 = Idle, 1 = Learn, 2 = Simulate, 3 = Audit

  const handleNextStep = () => {
    setActiveStep((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  const handleReset = () => {
    setActiveStep(0);
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
              The Master Feedback Loop & Expectancy Audit
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trace how a price action concept becomes a mathematically audited, positive-expectancy trade.
          </p>
        </div>
      </div>

      {/* EXPLICIT LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Click <strong className="text-slate-100">Step Through Cycle</strong> to begin the feedback loop.</li>
          <li>Watch the data flow from theoretical learning (Node 1) into simulated risk execution (Node 2).</li>
          <li>Observe the critical final step (Node 3): The AI Mentor calculates the Trader's Equation to ensure the setup has a positive mathematical edge.</li>
        </ol>
      </div>

      {/* 3-NODE ARCHITECTURE CANVAS */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Connection Lines (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-slate-800 -translate-y-1/2 z-0">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-in-out" 
            style={{ width: activeStep === 0 ? '0%' : activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}
          />
        </div>

        {/* NODE 1: LEARN MODE */}
        <div className={`relative z-10 w-full md:w-1/3 p-4 rounded-xl border-2 transition-all duration-500 ${
          activeStep === 1 ? 'bg-blue-900/40 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-900 border-slate-700 opacity-60'
        }`}>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${activeStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              📖
            </div>
            <h4 className="font-bold text-slate-100">1. Learn Mode</h4>
            <p className="text-xs text-slate-400">Theory & Structural Recognition</p>
          </div>
        </div>

        {/* NODE 2: SIMULATOR */}
        <div className={`relative z-10 w-full md:w-1/3 p-4 rounded-xl border-2 transition-all duration-500 ${
          activeStep === 2 ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-700 opacity-60'
        }`}>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${activeStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              📈
            </div>
            <h4 className="font-bold text-slate-100">2. Simulator</h4>
            <p className="text-xs text-slate-400">Execution, Sizing & Stop Discipline</p>
          </div>
        </div>

        {/* NODE 3: AI MENTOR */}
        <div className={`relative z-10 w-full md:w-1/3 p-4 rounded-xl border-2 transition-all duration-500 ${
          activeStep === 3 ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-slate-900 border-slate-700 opacity-60'
        }`}>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${activeStep === 3 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              🤖
            </div>
            <h4 className="font-bold text-slate-100">3. AI Mentor</h4>
            <p className="text-xs text-slate-400">Trader's Equation Expectancy Audit</p>
          </div>
        </div>

      </div>

      {/* DYNAMIC TELEMETRY PANEL */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 min-h-[140px] flex items-center">
        {activeStep === 0 && (
          <div className="text-sm text-slate-400 text-center w-full font-mono">
            System Idle. Click "Step Through Cycle" to trace a High 2 pullback setup.
          </div>
        )}
        
        {activeStep === 1 && (
          <div className="w-full space-y-2 animate-fadeIn">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold block">Current Action: Studying Setup</span>
            <p className="text-sm text-slate-200">
              The student reads the theory for the <strong className="text-white">High 2 Bull Flag</strong> at the 20-period Exponential Moving Average (EMA). 
            </p>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">Base Probability (P):</span> ~60% Win Rate in strong trends.
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="w-full space-y-2 animate-fadeIn">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">Current Action: Risking Capital in Simulator</span>
            <p className="text-sm text-slate-200">
              The student identifies a High 2 on the ES 5-minute chart and executes a stop order.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs font-mono">
                Entry: <strong className="text-white">5020.00</strong>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-rose-400">
                Stop: <strong>5018.00</strong> (-$100)
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-emerald-400">
                Target: <strong>5024.00</strong> (+$200)
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="w-full space-y-2 animate-fadeIn">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">Current Action: Mathematical Audit</span>
            <p className="text-sm text-slate-200">
              The AI Mentor intercepts the completed trade and computes the Trader's Equation to ensure long-term edge.
            </p>
            <div className="p-3 bg-amber-950/20 rounded border border-amber-900/50 text-xs font-mono space-y-1">
              <div><span className="text-slate-400">Expectancy (E) = </span> (Win% × Reward) - (Loss% × Risk)</div>
              <div><span className="text-slate-400">E = </span> (0.60 × $200) - (0.40 × $100)</div>
              <div><span className="text-slate-400">E = </span> $120 - $40 = <strong className="text-emerald-400">+$80 Edge per trade</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded text-xs font-mono transition-colors ${activeStep > 0 ? 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'}`}
          disabled={activeStep === 0}
        >
          ↺ Reset
        </button>
        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-sm transition-colors"
        >
          {activeStep === 0 ? 'Start Learning Cycle' : activeStep === 3 ? 'Restart Cycle' : 'Step to Next Node ➔'}
        </button>
      </div>

    </div>
  );
}
