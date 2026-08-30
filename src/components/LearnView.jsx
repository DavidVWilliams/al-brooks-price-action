// Version: v1.1
import { useState } from 'react'
import data from '../data/curriculumData.json'

export default function LearnView() {
  const modules = data.modules;
  const [selectedModule, setSelectedModule] = useState(modules[0]);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Exercise state
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Handle sidebar switching & reset internal states
  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleNextCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % total);
  };

  const handleSelectOption = (index) => {
    setSelectedOption(index);
    setShowExplanation(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0 h-48 md:h-full">
        <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curriculum Modules</h3>
          <span className="text-[10px] font-mono text-slate-500">v1.1</span>
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
            Active Module ({selectedModule.type})
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-2">{selectedModule.title}</h2>
        </div>

        {/* Dynamic content container */}
        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          
          {/* LESSON TYPE */}
          {selectedModule.type === 'lesson' && selectedModule.content && (
            <div className="space-y-6 max-w-xl text-left w-full">
              <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                {selectedModule.content.summary}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Key Takeaways:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                  {selectedModule.content.keyTakeaways.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono text-center">
                [ SVG Diagram Container Placeholder ]
              </div>
            </div>
          )}

          {/* FLASHCARD TYPE */}
          {selectedModule.type === 'flashcard' && selectedModule.flashcards && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Flashcard {currentCardIndex + 1} of {selectedModule.flashcards.length}</span>
                <span>Click card to flip</span>
              </div>
              
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-slate-700 transition-all select-none relative"
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
                onClick={() => handleNextCard(selectedModule.flashcards.length)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Next Flashcard ➔
              </button>
            </div>
          )}

          {/* EXERCISE TYPE */}
          {selectedModule.type === 'exercise' && selectedModule.exercise && (
            <div className="w-full max-w-lg space-y-6 text-left bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Practice Challenge</span>
                <p className="text-sm font-medium text-slate-200">{selectedModule.exercise.prompt}</p>
              </div>

              <div className="space-y-2">
                {selectedModule.exercise.options.map((option, index) => {
                  let btnStyle = "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700";
                  if (showExplanation) {
                    if (index === selectedModule.exercise.correctIndex) {
                      btnStyle = "border-emerald-500 bg-emerald-950/30 text-emerald-300";
                    } else if (index === selectedOption) {
                      btnStyle = "border-rose-500 bg-rose-950/30 text-rose-300";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !showExplanation && handleSelectOption(index)}
                      disabled={showExplanation}
                      className={`w-full p-3 rounded-lg border text-sm text-left transition-all ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 animate-fadeIn">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Explanation:</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedModule.exercise.explanation}</p>
                  <button 
                    onClick={() => { setSelectedOption(null); setShowExplanation(false); }}
                    className="mt-2 text-xs text-blue-400 hover:underline font-medium"
                  >
                    Try Again ↺
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
