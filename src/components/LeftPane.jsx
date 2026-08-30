export default function LeftPane() {
  return (
    <section className="bg-slate-950 flex flex-col h-full overflow-hidden w-full">
      
      {/* Curriculum Area */}
      <div className="flex-1 overflow-y-auto p-4 border-b border-slate-800">
        <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Curriculum Engine</h2>
        <div className="text-slate-400 text-sm">
          Placeholder for module text and interactive exercises.
        </div>
      </div>
      
      {/* AI Mentor Area */}
      <div className="h-1/3 min-h-[200px] md:min-h-[250px] overflow-y-auto p-4 bg-slate-900/50">
        <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">AI Mentor Chat</h2>
        <div className="text-slate-400 text-sm">
          Placeholder for objective Al Brooks glossary and chat interface.
        </div>
      </div>

    </section>
  )
}
