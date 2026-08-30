import { useState } from 'react'
import AIDrawer from './components/AIDrawer'
import LearnView from './components/LearnView'
import SimulatorView from './components/SimulatorView'

export default function App() {
  const [activeView, setActiveView] = useState('learn'); // 'learn' or 'simulator'
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans relative">
      
      {/* Top Header & Navigation */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-base md:text-lg font-bold text-blue-400 tracking-tight">
            Al Brooks <span className="text-slate-400 font-normal hidden sm:inline">Price Action Mastery</span>
          </h1>
        </div>

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

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex bg-slate-950">
        {activeView === 'learn' ? <LearnView /> : <SimulatorView />}
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
