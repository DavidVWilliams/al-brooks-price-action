// Version: v5.6 - Canonical Accordion Syllabus, Static SVGs & Dynamic Micro-Labs
// Changelog:
// - Restored 12-vector static SVG illustration engine below lesson header.
// - Matched sidebar accordion naming & status indicators to Image 2.
// - Retained resilient bottom footer progression and dynamic LabRegistry integration.

import { useState, useMemo } from 'react';
import rawData from '../data/curriculumData.js';
import { getInteractiveLab } from './interactive/LabRegistry.jsx';

const TIERS = [
  { id: 'tier0', label: '🚀 START HERE' },
  { id: 'tier1', label: '1. Foundations' },
  { id: 'tier2', label: '2. Market Dynamics' },
  { id: 'tier3', label: '3. Setup Engines' },
  { id: 'tier4', label: '4. Advanced Setups' },
  { id: 'tier5', label: '5. Math & Execution' },
];

export default function LearnView() {
  const data = rawData?.modules ? rawData : (rawData?.curriculumData || { modules: [] });
  const modules = data.modules || [];

  const [selectedModule, setSelectedModule] = useState(modules[0] || {});

  // Determine active tier from selected module ID (e.g. "tier2-mod-2.1" -> "tier2")
  const currentTierId = selectedModule.id?.split('-')[0] || 'tier1';
  const [openTier, setOpenTier] = useState(currentTierId);

  // Group modules by tier
  const modulesByTier = useMemo(() => {
    const grouped = {};
    TIERS.forEach((t) => {
      grouped[t.id] = modules.filter((m) => m.id && m.id.startsWith(t.id));
    });
    return grouped;
  }, [modules]);

  // Current global index for footer progression
  const currentIndex = modules.findIndex((m) => m.id === selectedModule.id);

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
    const modTier = mod.id?.split('-')[0];
    if (modTier) setOpenTier(modTier);

    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handlePrevModule = () => {
    if (currentIndex > 0) {
      handleSelectModule(modules[currentIndex - 1]);
    }
  };

  const handleNextModule = () => {
    if (currentIndex < modules.length - 1) {
      handleSelectModule(modules[currentIndex + 1]);
    }
  };

  const toggleTierAccordion = (tierId) => {
    setOpenTier((prev) => (prev === tierId ? null : tierId));
  };

  // Flashcard handlers
  const handleNextCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % total);
  };

  const handlePrevCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + total) % total);
  };

  // Quiz handlers
  const handleSelectQuizOption = (index, correctIndex) => {
    if (showExplanation) return;
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

  // Resolve dynamic interactive micro-lab from LabRegistry
  const ActiveLabComponent = selectedModule?.id ? getInteractiveLab(selectedModule.id) : null;

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* SIDEBAR ACCORDION NAVIGATION */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 h-56 md:h-full select-none">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Course Syllabus
          </h3>
          <span className="text-xs font-mono text-blue-400 bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-900/60 font-medium">
            {modules.length} Lessons
          </span>
        </div>

        {/* Accordion Panels */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 transition-colors">
          {TIERS.map((tier) => {
            const tierList = modulesByTier[tier.id] || [];
            const isOpen = openTier === tier.id;

            return (
              <div key={tier.id} className="rounded-lg overflow-hidden border border-slate-800/60 bg-slate-900/30 mb-1">
                
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleTierAccordion(tier.id)}
                  className="w-full px-3 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{tier.label}</span>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
                    <span>{tierList.length}</span>
                    <span className={`transform transition-transform duration-200 text-xs ${isOpen ? 'rotate-90 text-blue-400' : ''}`}>
                      ▸
                    </span>
                  </div>
                </button>

                {/* Accordion Content Panel */}
                {isOpen && (
                  <div className="px-1 pb-1.5 pt-0.5 space-y-0.5 bg-slate-950/50 border-t border-slate-800/40">
                    {tierList.length === 0 ? (
                      <div className="px-3 py-2 text-[11px] font-mono text-slate-600 italic">
                        Modules queued for deployment...
                      </div>
                    ) : (
                      tierList.map((mod) => {
                        const isSelected = selectedModule.id === mod.id;
                        return (
                          <button
                            key={mod.id}
                            onClick={() => handleSelectModule(mod)}
                            className={`w-full px-3 py-2 rounded-md text-xs text-left transition-all flex items-center justify-between group ${
                              isSelected
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-medium'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                            }`}
                          >
                            <span className="truncate pr-2">{mod.title}</span>
                            <span className={`w-2.5 h-2.5 rounded-sm shrink-0 border transition-colors ${
                              isSelected
                                ? 'bg-blue-500 border-blue-400 shadow-sm'
                                : mod.type === 'quiz'
                                ? 'border-rose-900/60 bg-rose-950/40'
                                : 'border-slate-800 bg-slate-900 group-hover:border-slate-700'
                            }`} />
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        
        {/* Scrollable Lesson / Lab Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
            
            {/* Lesson Header */}
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/50 px-2.5 py-1 rounded border border-blue-900/50">
                  Mastery Curriculum
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">
                  {selectedModule.title || 'Select a Module'}
                </h2>
              </div>
              {selectedModule.estimatedReadTime && (
                <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  ⏱ {selectedModule.estimatedReadTime} read
                </span>
              )}
            </div>

            {/* STATIC CHART ILLUSTRATION RENDERER (TOP VISUAL ANCHOR) */}
            {selectedModule.chartIllustration && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <h4 className="text-sm font-bold text-slate-200">
                  📊 {selectedModule.chartIllustration.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedModule.chartIllustration.description}
                </p>
                
                <div className="w-full h-48 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                  {selectedModule.chartIllustration.svgType === 'bull_vs_bear' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="105" y="40" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                      <text x="90" y="15" fill="#3b82f6" fontSize="10" fontFamily="monospace">Bull Trend Bar</text>
                      <line x1="280" y1="20" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2" />
                      <rect x="265" y="35" width="30" height="75" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="2" />
                      <text x="255" y="15" fill="#f43f5e" fontSize="10" fontFamily="monospace">Bear Trend Bar</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'doji_equilibrium' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="105" y="40" width="30" height="70" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                      <text x="95" y="15" fill="#3b82f6" fontSize="10" fontFamily="monospace">Strong Trend</text>
                      <line x1="280" y1="20" x2="280" y2="130" stroke="#94a3b8" strokeWidth="2" />
                      <rect x="265" y="73" width="30" height="4" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                      <text x="250" y="15" fill="#94a3b8" fontSize="10" fontFamily="monospace">Doji (Indecision)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'inside_bar' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="140" y1="10" x2="140" y2="140" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="120" y="30" width="40" height="90" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                      <text x="110" y="145" fill="#3b82f6" fontSize="9" fontFamily="monospace">Mother Bar (1)</text>
                      <line x1="260" y1="45" x2="260" y2="105" stroke="#f59e0b" strokeWidth="2" />
                      <rect x="245" y="55" width="30" height="40" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                      <text x="235" y="145" fill="#f59e0b" fontSize="9" fontFamily="monospace">Inside Bar (2)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'outside_bar' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="140" y1="50" x2="140" y2="100" stroke="#94a3b8" strokeWidth="2" />
                      <rect x="125" y="60" width="30" height="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
                      <text x="120" y="145" fill="#94a3b8" fontSize="9" fontFamily="monospace">Prior Bar</text>
                      <line x1="260" y1="15" x2="260" y2="135" stroke="#10b981" strokeWidth="2" />
                      <rect x="240" y="25" width="40" height="100" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
                      <text x="230" y="145" fill="#10b981" fontSize="9" fontFamily="monospace">Outside Bar (OB)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'signal_vs_entry' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="130" y1="30" x2="130" y2="120" stroke="#f59e0b" strokeWidth="2" />
                      <rect x="115" y="45" width="30" height="60" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                      <text x="110" y="140" fill="#f59e0b" fontSize="9" fontFamily="monospace">Signal Bar (Setup)</text>
                      <line x1="270" y1="15" x2="270" y2="110" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="255" y="25" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                      <text x="245" y="140" fill="#3b82f6" fontSize="9" fontFamily="monospace">Entry Bar (Trigger)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'reversal_bar' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="200" y1="10" x2="200" y2="140" stroke="#ec4899" strokeWidth="2" />
                      <rect x="180" y="20" width="40" height="90" fill="#831843" stroke="#ec4899" strokeWidth="2" rx="2" />
                      <text x="160" y="145" fill="#ec4899" fontSize="9" fontFamily="monospace">Reversal Bar (Climax Close)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'micro_channel' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="100" y1="80" x2="100" y2="130" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="90" y="90" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                      <line x1="160" y1="60" x2="160" y2="110" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="150" y="70" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" rx="1" />
                      <line x1="220" y1="40" x2="220" y2="90" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="210" y="50" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                      <line x1="280" y1="20" x2="280" y2="70" stroke="#3b82f6" strokeWidth="2" />
                      <rect x="270" y="30" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                      <text x="160" y="140" fill="#3b82f6" fontSize="9" fontFamily="monospace">Tight Bull Micro Channel</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'market_states' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <rect x="30" y="30" width="140" height="90" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
                      <text x="60" y="80" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold">Trend State (30-40%)</text>
                      <rect x="230" y="30" width="140" height="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                      <text x="245" y="80" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">Trading Range (60-70%)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'always_in_flip' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="50" y1="50" x2="150" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <rect x="70" y="70" width="16" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <line x1="78" y1="60" x2="78" y2="110" stroke="#f43f5e" strokeWidth="2" />
                      <rect x="100" y="90" width="16" height="25" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <line x1="108" y1="80" x2="108" y2="125" stroke="#f43f5e" strokeWidth="2" />
                      <rect x="130" y="110" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <line x1="138" y1="100" x2="138" y2="155" stroke="#f43f5e" strokeWidth="2" />
                      <rect x="180" y="40" width="24" height="110" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <line x1="192" y1="30" x2="192" y2="160" stroke="#3b82f6" strokeWidth="2" />
                      <text x="192" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">AIL Flip</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'spike_and_channel' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <rect x="50" y="90" width="16" height="50" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="75" y="40" width="16" height="55" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="100" y="10" width="16" height="40" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <text x="75" y="130" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Spike</text>
                      <rect x="130" y="20" width="12" height="15" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <line x1="136" y1="15" x2="136" y2="45" stroke="#f43f5e" strokeWidth="2" />
                      <rect x="160" y="10" width="12" height="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="180" y="5" width="12" height="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <line x1="130" y1="50" x2="200" y2="25" stroke="#475569" strokeWidth="2" />
                      <text x="180" y="50" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Channel</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'breakout_vs_failure' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="80" x2="380" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="200" y="75" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">Resistance</text>
                      <rect x="60" y="90" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="85" y="50" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="110" y="20" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <text x="85" y="15" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">20% Success</text>
                      <rect x="260" y="90" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="285" y="50" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="310" y="55" width="12" height="15" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <rect x="330" y="75" width="16" height="40" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <text x="295" y="15" fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="middle">80% Failure (Trap)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'leg1_leg2_measured_move' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="50" y1="130" x2="120" y2="60" stroke="#3b82f6" strokeWidth="4" />
                      <text x="70" y="100" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 1</text>
                      <line x1="120" y1="60" x2="160" y2="90" stroke="#f43f5e" strokeWidth="4" />
                      <line x1="160" y1="90" x2="230" y2="20" stroke="#3b82f6" strokeWidth="4" />
                      <text x="200" y="50" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 2</text>
                      <line x1="50" y1="130" x2="50" y2="60" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="160" y1="90" x2="160" y2="20" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="50" y1="60" x2="160" y2="20" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="240" y="25" fill="#f59e0b" fontSize="10" fontFamily="monospace">Target (PTZ)</text>
                    </svg>
                  )}
                </div>
              </div>
            )}

            {/* Static Theory Sections */}
            {selectedModule.sections && (
              <div className="space-y-6 text-left">
                {selectedModule.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3 bg-slate-900/30 border border-slate-800/80 p-5 md:p-6 rounded-xl shadow-lg">
                    <h3 className="text-base md:text-lg font-bold text-blue-300 flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">0{idx + 1}</span>
                      {sec.heading}
                    </h3>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                    {sec.keyRule && (
                      <div className="p-3.5 bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg space-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Core Brooks Rule:</span>
                        <p className="text-xs md:text-sm text-slate-200 font-medium">{sec.keyRule}</p>
                      </div>
                    )}
                    {sec.barBreakdownExample && (
                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">🧠 Institutional Psychology:</span>
                        <p className="text-xs text-slate-400 font-mono"><strong>Scenario:</strong> {sec.barBreakdownExample.scenario}</p>
                        <p className="text-xs text-slate-300 leading-relaxed"><strong>Mechanics:</strong> {sec.barBreakdownExample.psychology}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* DYNAMIC INTERACTIVE MICRO-LAB (Always mounted from LabRegistry) */}
            {ActiveLabComponent && (
              <div className="pt-4">
                <ActiveLabComponent />
              </div>
            )}

            {/* Flashcard Module */}
            {selectedModule.type === 'flashcard' && selectedModule.flashcards && (
              <div className="w-full max-w-md mx-auto space-y-4 pt-4">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Card {currentCardIndex + 1} of {selectedModule.flashcards.length}</span>
                  <span>Click to flip</span>
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

            {/* Certification Quiz Module */}
            {selectedModule.type === 'quiz' && selectedModule.questions && (
              <div className="w-full max-w-xl mx-auto space-y-6 pt-2">
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
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? '✓ Correct!' : '✕ Incorrect'}
                        </span>
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
                    <h3 className="text-xl font-bold text-slate-100">Quiz Completed!</h3>
                    <p className="text-sm text-slate-400 font-mono">
                      You scored <strong className="text-emerald-400">{quizScore}</strong> out of <strong className="text-slate-200">{selectedModule.questions.length}</strong>
                    </p>
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

          </div>
        </div>

        {/* BOTTOM PROGRESS & NAVIGATION FOOTER */}
        <footer className="h-16 border-t border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between shrink-0 select-none">
          <button
            onClick={handlePrevModule}
            disabled={currentIndex <= 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            ◀ Previous
          </button>

          <span className="text-xs font-mono text-slate-400">
            Module <strong className="text-slate-200">{currentIndex + 1}</strong> of <strong className="text-slate-200">{modules.length}</strong>
          </span>

          <button
            onClick={handleNextModule}
            disabled={currentIndex >= modules.length - 1}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md"
          >
            Complete & Advance ➔
          </button>
        </footer>

      </main>

    </div>
  );
}
