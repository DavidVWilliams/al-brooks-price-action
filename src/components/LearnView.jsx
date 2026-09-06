// Version: v6.2 - Bulletproof Static SVG Illustration Engine for Tiers 0-5
import { useState, useMemo, useEffect } from 'react';
import rawData from '../data/curriculumData.js';
import { getInteractiveLab } from './interactive/LabRegistry.jsx';

const TIERS = [
  { id: 'tier0', label: 'Orientation: The Price Action Paradigm' },
  { id: 'tier1', label: 'Tier 1: Bar Anatomy & Microstructure' },
  { id: 'tier2', label: 'Tier 2: Market Flow & Breakouts' },
  { id: 'tier3', label: 'Tier 3: The Engine Room (Pullbacks & Ranges)' },
  { id: 'tier4', label: 'Tier 4: Advanced Setups (Reversals & Climaxes)' },
  { id: 'tier5', label: 'Tier 5: Math & Execution (Trader\'s Equation & Risk)' },
];

// Dedicated Vector Illustration Renderer
function LessonChartIllustration({ selectedModule }) {
  const svgType = selectedModule?.chartIllustration?.svgType || '';
  const id = (selectedModule?.id || '').toLowerCase();
  const title = (selectedModule?.title || '').toLowerCase();

  // --- TIER 0: 0.1 DOM AUCTION & ORDER BOOK DEPTH ---
  if (
    svgType === 'order_book_dom' ||
    svgType === 'dom_order_book' ||
    svgType === 'auction_microstructure' ||
    id.includes('0.1') ||
    title.includes('auction theory') ||
    title.includes('microstructure') ||
    title.includes('order book')
  ) {
    return (
      <svg className="w-full h-full max-h-40 text-slate-700" viewBox="0 0 440 150" fill="none">
        {/* Resting Asks (Sellers) */}
        <rect x="30" y="15" width="130" height="20" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" rx="3" />
        <text x="40" y="29" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">ASK 5022.50 [140]</text>

        <rect x="30" y="39" width="105" height="20" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" rx="3" />
        <text x="40" y="53" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">ASK 5022.25 [95]</text>

        {/* 1-Tick Spread / Inside Market */}
        <line x1="20" y1="68" x2="180" y2="68" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="100" y="78" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">1-Tick Inside Spread (NBBO)</text>

        {/* Resting Bids (Buyers) */}
        <rect x="30" y="86" width="115" height="20" fill="#065f46" stroke="#10b981" strokeWidth="1.5" rx="3" />
        <text x="40" y="100" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">BID 5021.75 [110]</text>

        <rect x="30" y="110" width="140" height="20" fill="#065f46" stroke="#10b981" strokeWidth="1.5" rx="3" />
        <text x="40" y="124" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">BID 5021.50 [185]</text>

        {/* Dynamic Aggressive Market Order Sweep */}
        <path d="M 230 120 L 230 35" stroke="#38bdf8" strokeWidth="3" />
        <polygon points="222,40 238,40 230,26" fill="#38bdf8" />
        <text x="245" y="50" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">Market Buy Sweep (+220)</text>
        <text x="245" y="68" fill="#94a3b8" fontSize="9" fontFamily="monospace">Aggressive Flow Lifts Resting Asks</text>
        <text x="245" y="84" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Instant Real-Time Price Discovery</text>
        <text x="245" y="102" fill="#ef4444" fontSize="9" fontFamily="monospace">⚡ Supersedes Lagging Indicators</text>
      </svg>
    );
  }

  // --- TIER 0: 0.2 DUAL-ENGINE ARCHITECTURE & FEEDBACK LOOP ---
  if (
    svgType === 'dual_engine_loop' ||
    svgType === 'dual_engine_diagram' ||
    svgType === 'learning_methodology' ||
    id.includes('0.2') ||
    title.includes('mindset') ||
    title.includes('master this platform') ||
    title.includes('methodology')
  ) {
    return (
      <svg className="w-full h-full max-h-40 text-slate-700" viewBox="0 0 440 150" fill="none">
        {/* Node 1: Learn Mode */}
        <rect x="25" y="42" width="105" height="58" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" rx="4" />
        <text x="77" y="66" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">1. Learn Mode</text>
        <text x="77" y="82" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Brooks Axioms</text>

        <line x1="130" y1="71" x2="165" y2="71" stroke="#38bdf8" strokeWidth="2.5" />
        <polygon points="163,67 171,71 163,75" fill="#38bdf8" />

        {/* Node 2: Simulator Mode */}
        <rect x="170" y="42" width="115" height="58" fill="#0f172a" stroke="#10b981" strokeWidth="2" rx="4" />
        <text x="227" y="66" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2. Simulator</text>
        <text x="227" y="82" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Live Execution</text>

        <line x1="285" y1="71" x2="315" y2="71" stroke="#38bdf8" strokeWidth="2.5" />
        <polygon points="313,67 321,71 313,75" fill="#38bdf8" />

        {/* Node 3: AI Mentor */}
        <rect x="320" y="42" width="100" height="58" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="4" />
        <text x="370" y="66" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3. AI Mentor</text>
        <text x="370" y="82" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Expectancy Audit</text>

        {/* Feedback loop arrow */}
        <path d="M 370 100 L 370 126 L 77 126 L 77 100" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <polygon points="73,103 81,103 77,95" fill="#475569" />
        <text x="225" y="140" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">Closed-Loop Expectancy Feedback Cycle</text>
      </svg>
    );
  }

  // --- TIER 1: 1.1 BULL VS BEAR ---
  if (svgType === 'bull_vs_bear' || id.includes('1.1')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
        <rect x="105" y="40" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
        <text x="90" y="15" fill="#3b82f6" fontSize="10" fontFamily="monospace">Bull Trend Bar (Top 20% Close)</text>
        <line x1="280" y1="20" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2" />
        <rect x="265" y="35" width="30" height="75" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="2" />
        <text x="245" y="15" fill="#f43f5e" fontSize="10" fontFamily="monospace">Bear Trend Bar (Bottom 20% Close)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.2 DOJI EQUILIBRIUM ---
  if (svgType === 'doji_equilibrium' || id.includes('1.2')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="120" y1="20" x2="120" y2="130" stroke="#3b82f6" strokeWidth="2" />
        <rect x="105" y="40" width="30" height="70" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
        <text x="95" y="15" fill="#3b82f6" fontSize="10" fontFamily="monospace">Strong Trend Body</text>
        <line x1="280" y1="20" x2="280" y2="130" stroke="#94a3b8" strokeWidth="2" />
        <rect x="265" y="73" width="30" height="4" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
        <text x="245" y="15" fill="#94a3b8" fontSize="10" fontFamily="monospace">Doji (Center 50% Equilibrium)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.3 INSIDE BAR ---
  if (svgType === 'inside_bar' || id.includes('1.3')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="140" y1="10" x2="140" y2="140" stroke="#3b82f6" strokeWidth="2" />
        <rect x="120" y="30" width="40" height="90" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
        <text x="110" y="145" fill="#3b82f6" fontSize="9" fontFamily="monospace">Mother Bar (1)</text>
        <line x1="260" y1="45" x2="260" y2="105" stroke="#f59e0b" strokeWidth="2" />
        <rect x="245" y="55" width="30" height="40" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
        <text x="235" y="145" fill="#f59e0b" fontSize="9" fontFamily="monospace">Inside Bar (2: Compression)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.4 OUTSIDE BAR ---
  if (svgType === 'outside_bar' || id.includes('1.4')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="140" y1="50" x2="140" y2="100" stroke="#94a3b8" strokeWidth="2" />
        <rect x="125" y="60" width="30" height="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="2" />
        <text x="120" y="145" fill="#94a3b8" fontSize="9" fontFamily="monospace">Prior Bar</text>
        <line x1="260" y1="15" x2="260" y2="135" stroke="#10b981" strokeWidth="2" />
        <rect x="240" y="25" width="40" height="100" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="2" />
        <text x="220" y="145" fill="#10b981" fontSize="9" fontFamily="monospace">Outside Bar (Double Sweep Trap)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.5 SIGNAL VS ENTRY BAR ---
  if (svgType === 'signal_vs_entry' || id.includes('1.5')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="130" y1="30" x2="130" y2="120" stroke="#f59e0b" strokeWidth="2" />
        <rect x="115" y="45" width="30" height="60" fill="#78350f" stroke="#f59e0b" strokeWidth="2" rx="2" />
        <text x="105" y="140" fill="#f59e0b" fontSize="9" fontFamily="monospace">Signal Bar (Setup Definition)</text>
        <line x1="270" y1="15" x2="270" y2="110" stroke="#3b82f6" strokeWidth="2" />
        <rect x="255" y="25" width="30" height="75" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
        <text x="245" y="140" fill="#3b82f6" fontSize="9" fontFamily="monospace">Entry Bar (+1 Tick Trigger)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.6 REVERSAL BAR ---
  if (svgType === 'reversal_bar' || id.includes('1.6')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="200" y1="10" x2="200" y2="140" stroke="#ec4899" strokeWidth="2" />
        <rect x="180" y="20" width="40" height="90" fill="#831843" stroke="#ec4899" strokeWidth="2" rx="2" />
        <text x="145" y="145" fill="#ec4899" fontSize="9" fontFamily="monospace">Reversal Bar (Exhaustion Tail + Climax Close)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.7 MICRO CHANNEL ---
  if (svgType === 'micro_channel' || id.includes('1.7')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <rect x="90" y="90" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
        <rect x="150" y="70" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" rx="1" />
        <rect x="210" y="50" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
        <rect x="270" y="30" width="20" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="1" />
        <text x="145" y="140" fill="#3b82f6" fontSize="9" fontFamily="monospace">Tight Bull Micro Channel (Consecutive Higher Lows)</text>
      </svg>
    );
  }

  // --- TIER 1: 1.8 MARKET STATES ---
  if (svgType === 'market_states' || id.includes('1.8')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <rect x="30" y="30" width="140" height="90" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
        <text x="45" y="80" fill="#3b82f6" fontSize="10" fontFamily="monospace" fontWeight="bold">Trend State (30-40%)</text>
        <rect x="230" y="30" width="140" height="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
        <text x="235" y="80" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">Trading Range (60-70%)</text>
      </svg>
    );
  }

  // --- TIER 2: 2.1 ALWAYS IN FLIP ---
  if (svgType === 'always_in_flip' || id.includes('2.1')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="50" y1="50" x2="150" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="70" y="70" width="16" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <rect x="100" y="90" width="16" height="25" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <rect x="130" y="110" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <rect x="180" y="30" width="24" height="110" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="2" />
        <text x="192" y="20" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">AIL Surprise Bar (Direction Flip)</text>
      </svg>
    );
  }

  // --- TIER 2: 2.2 SPIKE AND CHANNEL ---
  if (svgType === 'spike_and_channel' || id.includes('2.2')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <rect x="50" y="90" width="16" height="50" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="75" y="40" width="16" height="55" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="100" y="15" width="16" height="40" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <text x="75" y="130" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Spike (Urgency)</text>
        <line x1="130" y1="50" x2="280" y2="15" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="130" y1="90" x2="280" y2="55" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="210" y="75" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">Channel (Diagonal Range)</text>
      </svg>
    );
  }

  // --- TIER 2: 2.3 BREAKOUT VS FAILURE ---
  if (svgType === 'breakout_vs_failure' || id.includes('2.3')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="20" y1="75" x2="380" y2="75" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
        <text x="200" y="70" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">Range Resistance</text>
        <rect x="70" y="45" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="95" y="20" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <text x="85" y="15" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">20% Genuine Breakout</text>
        <rect x="280" y="45" width="16" height="45" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="305" y="55" width="16" height="40" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <text x="295" y="15" fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="middle">80% Breakout Trap (FBO)</text>
      </svg>
    );
  }

  // --- TIER 2: 2.4 MEASURED MOVE ---
  if (svgType === 'leg1_leg2_measured_move' || id.includes('2.4')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="50" y1="130" x2="120" y2="60" stroke="#3b82f6" strokeWidth="4" />
        <text x="70" y="100" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 1</text>
        <line x1="120" y1="60" x2="160" y2="90" stroke="#f43f5e" strokeWidth="4" />
        <line x1="160" y1="90" x2="230" y2="20" stroke="#3b82f6" strokeWidth="4" />
        <text x="200" y="50" fill="#94a3b8" fontSize="10" fontFamily="monospace">Leg 2</text>
        <line x1="160" y1="90" x2="160" y2="20" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <text x="260" y="25" fill="#f59e0b" fontSize="10" fontFamily="monospace">Leg 1 = Leg 2 Target (PTZ)</text>
      </svg>
    );
  }

  // --- TIER 3: HIGH 1 / HIGH 2 ---
  if (svgType === 'high1_high2' || id.includes('3.1')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <path d="M 40 120 Q 150 110 360 80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
        <text x="365" y="83" fill="#38bdf8" fontSize="9" fontFamily="monospace">20 EMA</text>
        <rect x="70" y="50" width="16" height="50" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="110" y="70" width="16" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <text x="118" y="115" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">H1</text>
        <rect x="150" y="85" width="16" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <rect x="180" y="65" width="18" height="45" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="1" />
        <text x="189" y="55" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">H2 Entry (~60%)</text>
      </svg>
    );
  }

  // --- TIER 3: LOW 1 / LOW 2 ---
  if (svgType === 'low1_low2' || id.includes('3.2')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <path d="M 40 30 Q 150 40 360 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
        <text x="365" y="73" fill="#38bdf8" fontSize="9" fontFamily="monospace">20 EMA</text>
        <rect x="70" y="50" width="16" height="50" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
        <rect x="110" y="40" width="16" height="30" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <text x="118" y="30" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">L1</text>
        <rect x="150" y="35" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="180" y="50" width="18" height="45" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
        <text x="189" y="115" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L2 Short Entry</text>
      </svg>
    );
  }

  // --- TIER 3: 20 EMA GAP BAR ---
  if (svgType === 'ma_gap_bar' || id.includes('3.3')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="30" y1="65" x2="370" y2="65" stroke="#38bdf8" strokeWidth="2" />
        <text x="375" y="68" fill="#38bdf8" fontSize="9" fontFamily="monospace">20 EMA</text>
        <rect x="80" y="20" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="140" y="25" width="16" height="35" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
        <rect x="200" y="80" width="18" height="35" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
        <line x1="209" y1="72" x2="209" y2="80" stroke="#f43f5e" strokeWidth="1.5" />
        <text x="209" y="130" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">Gap Bar (Entirely Below EMA)</text>
        <path d="M 230 90 Q 280 40 330 20" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
        <text x="335" y="18" fill="#10b981" fontSize="9" fontFamily="monospace">~75% Test of High</text>
      </svg>
    );
  }

  // --- TIER 3: WEDGE PULLBACK ---
  if (svgType === 'wedge_pullback' || id.includes('3.4')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="60" y1="40" x2="280" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="100" y1="90" x2="290" y2="120" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="110" y="45" fill="#94a3b8" fontSize="9" fontFamily="monospace">Push 1</text>
        <text x="180" y="70" fill="#94a3b8" fontSize="9" fontFamily="monospace">Push 2</text>
        <text x="250" y="95" fill="#94a3b8" fontSize="9" fontFamily="monospace">Push 3 (Exhaustion)</text>
        <rect x="295" y="75" width="18" height="40" fill="#065f46" stroke="#10b981" strokeWidth="2" rx="1" />
        <text x="304" y="65" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Wedge Reversal</text>
      </svg>
    );
  }

  // --- TIER 3: BARB WIRE ---
  if (svgType === 'barb_wire' || id.includes('3.5')) {
    return (
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
          Barb Wire: Flat 20 EMA & Heavy Overlap (Limit Orders Only)
        </text>
      </svg>
    );
  }

  // --- TIER 4: REVERSALS, MTR, CLIMAXES ---
  if (svgType === 'mtr_reversal' || id.includes('4.')) {
    return (
      <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
        <line x1="40" y1="130" x2="180" y2="40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="180" y1="40" x2="220" y2="90" stroke="#f43f5e" strokeWidth="2" />
        <text x="230" y="95" fill="#f59e0b" fontSize="9" fontFamily="monospace">1. Trendline Break</text>
        <line x1="220" y1="90" x2="280" y2="50" stroke="#3b82f6" strokeWidth="2" />
        <text x="285" y="45" fill="#f59e0b" fontSize="9" fontFamily="monospace">2. Lower High Test</text>
        <rect x="295" y="55" width="18" height="45" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" rx="1" />
        <text x="304" y="120" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MTR Short Trigger</text>
      </svg>
    );
  }

  // --- TIER 5: TRADER'S EQUATION & RISK ---
  return (
    <svg className="w-full h-full max-h-36 text-slate-700" viewBox="0 0 400 150" fill="none">
      <line x1="200" y1="30" x2="200" y2="120" stroke="#475569" strokeWidth="3" />
      <polygon points="180,120 220,120 200,90" fill="#334155" />
      <line x1="70" y1="70" x2="330" y2="70" stroke="#38bdf8" strokeWidth="3" />
      <rect x="60" y="40" width="80" height="30" fill="#065f46" stroke="#10b981" strokeWidth="1.5" rx="3" />
      <text x="100" y="60" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">P × Reward</text>
      <rect x="260" y="40" width="80" height="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" rx="3" />
      <text x="300" y="60" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">(1-P) × Risk</text>
      <text x="200" y="140" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Expectancy &gt; 0: Positive Math Edge</text>
    </svg>
  );
}

export default function LearnView({ activePhase, onSelectPhase }) {
  const data = rawData?.modules ? rawData : (rawData?.curriculumData || { modules: [] });
  const modules = data.modules || [];

  const [selectedModule, setSelectedModule] = useState(modules[0] || {});

  const currentTierId = selectedModule.id?.split('-')[0] || 'tier0';
  const [openTier, setOpenTier] = useState(currentTierId);

  useEffect(() => {
    if (activePhase) {
      setOpenTier(activePhase);
      const firstInPhase = modules.find((m) => m.id && m.id.startsWith(activePhase));
      if (firstInPhase && selectedModule.id?.split('-')[0] !== activePhase) {
        handleSelectModule(firstInPhase);
      }
    }
  }, [activePhase]);

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
    if (modTier) {
      setOpenTier(modTier);
      if (onSelectPhase) onSelectPhase(modTier);
    }

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
    <div className="w-full h-full flex-1 flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* SIDEBAR ACCORDION */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 h-56 md:h-full select-none">
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Course Syllabus
            </h3>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              Al Brooks Price Action Mastery
            </span>
          </div>
          <span className="text-xs font-mono text-blue-400 bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-900/60 font-medium">
            {modules.length} Lessons
          </span>
        </div>

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
                  <span className="truncate pr-2">{tier.label}</span>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] shrink-0">
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

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
            
            {/* Header */}
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-950/50 px-2.5 py-1 rounded border border-blue-900/50">
                    {TIERS.find((t) => t.id === openTier)?.label || 'Mastery Curriculum'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    / Lesson {currentIndex + 1} of {modules.length}
                  </span>
                </div>
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

            {/* GUARANTEED STATIC SVG ILLUSTRATION CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>📊</span> {selectedModule?.chartIllustration?.title || 'Visual Breakdown: Market Microstructure & Price Action Anatomy'}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedModule?.chartIllustration?.description || 'Tick-by-tick order book depth, institutional absorption footprints, and real-time execution mechanics.'}
              </p>
              
              <div className="w-full h-48 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                <LessonChartIllustration selectedModule={selectedModule} />
              </div>
            </div>

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

            {/* DYNAMIC CAPSTONE MICRO-LAB */}
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
