// Version: v3.8 - Tier 0 Interactive SVG Diagrams & Macro Navigation
// Aggregated data imported from modular curriculumData.js

import { useState, useRef } from 'react';
import { curriculumData as data } from '../data/curriculumData.js';

// High-contrast markdown text and bullet parser
function FormattedSectionContent({ content }) {
  if (!content) return null;

  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="space-y-4 text-left">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n').filter(l => l.trim() !== '');
        const isBulletList = lines.every(line => line.trim().startsWith('- '));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-2.5 my-3 pl-1">
              {lines.map((line, lIdx) => {
                const cleanLine = line.trim().substring(2);
                const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-sm md:text-base text-slate-200 leading-relaxed">
                    <span className="text-blue-400 font-bold shrink-0 mt-1 select-none">◆</span>
                    <div>
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={partIdx} className="text-white font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <span key={partIdx}>{part}</span>;
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          );
        }

        const parts = para.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={pIdx} className="text-slate-200 text-sm md:text-base leading-relaxed">
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="text-white font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function LearnView() {
  const modules = data.modules || [];
  const [selectedModule, setSelectedModule] = useState(modules[0] || {});
  const mainScrollRef = useRef(null);

  // Group modules into syllabus phases
  const tiers = [
    { key: 'tier0', label: '🚀 START HERE', prefix: 'tier0' },
    { key: 'tier1', label: '1. Foundations', prefix: 'tier1' },
    { key: 'tier2', label: '2. Market Dynamics', prefix: 'tier2' },
    { key: 'tier3', label: '3. Setup Engines', prefix: 'tier3' },
    { key: 'tier4', label: '4. Advanced Setups', prefix: 'tier4' },
    { key: 'tier5', label: '5. Math & Execution', prefix: 'tier5' }
  ];

  const getTierForModule = (modId = '') => {
    const found = tiers.find(t => modId.startsWith(t.prefix));
    return found ? found.key : 'tier0';
  };

  const [activeTierAccordion, setActiveTierAccordion] = useState(getTierForModule(modules[0]?.id));

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Module selection
  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);

    const modTier = getTierForModule(mod.id);
    setActiveTierAccordion(modTier);

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentIndex = modules.findIndex(m => m.id === selectedModule.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  // Flashcard controls
  const handleNextCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev + 1) % total);
  };
  const handlePrevCard = (total) => {
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev - 1 + total) % total);
  };

  // Quiz controls
  const handleSelectQuizOption = (index, correctIndex) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = (total) => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < total) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-slate-950 font-sans text-slate-100 overflow-hidden">
      
      {/* SIDEBAR SYLLABUS */}
      <aside className="w-full md:w-80 md:min-w-[20rem] md:max-w-[20rem] border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 h-56 md:h-full select-none">
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Course Syllabus</span>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/60">
            {modules.length} Lessons
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
          {tiers.map(tier => {
            const tierModules = modules.filter(m => m.id.startsWith(tier.prefix));
            if (tierModules.length === 0) return null;
            const isOpen = activeTierAccordion === tier.key;

            return (
              <div key={tier.key} className="rounded-lg border border-slate-800/80 overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => setActiveTierAccordion(isOpen ? '' : tier.key)}
                  className="w-full px-3 py-2.5 bg-slate-900/80 hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors border-b border-slate-800/50"
                >
                  <span className="text-xs font-bold text-slate-300 tracking-wide flex items-center gap-1.5">
                    {tier.label}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-1 space-y-1 bg-slate-950/60">
                    {tierModules.map(mod => {
                      const isSelected = selectedModule.id === mod.id;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleSelectModule(mod)}
                          className={`w-full px-2.5 py-2 rounded-md text-xs text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                          }`}
                        >
                          <span className="truncate pr-2">{mod.title}</span>
                          <span className="text-[11px] opacity-70 shrink-0 font-mono">
                            {mod.type === 'comprehensive_lesson' ? '📖' : mod.type === 'flashcard' ? '⚡' : '🎯'}
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

      {/* MAIN CONTENT AREA */}
      <div 
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto bg-slate-950 flex flex-col justify-between [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div className="max-w-4xl mx-auto w-full p-6 md:p-10 space-y-8">
          
          {/* MACRO PHASE HEADER RAIL */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 text-[11px] font-mono select-none">
            {tiers.map(t => {
              const active = getTierForModule(selectedModule.id) === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    const firstInTier = modules.find(m => m.id.startsWith(t.prefix));
                    if (firstInTier) handleSelectModule(firstInTier);
                  }}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors border ${
                    active 
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-semibold' 
                      : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* LESSON HEADER */}
          <header className="space-y-3 pb-6 border-b border-slate-800/80">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-900/60 font-semibold">
                Al Brooks Masterclass
              </span>
              {selectedModule.estimatedReadTime && (
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  ⏱ {selectedModule.estimatedReadTime} read
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {selectedModule.title}
            </h1>
          </header>

          {/* COMPREHENSIVE LESSON RENDERER */}
          {selectedModule.type === 'comprehensive_lesson' && selectedModule.sections && (
            <div className="space-y-8">
              {selectedModule.sections.map((sec, idx) => (
                <article 
                  key={idx} 
                  className="p-6 md:p-8 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 transition-all"
                >
                  <h2 className="text-lg md:text-xl font-bold text-blue-300 flex items-center gap-2.5 border-b border-slate-800/60 pb-3">
                    <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900/50">
                      0{idx + 1}
                    </span>
                    {sec.heading}
                  </h2>

                  <FormattedSectionContent content={sec.content} />

                  {sec.keyRule && (
                    <div className="p-4 bg-blue-950/40 border-l-4 border-blue-500 rounded-r-lg space-y-1 mt-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold block">
                        Core Brooks Rule
                      </span>
                      <p className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed">
                        {sec.keyRule}
                      </p>
                    </div>
                  )}

                  {sec.barBreakdownExample && (
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 mt-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
                        🧠 Institutional Psychology Breakdown
                      </span>
                      <p className="text-xs font-mono text-slate-400">
                        <strong className="text-slate-300">Scenario:</strong> {sec.barBreakdownExample.scenario}
                      </p>
                      <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                        <strong className="text-slate-300">Mechanics:</strong> {sec.barBreakdownExample.psychology}
                      </p>
                    </div>
                  )}
                </article>
              ))}

              {/* DYNAMIC SVG CHART ILLUSTRATION RENDERER */}
              {selectedModule.chartIllustration && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-200">
                      📊 {selectedModule.chartIllustration.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedModule.chartIllustration.description}
                    </p>
                  </div>
                  
                  <div className="w-full h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                    
                    {/* TIER 0 SVGS */}
                    {selectedModule.chartIllustration.svgType === 'double_auction_microstructure' && (
                      <svg className="w-full h-full max-h-48 text-slate-700 select-none" viewBox="0 0 500 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* DOM Ladder */}
                        <rect x="20" y="20" width="160" height="140" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="4" />
                        <text x="100" y="36" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LIMIT ORDER BOOK (DOM)</text>
                        
                        {/* Ask Depth */}
                        <rect x="25" y="44" width="70" height="12" fill="#4c0519" opacity="0.6" />
                        <text x="100" y="53" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle">5020.50 (290 Ask)</text>
                        <rect x="25" y="58" width="55" height="12" fill="#4c0519" opacity="0.8" />
                        <text x="100" y="67" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle">5020.25 (185 Ask)</text>

                        {/* Best Bid / Spread */}
                        <rect x="25" y="74" width="150" height="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" rx="2" />
                        <text x="100" y="84" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SPREAD: 5020.00 x 5020.25</text>

                        {/* Bid Depth */}
                        <rect x="25" y="92" width="65" height="12" fill="#064e3b" opacity="0.8" />
                        <text x="100" y="101" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">5020.00 (142 Bid)</text>
                        <rect x="25" y="106" width="95" height="12" fill="#064e3b" opacity="0.6" />
                        <text x="100" y="115" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">5019.75 (310 Bid)</text>

                        {/* Aggressive Sweep Arrow */}
                        <path d="M 185 80 L 235 80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrow)" />
                        <text x="210" y="72" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Sweep</text>

                        {/* Real-time 5-min Candle */}
                        <rect x="245" y="20" width="110" height="140" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="4" />
                        <text x="300" y="36" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">5-MIN ES CANDLE</text>
                        <line x1="300" y1="45" x2="300" y2="145" stroke="#10b981" strokeWidth="2" />
                        <rect x="285" y="60" width="30" height="70" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
                        <text x="300" y="160" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle">C: 5020.25 (Top 20%)</text>

                        {/* Stale Oscillator Curve */}
                        <rect x="365" y="20" width="115" height="140" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="4" />
                        <text x="422" y="36" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OSCILLATOR (STALE)</text>
                        <path d="M 375 120 Q 400 125, 425 110 T 470 95" stroke="#f59e0b" strokeWidth="2" fill="none" />
                        <line x1="375" y1="130" x2="470" y2="130" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
                        <text x="422" y="145" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Lagging by 14 bars</text>
                      </svg>
                    )}

                    {selectedModule.chartIllustration.svgType === 'master_feedback_loop' && (
                      <svg className="w-full h-full max-h-48 text-slate-700 select-none" viewBox="0 0 500 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Node 1: Learn Mode */}
                        <rect x="30" y="55" width="120" height="70" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" rx="6" />
                        <text x="90" y="85" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">1. LEARN MODE</text>
                        <text x="90" y="102" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Theory & Microstructure</text>

                        {/* Arrow 1 -> 2 */}
                        <path d="M 155 90 L 195 90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="175" y="82" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Apply</text>

                        {/* Node 2: Simulator */}
                        <rect x="200" y="55" width="120" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2" rx="6" />
                        <text x="260" y="85" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2. SIMULATOR</text>
                        <text x="260" y="102" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Execution & Sizing</text>

                        {/* Arrow 2 -> 3 */}
                        <path d="M 325 90 L 365 90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="345" y="82" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Audit</text>

                        {/* Node 3: AI Mentor */}
                        <rect x="370" y="55" width="115" height="70" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="6" />
                        <text x="427" y="85" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3. AI MENTOR</text>
                        <text x="427" y="102" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Trader's Equation</text>

                        {/* Bottom Feedback Loop Ray */}
                        <path d="M 427 130 C 427 165, 90 165, 90 130" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                        <text x="260" y="165" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Continuous Feedback & Calibration</text>
                      </svg>
                    )}

                    {/* TIER 1 SVGS */}
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

                    {selectedModule.chartIllustration.svgType === 'inside_bar' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="140" y1="10" x2="140" y2="140" stroke="#3b82f6" strokeWidth="2" />
                        <rect x="120" y="30" width="40" height="90" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                        <text x="110" y="145" fill="#3b82f6" fontSize="9" fontFamily="monospace">Mother Bar (1)</text>

                        <line x1="260" y1="45" x2="260" y2="105" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="245" y="55" width="30" height="40" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                        <text x="235" y="145" fill="#f59e0b" fontSize="9" fontFamily="monospace">Inside Bar (2)</text>
                      </svg>
                    )}

                    {selectedModule.chartIllustration.svgType === 'outside_bar' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="140" y1="50" x2="140" y2="100" stroke="#94a3b8" strokeWidth="2" />
                        <rect x="125" y="60" width="30" height="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
                        <text x="120" y="145" fill="#94a3b8" fontSize="9" fontFamily="monospace">Prior Bar</text>

                        <line x1="260" y1="15" x2="260" y2="135" stroke="#10b981" strokeWidth="2" />
                        <rect x="240" y="25" width="40" height="100" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
                        <text x="230" y="145" fill="#10b981" fontSize="9" fontFamily="monospace">Outside Bar (OB)</text>
                      </svg>
                    )}

                    {selectedModule.chartIllustration.svgType === 'signal_vs_entry' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="130" y1="30" x2="130" y2="120" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="115" y="45" width="30" height="60" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
                        <text x="110" y="140" fill="#f59e0b" fontSize="9" fontFamily="monospace">Signal Bar (Setup)</text>

                        <line x1="270" y1="15" x2="270" y2="110" stroke="#3b82f6" strokeWidth="2" />
                        <rect x="255" y="25" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
                        <text x="245" y="140" fill="#3b82f6" fontSize="9" fontFamily="monospace">Entry Bar (Trigger)</text>
                      </svg>
                    )}

                    {selectedModule.chartIllustration.svgType === 'reversal_bar' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="200" y1="10" x2="200" y2="140" stroke="#ec4899" strokeWidth="2" />
                        <rect x="180" y="20" width="40" height="90" fill="#831843" stroke="#ec4899" strokeWidth="2" rx="2" />
                        <text x="160" y="145" fill="#ec4899" fontSize="9" fontFamily="monospace">Reversal Bar (Climax Close)</text>
                      </svg>
                    )}

                    {selectedModule.chartIllustration.svgType === 'micro_channel' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="30" y="30" width="140" height="90" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
                        <text x="60" y="80" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold">Trend State (30-40%)</text>
                        <rect x="230" y="30" width="140" height="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
                        <text x="245" y="80" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">Trading Range (60-70%)</text>
                      </svg>
                    )}

                    {/* TIER 2 SVGS */}
                    {selectedModule.chartIllustration.svgType === 'always_in_flip' && (
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
          )}

          {/* FLASHCARD RENDERER */}
          {selectedModule.type === 'flashcard' && selectedModule.flashcards && (
            <div className="w-full max-w-md mx-auto space-y-4 pt-6">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Card {currentCardIndex + 1} of {selectedModule.flashcards.length}</span>
                <span>Click card to flip</span>
              </div>
              
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-slate-700 transition-all select-none text-center"
              >
                {!isFlipped ? (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-blue-400 font-semibold">Question</span>
                    <h3 className="text-lg font-bold text-slate-100">
                      {selectedModule.flashcards[currentCardIndex].question}
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-emerald-400 font-semibold">Answer</span>
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
                <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-xl space-y-6 shadow-xl">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                    <span>Question {currentQuestionIndex + 1} of {selectedModule.questions.length}</span>
                    <span>Score: {quizScore}</span>
                  </div>

                  <p className="text-base md:text-lg font-bold text-slate-100 leading-relaxed">
                    {selectedModule.questions[currentQuestionIndex].prompt}
                  </p>

                  <div className="space-y-3">
                    {selectedModule.questions[currentQuestionIndex].options.map((option, idx) => {
                      let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900";
                      
                      if (showExplanation) {
                        if (idx === selectedModule.questions[currentQuestionIndex].correctIndex) {
                          btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold";
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
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selectedOption === selectedModule.questions[currentQuestionIndex].correctIndex ? '✓ Correct Decision' : '✕ Structural Misread'}
                      </span>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        {selectedModule.questions[currentQuestionIndex].explanation}
                      </p>
                      
                      <button
                        onClick={() => handleNextQuizQuestion(selectedModule.questions.length)}
                        className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        {currentQuestionIndex + 1 < selectedModule.questions.length ? 'Next Question ➔' : 'View Tier Results 🏆'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center space-y-6 shadow-2xl">
                  <span className="text-4xl">🏆</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Tier Certification Complete</h3>
                    <p className="text-sm text-slate-300 font-mono">
                      Final Score: <strong className="text-emerald-400">{quizScore}</strong> / <strong className="text-slate-200">{selectedModule.questions.length}</strong>
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleSelectModule(selectedModule)}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Review Mistakes ↺
                    </button>
                    {nextModule && (
                      <button
                        onClick={() => handleSelectModule(nextModule)}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        Advance to Next Tier ➔
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* GUIDED FOOTER NAVIGATION */}
        <footer className="border-t border-slate-800/80 bg-slate-900/60 p-4 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {prevModule ? (
              <button
                onClick={() => handleSelectModule(prevModule)}
                className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                ◀ Previous
              </button>
            ) : <div />}

            <div className="text-center font-mono text-xs text-slate-400 hidden sm:block">
              Module {currentIndex + 1} of {modules.length}
            </div>

            {nextModule ? (
              <button
                onClick={() => handleSelectModule(nextModule)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                Complete & Advance ➔
              </button>
            ) : <div />}
          </div>
        </footer>

      </div>
    </div>
  );
}
