export default function AIDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-50 transition-transform duration-300">
      
      {/* Drawer Header */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950 shrink-0">
        <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
          <span>🤖</span> AI Mentor (Factual Glossary)
        </h3>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white px-2 py-1 text-sm font-mono"
        >
          ✕ Close
        </button>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        <div className="bg-slate-950 p-3 rounded border border-slate-800 text-slate-300">
          <p className="font-semibold text-blue-300 mb-1">System Notice:</p>
          Ask any question regarding Al Brooks definitions, acronyms, or setup criteria. (Objective factual lookup only).
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask about a concept (e.g., High 2)..." 
            className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            disabled
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold shrink-0">
            Ask
          </button>
        </div>
      </div>

    </div>
  )
}
