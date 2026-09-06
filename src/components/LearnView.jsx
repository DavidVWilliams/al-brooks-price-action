// Version: v6.0 - Canonical LearnView with Flow Layout (Preserving App.jsx Header), Full-Spectrum SVGs (Tiers 0-5), & Dynamic Micro-Labs
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

  const currentTierId = selectedModule.id?.split('-')[0] || 'tier0';
  const [openTier, setOpenTier] = useState(currentTierId);

  const modulesByTier = useMemo(() => {
    const grouped = {};
    TIERS.forEach((t) => {
      grouped[t.id] = modules.filter((m) => m.id && m.id.startsWith(t.id));
    });
    return grouped;
  }, [modules]);

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

  const handleNextCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % total);
  };

  const handlePrevCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + total) % total);
  };

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

  const ActiveLabComponent = selectedModule?.id ? getInteractiveLab(selectedModule.id) : null;

  return (
    /* CRITICAL: Use w-full h-full (NOT absolute inset-0) so App.jsx's header is never covered */
    <div className="w-full h-full flex-1 flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      
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
        <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
            
            {/* Header */}
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

            {/* FULL-SPECTRUM STATIC SVG ILLUSTRATION ENGINE */}
            {selectedModule.chartIllustration && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <h4 className="text-sm font-bold text-slate-200">
                  📊 {selectedModule.chartIllustration.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedModule.chartIllustration.description}
                </p>
                
                <div className="w-full h-48 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                  
                  {/* TIER 0 SVGS */}
                  {(selectedModule.chartIllustration.svgType === 'order_book_dom' ||
                    selectedModule.chartIllustration.svgType === 'dom_order_book' ||
                    selectedModule.chartIllustration.svgType === 'auction_microstructure' ||
                    selectedModule.chartIllustration.svgType === 'order_book') && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <rect x="50" y="15" width="120" height="18" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" rx="2" />
                      <text x="60" y="28" fill="#f43f5e" fontSize="9" fontFamily="monospace">ASK 5022.50 [140]</text>
                      <rect x="50" y="37" width="100" height="18" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" rx="2" />
                      <text x="60" y="50" fill="#f43f5e" fontSize="9" fontFamily="monospace">ASK 5022.25 [95]</text>

                      <line x1="40" y1="65" x2="190" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="115" y="75" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">1-Tick Spread (Inside Market)</text>

                      <rect x="50" y="83" width="110" height="18" fill="#065f46" stroke="#10b981" strokeWidth="1" rx="2" />
                      <text x="60" y="96" fill="#10b981" fontSize="9" fontFamily="monospace">BID 5021.75 [110]</text>
                      <rect x="50" y="105" width="130" height="18" fill="#065f46" stroke="#10b981" strokeWidth="1" rx="2" />
                      <text x="60" y="118" fill="#10b981" fontSize="9" fontFamily="monospace">BID 5021.50 [185]</text>

                      <path d="M 230 115 L 230 40" stroke="#38bdf8" strokeWidth="2.5" />
                      <polygon points="225,45 235,45 230,35" fill="#38bdf8" />
                      <text x="245" y="70" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">Market Buy Sweep</text>
                      <text x="245" y="85" fill="#94a3b8" fontSize="8" fontFamily="monospace">Consumes Resting Limit Asks</text>
                    </svg>
                  )}

                  {(selectedModule.chartIllustration.svgType === 'dual_engine_loop' ||
                    selectedModule.chartIllustration.svgType === 'dual_engine_diagram' ||
                    selectedModule.chartIllustration.svgType === 'learning_methodology') && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <rect x="30" y="45" width="95" height="55" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
                      <text x="77" y="70" fill="#3b82f6" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">1. Learn Mode</text>
                      <text x="77" y="85" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Brooks Syllabus</text>

                      <line x1="125" y1="72" x2="155" y2="72" stroke="#38bdf8" strokeWidth="2" />

                      <rect x="155" y="45" width="105" height="55" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="4" />
                      <text x="207" y="70" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2. Simulator</text>
                      <text x="207" y="85" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Live Execution</text>

                      <line x1="260" y1="72" x2="290" y2="72" stroke="#38bdf8" strokeWidth="2" />

                      <rect x="290" y="45" width="95" height="55" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                      <text x="337" y="70" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3. AI Mentor</text>
                      <text x="337" y="85" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Trader's Eq Audit</text>

                      <path d="M 337 100 L 337 125 L 77 125 L 77 100" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="207" y="138" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">Continuous Expectancy Feedback Loop</text>
                    </svg>
                  )}

                  {/* TIER 1 SVGS */}
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
                      <rect x="90" y="90" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                      <rect x="150" y="70" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" rx="1" />
                      <rect x="210" y="50" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                      <rect x="270" y="30" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                      <text x="160" y="140" fill="#3b82f6" fontSize="9" fontFamily="monospace">Tight Bull Micro Channel</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'market_states' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <rect x="30" y="30" width="140" height="90" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
                      <text x="50" y="80" fill="#3b82f6" fontSize="10" fontFamily="monospace" fontWeight="bold">Trend State (30-40%)</text>
                      <rect x="230" y="30" width="140" height="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                      <text x="240" y="80" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">Trading Range (60-70%)</text>
                    </svg>
                  )}

                  {/* TIER 2 SVGS */}
                  {selectedModule.chartIllustration.svgType === 'always_in_flip' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="50" y1="50" x2="150" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <rect x="70" y="70" width="16" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <rect x="100" y="90" width="16" height="25" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <rect x="130" y="110" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <rect x="180" y="30" width="24" height="110" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                      <text x="192" y="20" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">AIL Surprise Bar</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'spike_and_channel' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <rect x="50" y="90" width="16" height="50" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="75" y="40" width="16" height="55" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="100" y="15" width="16" height="40" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <text x="75" y="130" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Spike</text>
                      <line x1="130" y1="50" x2="280" y2="15" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="130" y1="90" x2="280" y2="55" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x="210" y="75" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">Channel Phase</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'breakout_vs_failure' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="75" x2="380" y2="75" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="200" y="70" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">Range Resistance</text>
                      <rect x="70" y="45" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="95" y="20" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <text x="85" y="15" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">20% Trend Continuation</text>
                      <rect x="280" y="45" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="305" y="55" width="16" height="40" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <text x="295" y="15" fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="middle">80% Breakout Trap (FBO)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'leg1_leg2_measured_move' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="50" y1="130" x2="120" y2="60" stroke="#3b82f6" strokeWidth="4" />
                      <text x="70" y="100" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 1</text>
                      <line x1="120" y1="60" x2="160" y2="90" stroke="#f43f5e" strokeWidth="4" />
                      <line x1="160" y1="90" x2="230" y2="20" stroke="#3b82f6" strokeWidth="4" />
                      <text x="200" y="50" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 2</text>
                      <line x1="160" y1="90" x2="160" y2="20" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="260" y="25" fill="#f59e0b" fontSize="10" fontFamily="monospace">Leg 1 = Leg 2 PTZ</text>
                    </svg>
                  )}

                  {/* TIER 3 SVGS */}
                  {selectedModule.chartIllustration.svgType === 'high1_high2' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <path d="M 40 120 Q 150 110 360 80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="365" y="83" fill="#38bdf8" fontSize="9" fontFamily="monospace">20 EMA</text>
                      <rect x="70" y="50" width="16" height="50" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="110" y="70" width="16" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <text x="118" y="115" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">H1 Attempt</text>
                      <rect x="150" y="85" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <rect x="180" y="65" width="18" height="45" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="1" />
                      <text x="189" y="55" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">H2 Entry (60%)</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'low1_low2' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <path d="M 40 30 Q 150 40 360 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="365" y="73" fill="#38bdf8" fontSize="9" fontFamily="monospace">20 EMA</text>
                      <rect x="70" y="50" width="16" height="50" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      <rect x="110" y="40" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <text x="118" y="30" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">L1 Bounce</text>
                      <rect x="150" y="35" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="180" y="50" width="18" height="45" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
                      <text x="189" y="115" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L2 Short Entry</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'ma_gap_bar' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="30" y1="65" x2="370" y2="65" stroke="#38bdf8" strokeWidth="2" />
                      <text x="375" y="68" fill="#38bdf8" fontSize="9" fontFamily="monospace">20 EMA</text>
                      <rect x="80" y="20" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="140" y="25" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                      <rect x="200" y="80" width="18" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                      <line x1="209" y1="72" x2="209" y2="80" stroke="#f43f5e" strokeWidth="1.5" />
                      <text x="209" y="130" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">Gap Bar (Entirely Below EMA)</text>
                      <path d="M 230 90 Q 280 40 330 20" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                      <text x="335" y="18" fill="#10b981" fontSize="9" fontFamily="monospace">75% Test of High</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'wedge_pullback' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="60" y1="40" x2="280" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="100" y1="90" x2="290" y2="120" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x="110" y="45" fill="#94a3b8" fontSize="9" fontFamily="monospace">Push 1</text>
                      <text x="180" y="70" fill="#94a3b8" fontSize="9" fontFamily="monospace">Push 2</text>
                      <text x="250" y="95" fill="#94a3b8" fontSize="9" fontFamily="monospace">Push 3 (Exhaustion)</text>
                      <rect x="295" y="75" width="18" height="40" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="1" />
                      <text x="304" y="65" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Wedge Reversal</text>
                    </svg>
                  )}

                  {selectedModule.chartIllustration.svgType === 'barb_wire' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="40" y1="75" x2="360" y2="75" stroke="#38bdf8" strokeWidth="2" />
                      <text x="365" y="78" fill="#38bdf8" fontSize="9" fontFamily="monospace">Flat 20 EMA</text>
                      <g transform="translate(100, 0)">
                        <line x1="20" y1="35" x2="20" y2="115" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="12" y="60" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                        <line x1="50" y1="40" x2="50" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="42" y="55" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                        <line x1="80" y1="30" x2="80" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="72" y="65" width="16" height="25" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                        <line x1="110" y1="45" x2="110" y2="115" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="102" y="58" width="16" height="32" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                      </g>
                      <text x="200" y="140" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        Barb Wire: Heavy Body Overlap, Long Tails
                      </text>
                    </svg>
                  )}

                  {/* TIER 4 SVGS */}
                  {selectedModule.chartIllustration.svgType === 'mtr_reversal' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="40" y1="130" x2="180" y2="40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1="180" y1="40" x2="220" y2="90" stroke="#f43f5e" strokeWidth="2" />
                      <text x="230" y="95" fill="#f59e0b" fontSize="9" fontFamily="monospace">1. Trendline Break</text>
                      <line x1="220" y1="90" x2="280" y2="50" stroke="#3b82f6" strokeWidth="2" />
                      <text x="285" y="45" fill="#f59e0b" fontSize="9" fontFamily="monospace">2. Lower High Test</text>
                      <rect x="295" y="55" width="18" height="45" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
                      <text x="304" y="120" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MTR Short Trigger</text>
                    </svg>
                  )}

                  {/* TIER 5 SVGS */}
                  {selectedModule.chartIllustration.svgType === 'traders_equation' && (
                    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
                      <line x1="200" y1="30" x2="200" y2="120" stroke="#475569" strokeWidth="3" />
                      <polygon points="180,120 220,120 200,90" fill="#334155" />
                      <line x1="70" y1="70" x2="330" y2="70" stroke="#38bdf8" strokeWidth="3" />
                      <rect x="60" y="40" width="80" height="30" fill="#065f46" stroke="#10b981" strokeWidth="1.5" rx="3" />
                      <text x="100" y="60" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">P × Reward</text>
                      <rect x="260" y="40" width="80" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" rx="3" />
                      <text x="300" y="60" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">(1-P) × Risk</text>
                      <text x="200" y="140" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Expectancy &gt; 0</text>
                    </svg>
                  )}

                  {/* RESILIENT FALLBACK: Ensures no container is ever blank */}
                  {![
                    'order_book_dom', 'dom_order_book', 'auction_microstructure', 'order_book',
                    'dual_engine_loop', 'dual_engine_diagram', 'learning_methodology',
                    'bull_vs_bear', 'doji_equilibrium', 'inside_bar', 'outside_bar',
                    'signal_vs_entry', 'reversal_bar', 'micro_channel', 'market_states',
                    'always_in_flip', 'spike_and_channel', 'breakout_vs_failure',
                    'leg1_leg2_measured_move', 'high1_high2', 'low1_low2',
                    'ma_gap_bar', 'wedge_pullback', 'barb_wire', 'mtr_reversal', 'traders_equation'
                  ].includes(selectedModule.chartIllustration.svgType) && (
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">
                        PA
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {selectedModule.chartIllustration.title}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Theory Sections */}
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
                  </div>
                ))}
              </div>
            )}

            {/* DYNAMIC INTERACTIVE CAPSTONE LAB */}
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

        {/* BOTTOM PROGRESS FOOTER */}
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
