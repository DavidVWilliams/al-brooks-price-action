// Version: v2.0
import { useState } from 'react'
import data from '../data/curriculumData.json'

export default function LearnView() {
  const modules = data.modules;
  const [selectedModule, setSelectedModule] = useState(modules[0]);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0 h-48 md:h-full">
        <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tier 1: Foundations</h3>
          <span className="text-[10px] font-mono text-emerald-400">v2.0 Deep-Dive</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleSelectModule(mod)}
              className={`w-full px-3 py-2.5 rounded-lg text-xs md:text-sm text-left transition-colors flex items-center justify-between ${selectedModule.id === mod.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <span className="truncate">{mod.title}</span>
              <span className="text-xs text-slate-500 font-mono ml-2">
                {mod.type === 'comprehensive_lesson' ? '📖' : '⚡'}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Lesson Reading Area */}
      <section className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col max-w-4xl mx-auto w-full">
        <div className="mb-8 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest bg-blue-950/50 px-2.5 py-1 rounded border border-blue-900/50">
              Mastery Curriculum
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">{selectedModule.title}</h2>
          </div>
          {selectedModule.estimatedReadTime && (
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
              ⏱ {selectedModule.estimatedReadTime} read
            </span>
          )}
        </div>

        {/* COMPREHENSIVE LESSON RENDERER */}
        {selectedModule.type === 'comprehensive_lesson' && selectedModule.sections && (
          <div className="space-y-10 text-left">
            
            {/* Sections Loop */}
            {selectedModule.sections.map((sec, idx) => (
              <div key={idx} className="space-y-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">0{idx + 1}</span>
                  {sec.heading}
                </h3>
                
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {sec.content}
                </p>

                {/* Key Rule Callout Box */}
                {sec.keyRule && (
                  <div className="p-4 bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Core Brooks Rule:</span>
                    <p className="text-xs md:text-sm text-slate-200 font-medium">{sec.keyRule}</p>
                  </div>
                )}

                {/* Bar Breakdown Example Box */}
                {sec.barBreakdownExample && (
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">🧠 Institutional Psychology Breakdown:</span>
                    <p className="text-xs text-slate-400 font-mono"><strong>Scenario:</strong> {sec.barBreakdownExample.scenario}</p>
                    <p className="text-xs text-slate-300 leading-relaxed"><strong>Mechanics:</strong> {sec.barBreakdownExample.psychology}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Embedded SVG Chart Illustration Box */}
            {selectedModule.chartIllustration && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200">📊 {selectedModule.chartIllustration.title}</h4>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">Interactive SVG</span>
                </div>
                <p className="text-xs text-slate-400">{selectedModule.chartIllustration.description}</p>
                
                {/* SVG Schematic Mockup */}
                <div className="w-full h-48 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                  <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Bull Bar */}
                    <line x1="100" y1="20" x2="100" y2="130" stroke="currentColor" strokeWidth="2" />
                    <rect x="85" y="40" width="30" height="70" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                    <text x="85" y="15" fill="#94a3b8" fontSize="10" fontFamily="monospace">Bull Trend Bar</text>
                    
                    {/* Doji Bar */}
                    <line x1="250" y1="20" x2="250" y2="130" stroke="currentColor" strokeWidth="2" />
                    <rect x="235" y="73" width="30" height="4" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                    <text x="240" y="15" fill="#94a3b8" fontSize="10" fontFamily="monospace">Doji (Equilibrium)</text>
                  </svg>
                </div>
              </div>
            )}

          </div>
        )}

        {/* FLASHCARD RENDERER */}
        {selectedModule.type === 'flashcard' && selectedModule.flashcards && (
          <div className="w-full max-w-md mx-auto space-y-4 pt-10">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Flashcard {currentCardIndex + 1} of {selectedModule.flashcards.length}</span>
              <span>Click card to flip</span>
            </div>
            
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-slate-700 transition-all select-none text-center"
            >
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-mono text-blue-400">Question</span>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {selectedModule.flashcards[currentCardIndex].question}
                  </h3>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-mono text-emerald-400">Answer</span>
                  <p className="text-base text-slate-200 font-medium">
                    {selectedModule.flashcards[currentCardIndex].answer}
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => (prev + 1) % selectedModule.flashcards.length); }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Next Flashcard ➔
            </button>
          </div>
        )}

      </section>

    </div>
  )
}
