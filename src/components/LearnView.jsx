// Version: v3.6 - High-Contrast Institutional Typography & Structured Content Parser
import { useState, useMemo, useRef } from 'react';
import data from '../data/curriculumData.json';

const TIER_METADATA = {
  tier0: { 
    id: 'tier0', 
    label: '🚀 START HERE', 
    title: 'Orientation: The Price Action Paradigm', 
    badge: 'Course Orientation',
    description: 'First principles of price action, auction microstructure, and how to master this platform.'
  },
  tier1: { 
    id: 'tier1', 
    label: '1. Foundations', 
    title: 'Tier 1: Bar Anatomy & Microstructure', 
    badge: 'Tier 1: Foundations',
    description: 'Tick-by-tick mechanics, trend bars vs. dojis, inside/outside bars, and the two market states.'
  },
  tier2: { 
    id: 'tier2', 
    label: '2. Market Dynamics', 
    title: 'Tier 2: Market Flow & Breakouts', 
    badge: 'Tier 2: Core Dynamics',
    description: 'Always In direction, Spike & Channel mechanics, the 80% Rule, and measured moves.'
  },
  tier3: { 
    id: 'tier3', 
    label: '3. Setup Engines', 
    title: 'Tier 3: The Engine Room (Pullbacks & Ranges)', 
    badge: 'Tier 3: Setup Engines',
    description: 'High 1/2 and Low 1/2 bar counting, 20 EMA gap bars, wedges, and trading range tactics.'
  },
  tier4: { 
    id: 'tier4', 
    label: '4. Advanced Setups', 
    title: 'Tier 4: Advanced Structures & Reversals', 
    badge: 'Tier 4: Advanced Structures',
    description: 'Major Trend Reversals (MTR), buy/sell climaxes, and micro double tops/bottoms.'
  },
  tier5: { 
    id: 'tier5', 
    label: '5. Math & Execution', 
    title: 'Tier 5: Institutional Math & Management', 
    badge: 'Tier 5: Professional Execution',
    description: 'The Trader’s Equation, position sizing, scaling protocols, and trade management.'
  }
};

// Helper component to render high-contrast, structured paragraphs and bullet lists
function FormattedSectionContent({ content }) {
  if (!content) return null;

  // Split content by double newlines into blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        // Detect if this block is a bullet list
        const isBulletList = lines.every((l) => l.startsWith('- ') || l.startsWith('* '));

        if (isBulletList) {
          return (
            <ul key={bIdx} className="space-y-2.5 my-3 pl-2">
              {lines.map((line, lIdx) => {
                const cleaned = line.replace(/^[-*]\s+/, '');
                // Check if line has a bold prefix like "Tier 1: Foundations — ..."
                const parts = cleaned.split(/—|:/);
                if (parts.length > 1 && cleaned.includes('—')) {
                  const [prefix, ...rest] = cleaned.split('—');
                  return (
                    <li key={lIdx} className="flex items-start gap-3 text-slate-200 text-sm md:text-base leading-relaxed">
                      <span className="text-blue-400 font-bold mt-1 shrink-0 text-xs">◆</span>
                      <span>
                        <strong className="text-white font-semibold">{prefix.trim()}</strong> — {rest.join('—').trim()}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={lIdx} className="flex items-start gap-3 text-slate-200 text-sm md:text-base leading-relaxed">
                    <span className="text-blue-400 font-bold mt-1 shrink-0 text-xs">◆</span>
                    <span>{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard high-contrast readable paragraph
        return (
          <p key={bIdx} className="text-slate-200 text-sm md:text-base leading-relaxed tracking-normal font-normal">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default function LearnView() {
  const modules = Array.isArray(data?.modules) ? data.modules : [];
  const [selectedModule, setSelectedModule] = useState(modules[0] || null);

  const mainScrollRef = useRef(null);

  const [showMilestoneCard, setShowMilestoneCard] = useState(false);
  const [pendingNextModule, setPendingNextModule] = useState(null);

  const getTierKey = (mod) => {
    if (!mod?.id) return 'tier0';
    const match = String(mod.id).match(/^(tier\d+)/i);
    return match ? match[1].toLowerCase() : 'tier0';
  };

  const groupedTiers = useMemo(() => {
    const map = {};
    modules.forEach((mod) => {
      const key = getTierKey(mod);
      if (!map[key]) {
        const meta = TIER_METADATA[key] || {
          id: key,
          label: key.toUpperCase(),
          title: key.toUpperCase(),
          badge: key.toUpperCase(),
          description: ''
        };
        map[key] = { ...meta, items: [] };
      }
      map[key].items.push(mod);
    });
    return map;
  }, [modules]);

  const tierKeys = useMemo(() => {
    return Object.keys(groupedTiers).filter((k) => k && k.trim() !== '' && groupedTiers[k]?.items?.length > 0);
  }, [groupedTiers]);

  const currentTierKey = useMemo(() => {
    return selectedModule ? getTierKey(selectedModule) : (tierKeys[0] || 'tier0');
  }, [selectedModule, tierKeys]);

  const [openTierKey, setOpenTierKey] = useState(currentTierKey);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentIndex = useMemo(() => {
    return modules.findIndex((m) => m.id === selectedModule?.id);
  }, [modules, selectedModule]);

  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const activeTierObj = groupedTiers[currentTierKey] || TIER_METADATA[currentTierKey] || {};
  const currentTierItems = activeTierObj.items || [];
  const currentStepInTier = currentTierItems.findIndex((m) => m.id === selectedModule?.id) + 1;

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectModule = (mod) => {
    if (!mod) return;
    setShowMilestoneCard(false);
    setSelectedModule(mod);
    const tier = getTierKey(mod);
    setOpenTierKey(tier);
    
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);

    scrollToTop();
  };

  const handleSelectTierRail = (tierKey) => {
    setShowMilestoneCard(false);
    setOpenTierKey(tierKey);
    const targetTier = groupedTiers[tierKey];
    if (targetTier?.items?.length) {
      handleSelectModule(targetTier.items[0]);
    }
  };

  const toggleTierAccordion = (tierKey) => {
    setOpenTierKey((prev) => (prev === tierKey ? null : tierKey));
  };

  const handleAdvanceToNext = () => {
    if (!nextModule) return;

    const nextTier = getTierKey(nextModule);
    const isCrossingTierBoundary = nextTier !== currentTierKey;

    if (isCrossingTierBoundary) {
      setPendingNextModule(nextModule);
      setShowMilestoneCard(true);
      scrollToTop();
    } else {
      handleSelectModule(nextModule);
    }
  };

  const handleConfirmMilestoneAdvance = () => {
    if (pendingNextModule) {
      handleSelectModule(pendingNextModule);
      setPendingNextModule(null);
    }
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

  if (!modules.length || !selectedModule) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-sm">
        Curriculum modules loading or unavailable.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950 overflow-hidden">
      
      {/* Sidebar Navigation: Locked to 320px with explicit syllabus styling */}
      <aside className="w-full md:w-80 md:min-w-[20rem] md:max-w-[20rem] border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/70 flex flex-col shrink-0 h-72 md:h-full">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Course Syllabus
            </h3>
            <span className="text-[11px] text-slate-400">
              Al Brooks Price Action Mastery
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-blue-400 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded">
            {modules.length} Lessons
          </span>
        </div>

        {/* Exclusive Single-Open Accordion List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 transition-colors">
          {tierKeys.map((key) => {
            const tier = groupedTiers[key];
            if (!tier) return null;

            const isOpen = openTierKey === key;
            const isCurrentTier = currentTierKey === key;

            return (
              <div
                key={key}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  isCurrentTier
                    ? 'border-blue-500/50 bg-slate-900/60 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                {/* Accordion Tier Header */}
                <button
                  onClick={() => toggleTierAccordion(key)}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left transition-colors bg-slate-900/60 hover:bg-slate-900 select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-slate-400 font-mono text-xs">
                      {isOpen ? '▾' : '▸'}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrentTier ? 'text-blue-300' : 'text-slate-200'
                      }`}
                    >
                      {tier.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0 ml-2">
                    {tier.items?.length || 0}
                  </span>
                </button>

                {/* Collapsible Module Sub-List */}
                {isOpen && (
                  <div className="p-1.5 space-y-1 bg-slate-950/70 border-t border-slate-800/80">
                    {tier.items?.map((mod) => {
                      const isSelected = selectedModule?.id === mod.id && !showMilestoneCard;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleSelectModule(mod)}
                          className={`w-full px-3 py-2.5 rounded-lg text-xs md:text-sm text-left transition-all flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold shadow-md'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <span className="truncate">{mod.title}</span>
                          <span className="text-xs text-slate-400 font-mono shrink-0">
                            {mod.type === 'comprehensive_lesson'
                              ? '📖'
                              : mod.type === 'flashcard'
                              ? '⚡'
                              : '🎯'}
                          </span>
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

      {/* Main Full-Width Scrolling Content Area */}
      <div 
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto bg-slate-950 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700"
      >
        {/* Generous Macro Phase Rail Across Full Content Header */}
        <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-3.5 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider shrink-0 mr-1">
              Phases:
            </span>
            {tierKeys.map((key) => {
              const tier = groupedTiers[key];
              const isActiveTier = currentTierKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectTierRail(key)}
                  className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActiveTier
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/60'
                  }`}
                  title={tier?.title || key}
                >
                  <span>{tier?.label || key}</span>
                </button>
              );
            })}
          </div>
        </div>

        <section className="p-6 md:p-12 flex flex-col max-w-4xl mx-auto w-full min-h-[calc(100%-57px)] justify-between">
          
          {/* OPTION B: MILESTONE INTERSTITIAL CARD */}
          {showMilestoneCard ? (
            <div className="my-auto py-12 px-6 max-w-2xl mx-auto text-center space-y-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-fadeIn">
              <div className="inline-flex p-4 bg-blue-950 border border-blue-700 rounded-2xl text-4xl shadow-inner">
                🎓
              </div>
              
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  Curriculum Milestone Achieved
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {activeTierObj.title} Complete!
                </h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  You have successfully completed all core lectures and certification questions for this phase.
                </p>
              </div>

              {pendingNextModule && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-mono text-blue-400 uppercase font-semibold">
                    Next Phase Unlocked:
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {TIER_METADATA[getTierKey(pendingNextModule)]?.title || 'Next Phase'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {TIER_METADATA[getTierKey(pendingNextModule)]?.description || ''}
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowMilestoneCard(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors"
                >
                  Review Prior Lesson ↺
                </button>
                <button
                  onClick={handleConfirmMilestoneAdvance}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <span>Begin Next Phase</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* HIGH-CONTRAST LESSON AND QUIZ CONTENT */}
              <div className="space-y-8">
                
                {/* Header & Orientation Breadcrumbs */}
                <div className="pb-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-blue-300 uppercase tracking-widest bg-blue-950 border border-blue-800/80 px-2.5 py-1 rounded font-bold">
                        {activeTierObj.badge || 'Mastery Curriculum'}
                      </span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-300 font-semibold">
                        Lesson {currentStepInTier} of {currentTierItems.length}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mt-2.5 tracking-tight">
                      {selectedModule.title}
                    </h2>
                  </div>
                  {selectedModule.estimatedReadTime && (
                    <span className="text-xs text-slate-300 font-mono bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-sm font-medium">
                      ⏱ {selectedModule.estimatedReadTime} read
                    </span>
                  )}
                </div>

                {/* COMPREHENSIVE LESSON RENDERER WITH HIGH-CONTRAST CARDS */}
                {selectedModule.type === 'comprehensive_lesson' && Array.isArray(selectedModule.sections) && (
                  <div className="space-y-8 text-left">
                    {selectedModule.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="space-y-5 bg-slate-900/90 border border-slate-800/90 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-sm"
                      >
                        <h3 className="text-lg md:text-xl font-bold text-blue-300 flex items-center gap-2.5">
                          <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            0{idx + 1}
                          </span>
                          <span>{sec.heading}</span>
                        </h3>
                        
                        {/* High-Contrast Structured Paragraph & Bullet Parser */}
                        <FormattedSectionContent content={sec.content} />

                        {sec.keyRule && (
                          <div className="p-4 md:p-5 bg-blue-950/50 border-l-4 border-blue-500 rounded-r-xl space-y-1.5 shadow-inner">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 font-mono">
                              Core Brooks Rule:
                            </span>
                            <p className="text-sm md:text-base text-white font-medium leading-relaxed">
                              {sec.keyRule}
                            </p>
                          </div>
                        )}

                        {sec.barBreakdownExample && (
                          <div className="p-4 md:p-5 bg-slate-950 border border-slate-800/90 rounded-xl space-y-2.5 shadow-inner">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                              <span>🧠</span>
                              <span>Institutional Psychology Breakdown:</span>
                            </span>
                            <p className="text-xs md:text-sm text-slate-300 font-mono">
                              <strong className="text-slate-100">Scenario:</strong> {sec.barBreakdownExample.scenario}
                            </p>
                            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                              <strong className="text-slate-100">Mechanics:</strong> {sec.barBreakdownExample.psychology}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* DYNAMIC SVG CHART ILLUSTRATION RENDERER */}
                    {selectedModule.chartIllustration && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h4 className="text-sm md:text-base font-bold text-white">
                            📊 {selectedModule.chartIllustration.title}
                          </h4>
                          <span className="text-[11px] font-mono uppercase text-blue-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-bold">
                            Visual Reference
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                          {selectedModule.chartIllustration.description}
                        </p>
                        
                        <div className="w-full h-56 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-4">
                          {selectedModule.chartIllustration.svgType === 'bull_vs_bear' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="105" y="40" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                              <text x="90" y="15" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">Bull Trend Bar</text>
                              <line x1="280" y1="20" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2" />
                              <rect x="265" y="35" width="30" height="75" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="2" />
                              <text x="250" y="15" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold">Bear Trend Bar</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'doji_equilibrium' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="105" y="40" width="30" height="70" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                              <text x="95" y="15" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">Strong Trend</text>
                              <line x1="280" y1="20" x2="280" y2="130" stroke="#94a3b8" strokeWidth="2" />
                              <rect x="265" y="73" width="30" height="4" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                              <text x="245" y="15" fill="#cbd5e1" fontSize="11" fontFamily="monospace" fontWeight="bold">Doji (Indecision)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'inside_bar' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="140" y1="10" x2="140" y2="140" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="120" y="30" width="40" height="90" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                              <text x="105" y="145" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">Mother Bar (1)</text>
                              <line x1="260" y1="45" x2="260" y2="105" stroke="#f59e0b" strokeWidth="2" />
                              <rect x="245" y="55" width="30" height="40" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                              <text x="235" y="145" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">Inside Bar (2)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'outside_bar' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="140" y1="50" x2="140" y2="100" stroke="#94a3b8" strokeWidth="2" />
                              <rect x="125" y="60" width="30" height="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
                              <text x="115" y="145" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Prior Bar</text>
                              <line x1="260" y1="15" x2="260" y2="135" stroke="#10b981" strokeWidth="2" />
                              <rect x="240" y="25" width="40" height="100" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
                              <text x="225" y="145" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">Outside Bar (OB)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'signal_vs_entry' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="130" y1="30" x2="130" y2="120" stroke="#f59e0b" strokeWidth="2" />
                              <rect x="115" y="45" width="30" height="60" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                              <text x="100" y="140" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">Signal Bar (Setup)</text>
                              <line x1="270" y1="15" x2="270" y2="110" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="255" y="25" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                              <text x="240" y="140" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">Entry Bar (Trigger)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'reversal_bar' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="200" y1="10" x2="200" y2="140" stroke="#ec4899" strokeWidth="2" />
                              <rect x="180" y="20" width="40" height="90" fill="#831843" stroke="#ec4899" strokeWidth="2" rx="2" />
                              <text x="145" y="145" fill="#f472b6" fontSize="10" fontFamily="monospace" fontWeight="bold">Reversal Bar (Climax Close)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'micro_channel' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="100" y1="80" x2="100" y2="130" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="90" y="90" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                              <line x1="160" y1="60" x2="160" y2="110" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="150" y="70" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" rx="1" />
                              <line x1="220" y1="40" x2="220" y2="90" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="210" y="50" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                              <line x1="280" y1="20" x2="280" y2="70" stroke="#3b82f6" strokeWidth="2" />
                              <rect x="270" y="30" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
                              <text x="145" y="140" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">Tight Bull Micro Channel</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'market_states' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="30" y="30" width="140" height="90" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
                              <text x="50" y="80" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">Trend State (30-40%)</text>
                              <rect x="230" y="30" width="140" height="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                              <text x="235" y="80" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">Trading Range (60-70%)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'always_in_flip' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="50" y1="50" x2="150" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                              <rect x="70" y="70" width="16" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                              <line x1="78" y1="60" x2="78" y2="110" stroke="#f43f5e" strokeWidth="2" />
                              <rect x="100" y="90" width="16" height="25" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                              <line x1="108" y1="80" x2="108" y2="125" stroke="#f43f5e" strokeWidth="2" />
                              <rect x="130" y="110" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                              <line x1="138" y1="100" x2="138" y2="155" stroke="#f43f5e" strokeWidth="2" />
                              <rect x="180" y="40" width="24" height="110" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                              <line x1="192" y1="30" x2="192" y2="160" stroke="#3b82f6" strokeWidth="2" />
                              <text x="192" y="20" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AIL Flip</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'spike_and_channel' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="20" y1="80" x2="380" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                              <text x="200" y="75" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle">Resistance</text>
                              <rect x="60" y="90" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                              <rect x="85" y="50" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                              <rect x="110" y="20" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                              <text x="85" y="15" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">20% Success</text>
                              <rect x="260" y="90" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                              <rect x="285" y="50" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                              <rect x="310" y="55" width="12" height="15" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                              <rect x="330" y="75" width="16" height="40" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                              <text x="295" y="15" fill="#fb7185" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">80% Failure (Trap)</text>
                            </svg>
                          )}
                          {selectedModule.chartIllustration.svgType === 'leg1_leg2_measured_move' && (
                            <svg className="w-full h-full max-h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="50" y1="130" x2="120" y2="60" stroke="#3b82f6" strokeWidth="4" />
                              <text x="70" y="100" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 1</text>
                              <line x1="120" y1="60" x2="160" y2="90" stroke="#f43f5e" strokeWidth="4" />
                              <line x1="160" y1="90" x2="230" y2="20" stroke="#3b82f6" strokeWidth="4" />
                              <text x="200" y="50" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 2</text>
                              <line x1="50" y1="130" x2="50" y2="60" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                              <line x1="160" y1="90" x2="160" y2="20" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                              <line x1="50" y1="60" x2="160" y2="20" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                              <text x="240" y="25" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">Target (PTZ)</text>
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FLASHCARD RENDERER */}
                {selectedModule.type === 'flashcard' && Array.isArray(selectedModule.flashcards) && (
                  <div className="w-full max-w-md mx-auto space-y-4 pt-6">
                    <div className="flex justify-between text-xs text-slate-300 font-mono">
                      <span>Card {currentCardIndex + 1} of {selectedModule.flashcards.length}</span>
                      <span>Click to flip</span>
                    </div>
                    
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full h-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-slate-700 transition-all select-none text-center"
                    >
                      {!isFlipped ? (
                        <div className="space-y-2">
                          <span className="text-xs uppercase font-mono text-blue-400 font-bold">Question</span>
                          <h3 className="text-lg font-semibold text-white">
                            {selectedModule.flashcards[currentCardIndex]?.question}
                          </h3>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-xs uppercase font-mono text-emerald-400 font-bold">Answer</span>
                          <p className="text-base text-slate-100 font-medium leading-relaxed">
                            {selectedModule.flashcards[currentCardIndex]?.answer}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handlePrevCard(selectedModule.flashcards.length)}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors"
                      >
                        ◀ Previous Card
                      </button>
                      <button 
                        onClick={() => handleNextCard(selectedModule.flashcards.length)}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        Next Card ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* INTERACTIVE QUIZ RENDERER */}
                {selectedModule.type === 'quiz' && Array.isArray(selectedModule.questions) && (
                  <div className="w-full max-w-xl mx-auto space-y-6 pt-4">
                    {!quizCompleted ? (
                      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl">
                        <div className="flex justify-between items-center text-xs font-mono text-slate-300 border-b border-slate-800 pb-3">
                          <span>Question {currentQuestionIndex + 1} of {selectedModule.questions.length}</span>
                          <span className="font-bold text-blue-400">Score: {quizScore}</span>
                        </div>

                        <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
                          {selectedModule.questions[currentQuestionIndex]?.prompt}
                        </p>

                        <div className="space-y-3">
                          {selectedModule.questions[currentQuestionIndex]?.options?.map((option, idx) => {
                            let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700";
                            
                            if (showExplanation) {
                              if (idx === selectedModule.questions[currentQuestionIndex].correctIndex) {
                                btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
                              } else if (idx === selectedOption) {
                                btnStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
                              } else {
                                btnStyle = "bg-slate-950/50 border-slate-900 text-slate-600 opacity-50";
                              }
                            }

                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectQuizOption(idx, selectedModule.questions[currentQuestionIndex].correctIndex)}
                                disabled={showExplanation}
                                className={`w-full p-4 rounded-xl border text-sm md:text-base text-left transition-all flex items-start gap-3 ${btnStyle}`}
                              >
                                <span className="font-mono text-xs opacity-70 mt-0.5">0{idx + 1}</span>
                                <span className="flex-1">{option}</span>
                              </button>
                            );
                          })}
                        </div>

                        {showExplanation && (
                          <div className="p-4 md:p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 animate-fadeIn">
                            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedOption === selectedModule.questions[currentQuestionIndex]?.correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {selectedOption === selectedModule.questions[currentQuestionIndex]?.correctIndex ? '✓ Correct Decision' : '✕ Trapped / Incorrect'}
                            </span>
                            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                              {selectedModule.questions[currentQuestionIndex]?.explanation}
                            </p>
                            
                            <button
                              onClick={() => handleNextQuizQuestion(selectedModule.questions.length)}
                              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                              {currentQuestionIndex + 1 < selectedModule.questions.length ? 'Next Question ➔' : 'Complete Certification Quiz 🏆'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
                        <span className="text-4xl">🎉</span>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                          <p className="text-sm text-slate-300 font-mono">
                            You scored <strong className="text-emerald-400">{quizScore}</strong> out of <strong className="text-white">{selectedModule.questions.length}</strong>
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
              </div>

              {/* PERSISTENT GUIDED CONTINUATION FOOTER */}
              <footer className="mt-16 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Previous Module Button */}
                <button
                  onClick={() => prevModule && handleSelectModule(prevModule)}
                  disabled={!prevModule}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    prevModule
                      ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                      : 'border-slate-900 bg-slate-950 text-slate-700 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>◀</span>
                  <span className="truncate max-w-[180px]">
                    {prevModule ? prevModule.title : 'First Lesson'}
                  </span>
                </button>

                {/* Progress Breadcrumb */}
                <div className="text-center">
                  <div className="text-xs font-mono text-slate-300">
                    Step <strong className="text-blue-400">{currentIndex + 1}</strong> of <strong className="text-white">{modules.length}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    {activeTierObj.label}
                  </div>
                </div>

                {/* Primary Action Button */}
                {nextModule ? (
                  <button
                    onClick={handleAdvanceToNext}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <span className="truncate max-w-[200px]">
                      {getTierKey(nextModule) !== currentTierKey
                        ? 'Complete Phase & Unlock Next ➔'
                        : `Next: ${nextModule.title.split(' ')[0]} ➔`}
                    </span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono font-semibold">
                    ✓ Complete Mastery Reached
                  </div>
                )}
              </footer>
            </>
          )}

        </section>
      </div>

    </div>
  );
}
