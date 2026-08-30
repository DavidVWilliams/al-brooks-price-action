import { useState } from 'react'

export default function LearnView() {
  // Mock modules matching Al Brooks curriculum structure
  const modules = [
    { id: 1, title: "1. Foundational Concepts: Trends vs. Trading Ranges", type: "lesson" },
    { id: 2, title: "2. Breakouts, Failed Breakouts & Spikes", type: "lesson" },
    { id: 3, title: "3. Pullbacks & First Pullback Sequences", type: "lesson" },
    { id: 4, title: "4. Flashcards: Acronyms & Key Definitions", type: "flashcard" },
    { id: 5, title: "5. Practice Exercise: Identify the Setup", type: "exercise" },
  ];

  const [selectedModule, setSelectedModule] = useState(modules[0]);

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0 h-48 md:h-full">
        <div className="p-3 border-b border-slate-800 bg-slate-900/80">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curriculum Modules</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className={`w-text-left w-full px-3 py-2.5 rounded-lg text-xs md:text-sm text-left transition-colors flex items-center justify-between ${selectedModule.id === mod.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <span className="truncate">{mod.title}</span>
              <span className="text-xs text-slate-500 font-mono ml-2">
                {mod.type === 'lesson' ? '📖' : mod.type === 'flashcard' ? '⚡' : '📝'}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Lesson Reading / Interactive Area */}
      <section className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col max-w-4xl mx-auto w-full">
        <div className="mb-6 pb-4 border-b border-slate-800">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest bg-blue-950/50 px-2 py-1 rounded border border-blue-900/50">
            Active Module
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">{selectedModule.title}</h2>
        </div>

        {/* Dynamic content placeholder depending on module type */}
        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          {selectedModule.type === 'lesson' && (
            <div className="space-y-4 max-w-xl text-left">
              <p className="text-slate-300 text-sm leading-relaxed">
                Welcome to this lesson. Here, the core concepts of Al Brooks' price action method will be broken down bar by bar. Text content and embedded SVG diagrams will render here in Phase 3.
              </p>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
                [ SVG Diagram Container Placeholder ]
              </div>
            </div>
          )}

          {selectedModule.type === 'flashcard' && (
            <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-lg text-center space-y-4">
              <span className="text-xs text-slate-500 font-mono">Flashcard 1 of 10</span>
              <h3 className="text-lg font-semibold text-slate-200">What does AIC stand for?</h3>
              <p className="text-xs text-slate-500 italic">(Click to flip)</p>
            </div>
          )}

          {selectedModule.type === 'exercise' && (
            <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-lg text-center space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Practice Challenge</h3>
              <p className="text-sm text-slate-400">Identify the breakout bar in the chart representation below.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
