// Version: v1.3 - Canonical Top Header with Phase Rail, View Switcher & AI Mentor Toggle
import { useState } from 'react';
import LearnView from './components/LearnView.jsx';
import SimulatorView from './components/SimulatorView.jsx';
import AIMentorDrawer from './components/AIMentorDrawer.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' | 'simulator'
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [activePhase, setActivePhase] = useState('tier0');

  const PHASES = [
    { id: 'tier0', label: '🚀 START HERE' },
    { id: 'tier1', label: '1. Foundations' },
    { id: 'tier2', label: '2. Market Dynamics' },
    { id: 'tier3', label: '3. Setup Engines' },
    { id: 'tier4', label: '4. Advanced Setups' },
    { id: 'tier5', label: '5. Math & Execution' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* CANONICAL TOP NAVBAR (Exact match to Image 3) */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Platform Title */}
        <div className="flex items-center gap-6">
          <span className="font-bold text-slate-100 text-sm md:text-base tracking-tight whitespace-nowrap">
            Al Brooks Price Action Mastery
          </span>

          {/* Center: Phase Navigation Rail */}
          {activeTab === 'learn' && (
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-6">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                PHASES :
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {PHASES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePhase(p.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      activePhase === p.id
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: View Switchers & AI Mentor */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'learn'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>📘</span> Learn
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>🎮</span> Simulator
          </button>

          <button
            onClick={() => setIsMentorOpen(!isMentorOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              isMentorOpen
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <span>🤖</span> AI Mentor
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 relative overflow-hidden flex w-full">
        {activeTab === 'learn' && (
          <LearnView activePhase={activePhase} onSelectPhase={setActivePhase} />
        )}
        {activeTab === 'simulator' && <SimulatorView />}
      </main>

      {/* PERSISTENT AI MENTOR DRAWER */}
      <AIMentorDrawer isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />
    </div>
  );
}
