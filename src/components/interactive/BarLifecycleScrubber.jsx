// Version: v1.0 - Tier 1 Interactive 300-Second Bar Lifecycle Scrubber
// Simulates tick-by-tick bar formation, institutional absorption, and Brooks closing metrics.

import { useState, useEffect, useRef } from 'react';

export default function BarLifecycleScrubber() {
  const [seconds, setSeconds] = useState(0); // 0 to 300
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1x, 2x, 5x, 10x
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  const openPrice = 5020.00;

  // Compute price state at elapsed seconds
  const calculateBarState = (s) => {
    let currentPrice = openPrice;
    let highPrice = openPrice;
    let lowPrice = openPrice;
    let phase = '';
    let narrative = '';
    let retailBias = '';

    if (s <= 30) {
      // 0 - 30s: Initial test up
      const progress = s / 30;
      currentPrice = openPrice + progress * 0.75;
      highPrice = currentPrice;
      lowPrice = openPrice - 0.25;
      phase = 'Open & Initial Liquidity Probe';
      narrative = 'HFT programs probe resting limit orders at the ask. Narrow 3-tick probe.';
      retailBias = 'Neutral / Waiting';
    } else if (s <= 110) {
      // 30s - 110s: Violent bear dump
      const progress = (s - 30) / 80;
      highPrice = openPrice + 0.75;
      currentPrice = (openPrice + 0.75) - progress * 6.75; // drops to 5014.00
      lowPrice = currentPrice;
      phase = 'The Apparent Bear Breakout';
      narrative = 'Large market sell orders sweep bids. Retail momentum traders rush to short at market, fearing they will miss the breakdown.';
      retailBias = 'Heavy Bearish FOMO';
    } else if (s <= 220) {
      // 110s - 220s: Absorption stall at support
      const progress = (s - 110) / 110;
      highPrice = openPrice + 0.75;
      lowPrice = 5014.00;
      currentPrice = 5014.00 + Math.sin(progress * Math.PI * 3) * 0.75 + progress * 1.5; // chops around 5014.50 - 5015.50
      phase = 'Passive Institutional Absorption';
      narrative = 'Smart-money limit bids absorb all retail selling. Bears notice price refusing to tick lower despite heavy volume. Downward momentum has died.';
      retailBias = 'Bears Confused, Stops Clustered Above';
    } else if (s <= 270) {
      // 220s - 270s: Rebound back to open
      const progress = (s - 220) / 50;
      highPrice = openPrice + 0.75;
      lowPrice = 5014.00;
      currentPrice = 5015.50 + progress * 5.00; // rallies to 5020.50
      phase = 'Squeeze Through Open Price';
      narrative = 'Aggressive buyers lift offers back through the open price. Early shorts begin sweating as their unrealized profits evaporate.';
      retailBias = 'Early Shorts in Drawdown';
    } else {
      // 270s - 300s: Final 30-second climax squeeze
      const progress = (s - 270) / 30;
      lowPrice = 5014.00;
      highPrice = openPrice + 0.75 + progress * 2.25; // surges to 5023.00
      currentPrice = 5020.50 + progress * 2.00; // closes at 5022.50
      phase = 'Final 30-Second Climax Squeeze';
      narrative = 'Bears panic and hit buy-to-cover market orders. The bar closes in its top 15%, printing a massive 6-point lower tail. All early bears are completely trapped.';
      retailBias = '100% Trapped Shorts Panicking';
    }

    const totalRange = Math.max(0.5, highPrice - lowPrice);
    const closeLocationPct = Math.round(((currentPrice - lowPrice) / totalRange) * 100);

    return {
      currentPrice,
      highPrice,
      lowPrice,
      totalRange,
      closeLocationPct,
      phase,
      narrative,
      retailBias
    };
  };

  const state = calculateBarState(seconds);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    const updatePlayhead = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setSeconds((prev) => {
        const next = prev + delta * speed;
        if (next >= 300) {
          setIsPlaying(false);
          return 300;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updatePlayhead);
    };

    animFrameRef.current = requestAnimationFrame(updatePlayhead);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speed]);

  // Price coordinate mapper for SVG (range 5012 to 5025)
  const priceMin = 5012.00;
  const priceMax = 5025.00;
  const svgHeight = 220;
  const getY = (p) => svgHeight - ((p - priceMin) / (priceMax - priceMin)) * svgHeight;

  const openY = getY(openPrice);
  const currentY = getY(state.currentPrice);
  const highY = getY(state.highPrice);
  const lowY = getY(state.lowPrice);

  const isBull = state.currentPrice >= openPrice;
  const bodyTop = Math.min(openY, currentY);
  const bodyHeight = Math.max(3, Math.abs(openY - currentY));

  // Format seconds to MM:SS
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
              The 300-Second Bar Lifecycle & The Dominance of the Close
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag the time slider or play the simulation to watch how institutions use the final 30 seconds to trap retail breakout traders.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Clock: <span className="text-blue-400 font-bold">{formatTime(seconds)}</span> / 5:00
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* LEFT: CANDLESTICK CANVAS */}
        <div className="md:col-span-5 bg-slate-950 rounded-xl border border-slate-800/90 p-4 relative flex flex-col items-center justify-center">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            ES 5-Min Canvas
          </span>

          <svg className="w-full h-56 select-none" viewBox="0 0 240 220">
            {/* Grid lines */}
            {[5024, 5022, 5020, 5018, 5016, 5014].map((p) => (
              <g key={p}>
                <line x1="10" y1={getY(p)} x2="230" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <text x="235" y={getY(p) + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                  {p.toFixed(2)}
                </text>
              </g>
            ))}

            {/* Open Price Reference Line */}
            <line x1="20" y1={openY} x2="210" y2={openY} stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="25" y={openY - 4} fill="#94a3b8" fontSize="8" fontFamily="monospace">
              Open: 5020.00
            </text>

            {/* Candlestick Centered Wick */}
            <line
              x1="120"
              y1={highY}
              x2="120"
              y2={lowY}
              stroke={isBull ? '#10b981' : '#f43f5e'}
              strokeWidth="2"
            />

            {/* Candlestick Real Body */}
            <rect
              x="95"
              y={bodyTop}
              width="50"
              height={bodyHeight}
              fill={isBull ? '#065f46' : '#881337'}
              stroke={isBull ? '#10b981' : '#f43f5e'}
              strokeWidth="2"
              rx="2"
            />

            {/* Real-Time Price Pointer */}
            <circle cx="155" cy={currentY} r="3" fill={isBull ? '#34d399' : '#fb7185'} />
            <line x1="155" y1={currentY} x2="175" y2={currentY} stroke={isBull ? '#34d399' : '#fb7185'} strokeWidth="1" />
            <text x="180" y={currentY + 3} fill={isBull ? '#34d399' : '#fb7185'} fontSize="9" fontFamily="monospace" fontWeight="bold">
              {state.currentPrice.toFixed(2)}
            </text>
          </svg>

          {/* Bottom Footprint Badges */}
          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
            <span>High: <strong className="text-slate-200">{state.highPrice.toFixed(2)}</strong></span>
            <span>Low: <strong className="text-slate-200">{state.lowPrice.toFixed(2)}</strong></span>
            <span>Range: <strong className="text-blue-400">{state.totalRange.toFixed(2)} pts</strong></span>
          </div>
        </div>

        {/* RIGHT: REAL-TIME TELEMETRY & AUCTION MECHANICS */}
        <div className="md:col-span-7 space-y-3.5">
          
          {/* Phase Badge */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
              Current Auction State
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${seconds >= 270 ? 'bg-emerald-400 animate-pulse' : seconds >= 110 ? 'bg-amber-400' : 'bg-rose-400'}`} />
              {state.phase}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {state.narrative}
            </p>
          </div>

          {/* Retail Psychology vs Institutional Traps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Retail Crowd Posture
              </span>
              <span className={`text-xs font-bold ${seconds <= 110 ? 'text-rose-400' : seconds >= 270 ? 'text-rose-300' : 'text-amber-400'}`}>
                {state.retailBias}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Closing Footprint Zone
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-white">
                  {state.closeLocationPct}%
                </span>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                  state.closeLocationPct >= 80 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : state.closeLocationPct <= 20 
                    ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {state.closeLocationPct >= 80 ? 'Top 20% (Bull)' : state.closeLocationPct <= 20 ? 'Bottom 20% (Bear)' : 'Middle 50% (Doji)'}
                </span>
              </div>
            </div>
          </div>

          {/* Brooks Axiom Card */}
          <div className="p-3.5 bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
              Core Al Brooks Axiom
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              "A bar that spends four minutes as a terrifying bear trend bar but rallies in the final 30 seconds to close in its upper third is a bull bar, not a bear bar. Entering before the bar closes exposes you to complete ruin."
            </p>
          </div>

        </div>

      </div>

      {/* CONTROLS & TIMELINE SCRUBBER */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
        
        {/* Timeline Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>0:00 (Open)</span>
            <span className="text-blue-400 font-bold font-mono">{formatTime(seconds)}</span>
            <span>5:00 (Close)</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="1"
            value={Math.floor(seconds)}
            onChange={(e) => {
              setSeconds(parseFloat(e.target.value));
              if (isPlaying) setIsPlaying(false);
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Action Controls & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (seconds >= 300) setSeconds(0);
                setIsPlaying(!isPlaying);
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold font-mono transition-colors flex items-center gap-1.5"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play Simulation'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setSeconds(0);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              ↺ Reset
            </button>

            {/* Speed Pills */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded transition-colors ${speed === s ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Quick Jump Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono">
            <span className="text-slate-500 text-[11px]">Jump to:</span>
            <button
              onClick={() => { setIsPlaying(false); setSeconds(60); }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-300 rounded border border-slate-800 text-[11px]"
            >
              1:00 Flush
            </button>
            <button
              onClick={() => { setIsPlaying(false); setSeconds(160); }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded border border-slate-800 text-[11px]"
            >
              2:40 Absorption
            </button>
            <button
              onClick={() => { setIsPlaying(false); setSeconds(290); }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded border border-slate-800 text-[11px]"
            >
              4:50 Squeeze
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
