export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center px-4 bg-slate-900 shrink-0">
        <h1 className="text-lg font-bold text-blue-400">Al Brooks Price Action Mastery</h1>
      </header>

      {/* Main Grid Container (Pre-scaffolded for Split Panes) */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800 overflow-hidden">
         
         {/* Left Pane Shell */}
         <section className="bg-slate-950 p-4 overflow-y-auto flex flex-col">
            <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Left Pane Space</h2>
         </section>
         
         {/* Right Pane Shell */}
         <section className="bg-slate-950 p-4 overflow-y-auto flex flex-col">
            <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Right Pane Space</h2>
         </section>

      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-slate-800 flex items-center px-4 text-xs text-slate-500 bg-slate-900 shrink-0">
        <span>Mastery Level: Novice</span>
      </footer>

    </div>
  )
}
