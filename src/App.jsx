import { useState } from 'react'
import LeftPane from './components/LeftPane'
import RightPane from './components/RightPane'

export default function App() {
  // State to manage mobile tabs. Default to Curriculum.
  const [activeTab, setActiveTab] = useState('curriculum');

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
        <h1 className="text-lg font-bold text-blue-400">Al Brooks Price Action Mastery</h1>
      </header>

      {/* Mobile Tab Navigation (Hidden on md screens and up) */}
      <nav className="flex md:hidden border-b border-slate-800 bg-slate-900 shrink-0">
        <button 
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 ${activeTab === 'curriculum' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
        >
          Curriculum & AI
        </button>
        <button 
          onClick={() => setActiveTab('chart')}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 ${activeTab === 'chart' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
        >
          Chart & Sim
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden relative bg-slate-800">
         {/* 
            Desktop: Grid side-by-side. 
            Mobile: Conditionally display based on activeTab.
         */}
         <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-px">
            
            {/* Left Pane (Curriculum/AI) */}
            <div className={`h-full ${activeTab === 'curriculum' ? 'block' : 'hidden'} md:block`}>
               <LeftPane />
            </div>

            {/* Right Pane (Chart/Simulator) */}
            <div className={`h-full ${activeTab === 'chart' ? 'block' : 'hidden'} md:block`}>
               <RightPane />
            </div>

         </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-slate-800 flex items-center px-4 text-xs text-slate-500 bg-slate-900 shrink-0">
        <span>Mastery Level: Novice</span>
      </footer>

    </div>
  )
}
