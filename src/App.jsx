import { useState } from 'react'
import AIDrawer from './components/AIDrawer'

export default function App() {
  const [activeView, setActiveView] = useState('learn'); // 'learn' or 'simulator'
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans relative">
      
      {/* Top Header & Navigation */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-10">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-base md:text-lg font-bold text-blue-400 tracking-tight">
            Al Brooks <span className="text-slate-400 font-normal hidden sm:inline">Price Action Mastery</span>
          </h1>
        </div>

        {/* View Switcher Tabs & AI Toggle */}
        <div className="flex items-center gap-2">
          <nav className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setActiveView('learn')}
              className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-colors ${activeView === 'learn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              📖 Learn
            </button>
            <button 
              onClick={() => setActiveView('simulator')}
              className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-colors ${activeView === 'simulator' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🎮 Simulator
            </button>
          </nav>

          <button 
            onClick={() => setIsAIDrawerOpen(!isAIDrawerOpen)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>🤖</span> <span className="hidden sm:inline">AI Mentor</span>
          </button>
        </div>

      </header>

      {/* Main Content Area (Switches between Learn Mode and Simulator Mode) */}
      <main className="flex-1 overflow-hidden relative flex bg-slate-950">
        
        {/* Learn View Shell */}
        {activeView === 'learn' && (
          <div className="absolute inset-0 flex flex-col md:flex-row">
            {/* Curriculum Sidebar Placeholder */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 p-4 overflow-y-auto shrink-0 h-48 md:h-full">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Curriculum Navigation</h3>
              <p className="text-sm text-slate-400">Sidebar modules will load here...</p>
            </div>
            {/* Main Lesson Content Placeholder */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-slate-200 mb-2">Welcome to the Classroom</h2>
              <p className="text-sm text-slate-400 max-w-md">Select a module from the sidebar to begin learning Al Brooks concepts, complete interactive flashcards, and practice test questions.</p>
            </div>
          </div>
        )}

        {/* Simulator View Shell */}
        {activeView === 'simulator' && (
          <div className="absolute inset-0 flex flex-col">
            {/* Simulator Chart & Controls Placeholder */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-slate-200 mb-2">Trading Simulator & Chart Playback</h2>
              <p className="text-sm text-slate-400 max-w-md mb-4">Practice reading bars, testing the Trader's Equation, and executing trades on historical ES, NQ, and MGC data.</p>
              <div className="border border-slate-800 border-dashed rounded-xl p-12 w-full max-w-2xl bg-slate-900/20 text-slate-600 font-mono text-sm">
                [ Interactive SVG Chart & Playback Controls Render Area ]
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Slide-out AI Mentor Drawer */}
      <AIDrawer isOpen={isAIDrawerOpen} onClose={() => setIsAIDrawerOpen(false)} />

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-slate-800 flex items-center justify-between px-4 text-xs text-slate-500 bg-slate-900 shrink-0 z-10">
        <span>Mastery Level: Novice</span>
        <span>Mode: {activeView === 'learn' ? 'Classroom' : 'Trading Desk'}</span>
      </footer>

    </div>
  )
}
