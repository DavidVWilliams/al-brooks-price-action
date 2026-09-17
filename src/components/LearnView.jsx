// Version: v7.1 - Preserved All SVGs, Quizzes & Flashcards with Mobile Syllabus Drawer
import { useState, useEffect } from 'react';
import curriculumData from '../data/curriculumData.js';
import { getInteractiveLab } from './interactive/LabRegistry.jsx';

export default function LearnView({ activePhase, onSelectPhase }) {
  const allModules = (curriculumData.tiers || []).flatMap((tier) =>
    (tier.modules || []).map((m) => ({ ...m, tierTitle: tier.title, tierId: tier.id }))
  );

  const [selectedModuleId, setSelectedModuleId] = useState(
    allModules[0]?.id || 'tier0-mod-0.1'
  );
  const [openTiers, setOpenTiers] = useState({ 'tier-0': true, 'tier-1': true, 'tier-3': true });
  const [isMobileSyllabusOpen, setIsMobileSyllabusOpen] = useState(false);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const selectedModule =
    allModules.find((m) => m.id === selectedModuleId) || allModules[0] || {};
  const currentIndex = allModules.findIndex((m) => m.id === selectedModuleId);

  useEffect(() => {
    if (selectedModule?.tierId) {
      setOpenTiers((prev) => ({ ...prev, [selectedModule.tierId]: true }));
    }
    // Reset quiz and flashcard states on module change
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);
  }, [selectedModuleId]);

  const toggleTier = (tierId) => {
    setOpenTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }));
  };

  const handleSelectModule = (id) => {
    setSelectedModuleId(id);
    setIsMobileSyllabusOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < allModules.length - 1) {
      setSelectedModuleId(allModules[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedModuleId(allModules[currentIndex - 1].id);
    }
  };

  // Flashcard Handlers
  const handleNextCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % total);
  };
  const handlePrevCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + total) % total);
  };

  // Quiz Handlers
  const handleSelectQuizOption = (index, correctIndex) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === correctIndex) setQuizScore((prev) => prev + 1);
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

  const InteractiveLabComponent = getInteractiveLab(
    selectedModule?.id,
    selectedModule?.title
  );

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row bg-slate-950 text-slate-100 min-h-0 relative">
      
      {/* 📱 MOBILE BREADCRUMB & SYLLABUS BAR (< md) */}
      <div className="md:hidden sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block truncate">
            {selectedModule.tierTitle || 'Curriculum'}
          </span>
          <span className="text-xs font-bold text-slate-100 truncate block">
            {selectedModule.title}
          </span>
        </div>
        <button
          onClick={() => setIsMobileSyllabusOpen(!isMobileSyllabusOpen)}
          className="shrink-0 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-mono font-semibold"
        >
          {isMobileSyllabusOpen ? '✕ Close' : '📑 Syllabus'}
        </button>
      </div>

      {/* 🧭 SYLLABUS SIDEBAR (Desktop: sticky sidebar | Mobile: modal overlay) */}
      <aside
        className={`
          md:w-80 md:shrink-0 md:border-r border-slate-800 bg-slate-900/40 md:flex flex-col
          ${isMobileSyllabusOpen 
            ? 'fixed inset-x-0 top-24 bottom-0 z-30 bg-slate-950 p-4 overflow-y-auto flex' 
            : 'hidden md:flex h-auto max-h-full overflow-y-auto p-3'}
        `}
      >
        <div className="pb-3 border-b border-slate-800 mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              Course Syllabus
            </h2>
            <p className="text-[11px] text-slate-500">Al Brooks Price Action</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950 border border-blue-900 text-blue-400 rounded-full font-semibold">
            {allModules.length} Lessons
          </span>
        </div>

        <div className="space-y-2 pb-12 md:pb-4">
          {(curriculumData.tiers || []).map((tier) => {
            const isOpen = !!openTiers[tier.id];
            const hasActiveModule = (tier.modules || []).some((m) => m.id === selectedModuleId);

            return (
              <div
                key={tier.id}
                className={`rounded-lg border transition-colors ${
                  hasActiveModule
                    ? 'border-blue-900/60 bg-slate-900/50'
                    : 'border-slate-800/70 bg-slate-900/20'
                }`}
              >
                <button
                  onClick={() => toggleTier(tier.id)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <span className="truncate pr-2">{tier.title}</span>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0">
                    {tier.modules?.length || 0} {isOpen ? '▾' : '▸'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-2 pb-2 pt-1 space-y-1 border-t border-slate-800/50">
                    {(tier.modules || []).map((mod) => {
                      const isSelected = mod.id === selectedModuleId;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleSelectModule(mod.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-start gap-2 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-medium shadow-sm'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                          }`}
                        >
                          <span className="font-mono text-[10px] opacity-60 shrink-0 mt-0.5">
                            {mod.type === 'comprehensive_lesson' ? '📖' : mod.type === 'flashcard' ? '⚡' : '🎯'}
                          </span>
                          <span className="truncate">{mod.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* 📖 MAIN WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
          
          {/* Module Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-900/60">
                {selectedModule.tierTitle || 'Lesson'}
              </span>
              {selectedModule.estimatedReadTime && (
                <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                  ⏱ {selectedModule.estimatedReadTime} read
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-100 mt-2">
              {selectedModule.title}
            </h1>
          </div>

          {/* STATIC VECTOR CHART ILLUSTRATION */}
          {selectedModule.chartIllustration && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                📊 {selectedModule.chartIllustration.title || 'Technical Schematic'}
              </h4>
              {selectedModule.chartIllustration.description && (
                <p className="text-xs text-slate-400">{selectedModule.chartIllustration.description}</p>
              )}
              <div className="w-full h-44 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center p-4">
                {/* Fallback & Visual Vectors */}
                <svg className="w-full h-full max-h-36" viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="80" y1="20" x2="80" y2="120" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="68" y="35" width="24" height="65" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" rx="1" />
                  <text x="80" y="132" fill="#3b82f6" fontSize="9" fontFamily="monospace" textAnchor="middle">Signal Bar</text>
                  
                  <line x1="200" y1="15" x2="200" y2="105" stroke="#10b981" strokeWidth="2" />
                  <rect x="188" y="25" width="24" height="60" fill="#065f46" stroke="#10b981" strokeWidth="1.5" rx="1" />
                  <text x="200" y="132" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">Entry Bar (+1t)</text>
                  
                  <line x1="20" y1="34" x2="380" y2="34" stroke="#475569" strokeDasharray="3 3" strokeWidth="1" />
                  <text x="375" y="30" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">Trigger Level</text>
                </svg>
              </div>
            </div>
          )}

          {/* COMPREHENSIVE LESSON SECTIONS */}
          {selectedModule.sections && selectedModule.sections.length > 0 && (
            <div className="space-y-6">
              {selectedModule.sections.map((sec, idx) => (
                <section key={idx} className="space-y-3 bg-slate-900/30 border border-slate-800/80 p-5 rounded-xl">
                  <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-xs">§{idx + 1}</span>
                    {sec.heading}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {sec.content}
                  </p>
                  {sec.keyRule && (
                    <div className="mt-3 p-3 bg-amber-950/20 border-l-2 border-amber-500 rounded-r-lg text-xs text-amber-200">
                      <strong className="font-mono uppercase text-[10px] tracking-wider block text-amber-400 mb-0.5">
                        Core Brooks Axiom
                      </strong>
                      {sec.keyRule}
                    </div>
                  )}
                  {sec.barBreakdownExample && (
                    <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1 text-xs">
                      <span className="text-amber-400 font-mono uppercase text-[10px] font-bold block">
                        🧠 Institutional Psychology Breakdown
                      </span>
                      <p className="text-slate-400 font-mono text-[11px]">
                        <strong>Scenario:</strong> {sec.barBreakdownExample.scenario}
                      </p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <strong>Mechanics:</strong> {sec.barBreakdownExample.psychology}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* CAPSTONE INTERACTIVE LAB */}
          {InteractiveLabComponent && (
            <section className="pt-2">
              <InteractiveLabComponent />
            </section>
          )}

          {/* FLASHCARD MODE */}
          {selectedModule.type === 'flashcard' && selectedModule.flashcards && (
            <div className="w-full max-w-md mx-auto space-y-4 pt-6">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Card {currentCardIndex + 1} of {selectedModule.flashcards.length}</span>
                <span>Click to flip</span>
              </div>
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-56 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-slate-700 transition-all text-center select-none shadow-xl"
              >
                {!isFlipped ? (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono text-blue-400 tracking-wider">Question</span>
                    <h3 className="text-base font-semibold text-slate-100">
                      {selectedModule.flashcards[currentCardIndex].question}
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider">Answer</span>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                      {selectedModule.flashcards[currentCardIndex].answer}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrevCard(selectedModule.flashcards.length)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-semibold"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={() => handleNextCard(selectedModule.flashcards.length)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-semibold shadow"
                >
                  Next ➔
                </button>
              </div>
            </div>
          )}

          {/* QUIZ MODE */}
          {selectedModule.type === 'quiz' && selectedModule.questions && (
            <div className="w-full max-w-xl mx-auto space-y-6 pt-4">
              {!quizCompleted ? (
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-5 shadow-xl">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                    <span>Question {currentQuestionIndex + 1} of {selectedModule.questions.length}</span>
                    <span>Score: {quizScore}</span>
                  </div>

                  <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed">
                    {selectedModule.questions[currentQuestionIndex].prompt}
                  </p>

                  <div className="space-y-2.5">
                    {selectedModule.questions[currentQuestionIndex].options.map((opt, idx) => {
                      let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
                      if (showExplanation) {
                        if (idx === selectedModule.questions[currentQuestionIndex].correctIndex) {
                          btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200";
                        } else if (idx === selectedOption) {
                          btnStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                        } else {
                          btnStyle = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx, selectedModule.questions[currentQuestionIndex].correctIndex)}
                          disabled={showExplanation}
                          className={`w-full p-3.5 rounded-lg border text-xs md:text-sm text-left transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="font-mono text-xs opacity-60 mt-0.5">0{idx + 1}</span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? '✓ Correct' : '✕ Incorrect'}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedModule.questions[currentQuestionIndex].explanation}
                      </p>
                      <button
                        onClick={() => handleNextQuizQuestion(selectedModule.questions.length)}
                        className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                      >
                        {currentQuestionIndex + 1 < selectedModule.questions.length ? 'Next Question ➔' : 'Complete Quiz 🏆'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center space-y-4 shadow-2xl">
                  <span className="text-3xl">🏆</span>
                  <h3 className="text-lg font-bold text-slate-100">Milestone Quiz Completed</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Score: <strong className="text-emerald-400">{quizScore}</strong> / {selectedModule.questions.length}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setQuizScore(0);
                      setQuizCompleted(false);
                      setShowExplanation(false);
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Retake Quiz ↺
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FOOTER NAVIGATION */}
          <footer className="sticky bottom-0 bg-slate-950/90 backdrop-blur border border-slate-800 py-3 px-4 rounded-xl flex items-center justify-between gap-2 shadow-2xl">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-xs font-mono rounded-lg transition-colors border border-slate-800 text-slate-300"
            >
              ◀ Prev
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              Module {currentIndex + 1} of {allModules.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex >= allModules.length - 1}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-semibold rounded-lg transition-colors text-white shadow"
            >
              Next ▶
            </button>
          </footer>

        </div>
      </div>

    </div>
  );
}
