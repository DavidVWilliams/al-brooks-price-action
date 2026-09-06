// Version: v1.0 - Tier 1 Interactive Body-to-Range Ratio & Conviction Gauge
// Demonstrates institutional bar grading based on real body size vs total range.

import { useState } from 'react';

export default function BodyRangeRatioLab() {
  // Use percentages (0 to 100) for slider controls. 0 = Low extreme, 100 = High extreme.
  const [openPct, setOpenPct] = useState(20);
  const [closePct, setClosePct] = useState(85);

  const handleReset = () => {
    setOpenPct(20);
    setClosePct(85);
  };

  // Derive math for rendering and logic
  const isBull = closePct >= openPct;
  const bodySize = Math.abs(closePct - openPct);
  const closeLocation = closePct; 

  // Institutional Grading Logic
  const getConvictionGrade = () => {
    if (bodySize >= 70 && ((isBull && closePct >= 80) || (!isBull && closePct <= 20))) {
      return {
        label: 'A+ Strong Trend Bar',
        color: isBull ? 'text-emerald-400' : 'text-rose-400',
        bg: isBull ? 'bg-emerald-950/40 border-emerald-900' : 'bg-rose-950/40 border-rose-900',
        desc: 'Massive institutional conviction. Algorithms will blindly add to this momentum. Fading this is financial suicide.'
      };
    } else if (bodySize <= 25) {
      return {
        label: 'Doji / Stalemate',
        color: 'text-slate-400',
        bg: 'bg-slate-900 border-slate-700',
        desc: 'Absolute equilibrium. Both bulls and bears have equal capital deployed here. Represents a pause or potential trading range.'
      };
    } else if (bodySize > 25 && bodySize < 70) {
      if ((isBull && closePct < 50) || (!isBull && closePct > 50)) {
        return {
          label: 'Trap / Rejection Bar',
          color: 'text-amber-400',
          bg: 'bg-amber-950/40 border-amber-900',
          desc: 'The bar attempted to trend but failed, closing against its intra-bar momentum. High probability trap.'
        };
      }
      return {
        label: 'Average / Noise',
        color: 'text-blue-400',
        bg: 'bg-blue-950/40 border-blue-900',
        desc: 'A standard bar with moderate conviction. Needs strong surrounding context to be tradable.'
      };
    }
    return { label: 'Evaluating...', color: 'text-slate-400', bg: 'bg-slate-900', desc: '' };
  };

  const grade = getConvictionGrade();

  // SVG Geometry mappings
  const svgH = 220;
  const paddingY = 20;
  // 100% is top of wick (paddingY), 0% is bottom of wick (svgH - paddingY)
  const getY = (pct) => (svgH - paddingY) - (pct / 100) * (svgH - paddingY * 2);

  const openY = getY(openPct);
  const closeY = getY(closePct);
  const highY = getY(100);
  const lowY = getY(0);

  const bodyTop = Math.min(openY, closeY);
  const bodyH = Math.max(2, Math.abs(openY - closeY)); // minimum 2px so dojis are visible

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-2xl space-y-6 text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-xs font-semibold border border-blue-900/60">
              Interactive Micro-Lab
            </span>
            <h3 className="text-base md:text-lg font-bold text-white">
              Body-to-Range Ratio & Institutional Conviction
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Adjust the open and close sliders to see how algorithms mathematically score candlestick conviction.
          </p>
        </div>
      </div>

      {/* LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Slide the <strong>Open</strong> to 20% and the <strong>Close</strong> to 80%. Observe the <strong className="text-emerald-400">A+ Strong Trend Bar</strong> rating.</li>
          <li>Now, squeeze the Open and Close close together (e.g., Open 50%, Close 50%). Watch it downgrade to a <strong className="text-slate-400">Doji / Stalemate</strong>.</li>
          <li><strong>Takeaway:</strong> Color doesn't matter as much as the body's percentage of the total range. Small bodies equal chop; large bodies equal institutional momentum.</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: CANDLESTICK RENDERER & SLIDERS */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center flex-1">
            <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Dynamic Visualizer
            </span>

            <svg className="w-full h-56 select-none" viewBox="0 0 240 220">
              {/* Range background highlight */}
              <rect x="95" y={highY} width="50" height={lowY - highY} fill="#1e293b" opacity="0.3" rx="2" />
              
              {/* High/Low Reference Lines */}
              <line x1="40" y1={highY} x2="200" y2={highY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="35" y={highY + 3} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">High</text>
              
              <line x1="40" y1={lowY} x2="200" y2={lowY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="35" y={lowY + 3} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">Low</text>

              {/* Candlestick Wick */}
              <line x1="120" y1={highY} x2="120" y2={lowY} stroke={isBull ? '#10b981' : '#f43f5e'} strokeWidth="2" />

              {/* Candlestick Real Body */}
              <rect
                x="95"
                y={bodyTop}
                width="50"
                height={bodyH}
                fill={isBull ? '#065f46' : '#881337'}
                stroke={isBull ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                rx="2"
              />

              {/* Open/Close Pointers */}
              <path d={`M 150 ${openY} L 160 ${openY - 5} L 160 ${openY + 5} Z`} fill="#94a3b8" />
              <text x="165" y={openY + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace">Open</text>

              <path d={`M 150 ${closeY} L 160 ${closeY - 5} L 160 ${closeY + 5} Z`} fill="#f8fafc" />
              <text x="165" y={closeY + 3} fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">Close</text>
            </svg>
          </div>

          {/* SLIDERS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Open Position</span>
                <span className="text-slate-200">{openPct}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="1" value={openPct}
                onChange={(e) => setOpenPct(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Close Position</span>
                <span className="text-white font-bold">{closePct}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="1" value={closePct}
                onChange={(e) => setClosePct(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME HUD & GRADING */}
        <div className="md:col-span-7 space-y-4 flex flex-col">
          
          <div className={`flex-1 p-5 rounded-xl border flex flex-col justify-center space-y-2 transition-colors ${grade.bg}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">Institutional Grading</span>
            <h4 className={`text-2xl font-black ${grade.color}`}>{grade.label}</h4>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {grade.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Body-to-Range Ratio</span>
              <span className="text-2xl font-mono font-bold text-white">{bodySize}%</span>
              <span className="text-[10px] font-mono text-slate-400">
                {bodySize >= 70 ? 'Trend Profile' : bodySize <= 25 ? 'Doji Profile' : 'Mixed Profile'}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Closing Location</span>
              <span className="text-2xl font-mono font-bold text-white">{closeLocation}%</span>
              <span className="text-[10px] font-mono text-slate-400">
                {closeLocation >= 80 ? 'Top 20% Extreme' : closeLocation <= 20 ? 'Bottom 20% Extreme' : 'Middle of Range'}
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-1">Presets:</span>
            <button onClick={() => {setOpenPct(15); setClosePct(90)}} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-emerald-400 transition-colors">
              Strong Bull
            </button>
            <button onClick={() => {setOpenPct(85); setClosePct(10)}} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-rose-400 transition-colors">
              Strong Bear
            </button>
            <button onClick={() => {setOpenPct(50); setClosePct(50)}} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-300 transition-colors">
              Perfect Doji
            </button>
            <button onClick={() => {setOpenPct(80); setClosePct(85)}} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-amber-400 transition-colors">
              Bull Trap
            </button>
            <div className="flex-1 text-right">
              <button onClick={handleReset} className="px-2.5 py-1 text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors">
                ↺ Reset
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
