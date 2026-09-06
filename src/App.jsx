// Version: v1.1 - Root Container with Learn, Simulator, and AI Mentor Integration
import { useState } from 'react';
import LearnView from './components/LearnView';
import AIMentorDrawer from './components/AIMentorDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-sm md:text-base font-bold text-slate-100 tracking-tight">
            Al Brooks Price Action Mastery
          </h1>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'learn'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>📖</span> Learn
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>🎮</span> Simulator
          </button>

          <button
            onClick={() => setIsMentorOpen(true)}
            className="ml-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>🤖</span> AI Mentor
          </button>
        </div>
      </header>

      {/* Primary Workspace View Area */}
      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'learn' && <LearnView />}
        {activeTab === 'simulator' && (
          <div className="h-full flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-sm">
            Simulator Engine shell ready for Phase 2, Issues #13 & #14.
          </div>
        )}
      </main>

      {/* Slide-out AI Mentor Drawer Overlay */}
      <AIMentorDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />
    </div>
  );
}
