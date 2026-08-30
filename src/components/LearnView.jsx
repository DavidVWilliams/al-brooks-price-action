// Version: v2.3 - Interactive Quizzes & Enterprise Layout
import { useState } from 'react'
import data from '../data/curriculumData.json'

export default function LearnView() {
  const modules = data.modules;
  const [selectedModule, setSelectedModule] = useState(modules[0]);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleNextCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % total);
  };

  const handlePrevCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + total) % total);
  };

  const handleSelectQuizOption = (index, correctIndex) => {
    if (showExplanation) return; // Prevent changing answer after selection
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = (total) => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < total) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0 h-48 md:h-full">
        <div className="p-3 border-b border-slate-800 bg-slate-900/85 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tier 1: Foundations</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 transition-colors">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleSelectModule(mod)}
              className={`w-full px-3 py-2.5 rounded-lg text-xs md:text-sm text-left transition-colors flex items-center justify-between ${selectedModule.id === mod.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <span className="truncate">{mod.title}</span>
              <span className="text-xs text-slate-500 font-mono ml-2">
                {mod.type === 'comprehensive_lesson' ? '📖' : mod.type === 'flashcard' ? '⚡' : '🎯'}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Full-Width Scrolling Area - Flush right scrollbar fix */}
      <div className="flex-1 overflow-y-auto bg-slate-950 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700">
        
        {/* Centered Content Wrapper */}
        <section className="p-6 md:p-12 flex flex-col max-w-4xl mx-auto w-full">
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
              {selectedModule.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">0{idx + 1}</span>
                    {sec.heading}
                  </h3>
                  
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {sec.content}
                  </p>

                  {sec.keyRule && (
                    <div className="p-4 bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Core Brooks Rule:</span>
                      <p className="text-xs md:text-sm text-slate-200 font-medium">{sec.keyRule}</p>
                    </div>
                  )}

                  {sec.barBreakdownExample && (
                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">🧠 Institutional Psychology Breakdown:</span>
                      <p className="text-xs text-slate-400 font-mono"><strong>Scenario:</strong> {sec.barBreakdownExample.scenario}</p>
                      <p className="text-xs text-slate-300 leading-relaxed"><strong>Mechanics:</strong> {sec.barBreakdownExample.psychology}</p>
                    </div>
                  )}
                </div>
              ))}

              {selectedModule.chartIllustration && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-200">📊 {selectedModule.chartIllustration.title}</h4>
                  <p className="text-xs text-slate-400">{selectedModule.chartIllustration.description}</p>
                  
                  <div className="w-full h-48 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                    {selectedModule.chartIllustration.svgType === 'bull_vs_bear' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
                        <rect x="105" y="40" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                        <text x="90" y="15" fill="#3b82f6" fontSize="10" fontFamily="monospace">Bull Trend Bar</text>
                        
                        <line x1="280" y1="20" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2" />
                        <rect x="265" y="35" width="30" height="75" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="2" />
                        <text x="255" y="15" fill="#f43f5e" fontSize="10" fontFamily="monospace">Bear Trend Bar</text>
                      </svg>
                    )}

                    {selectedModule.chartIllustration.svgType === 'doji_equilibrium' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
                        <rect x="105" y="40" width="30" height="70" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                        <text x="95" y="15" fill="#3b82f6" fontSize="10" fontFamily="monospace">Strong Trend</text>
                        
                        <line x1="280" y1="20" x2="280" y2="130" stroke="#94a3b8" strokeWidth="2" />
                        <rect x="265" y="73" width="30" height="4" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                        <text x="250" y="15" fill="#94a3b8" fontSize="10" fontFamily="monospace">Doji (Indecision)</text>
                      </svg>
                    )}
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

              <div className="flex gap-3">
                <button 
                  onClick={() => handlePrevCard(selectedModule.flashcards.length)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-semibold transition-colors"
                >
                  ◀ Previous
                </button>
                <button 
                  onClick={() => handleNextCard(selectedModule.flashcards.length)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Next ➔
                </button>
              </div>
            </div>
          )}

          {/* INTERACTIVE QUIZ RENDERER */}
          {selectedModule.type === 'quiz' && selectedModule.questions && (
            <div className="w-full max-w-xl mx-auto space-y-6 pt-4">
              {!quizCompleted ? (
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-6 shadow-xl">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                    <span>Question {currentQuestionIndex + 1} of {selectedModule.questions.length}</span>
                    <span>Score: {quizScore}</span>
                  </div>

                  <p className="text-base font-semibold text-slate-100 leading-relaxed">
                    {selectedModule.questions[currentQuestionIndex].prompt}
                  </p>

                  <div className="space-y-3">
                    {selectedModule.questions[currentQuestionIndex].options.map((option, idx) => {
                      let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
                      
                      if (showExplanation) {
                        if (idx === selectedModule.questions[currentQuestionIndex].correctIndex) {
                          btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium";
                        } else if (idx === selectedOption) {
                          btnStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                        } else {
                          btnStyle = "bg-slate-950/50 border-slate-900 text-slate-600 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx, selectedModule.questions[currentQuestionIndex].correctIndex)}
                          disabled={showExplanation}
                          className={`w-full p-4 rounded-xl border text-sm text-left transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="font-mono text-xs opacity-60 mt-0.5">0{idx + 1}</span>
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? '✓ Correct!' : '✕ Incorrect'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        {selectedModule.questions[currentQuestionIndex].explanation}
                      </p>
                      
                      <button
                        onClick={() => handleNextQuizQuestion(selectedModule.questions.length)}
                        className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        {currentQuestionIndex + 1 < selectedModule.questions.length ? 'Next Question ➔' : 'View Quiz Results 🏆'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center space-y-6 shadow-2xl">
                  <span className="text-4xl">🎉</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-100">Quiz Completed!</h3>
                    <p className="text-sm text-slate-400 font-mono">
                      You scored <strong className="text-emerald-400">{quizScore}</strong> out of <strong className="text-slate-200">{selectedModule.questions.length}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectModule(selectedModule)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Retake Quiz ↺
                  </button>
                </div>
              )}
            </div>
          )}

        </section>
      </div>

    </div>
  )
}
