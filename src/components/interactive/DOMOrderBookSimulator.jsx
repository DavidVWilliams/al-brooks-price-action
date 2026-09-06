// Version: v1.1 - Added explicit Lab Instructions for the student

import { useState } from 'react';

const INITIAL_BOOK = [
  { price: 5021.00, askQty: 320, bidQty: 0 },
  { price: 5020.75, askQty: 215, bidQty: 0 },
  { price: 5020.50, askQty: 180, bidQty: 0 },
  { price: 5020.25, askQty: 95, bidQty: 0 },
  { price: 5020.00, askQty: 0, bidQty: 140 },
  { price: 5019.75, askQty: 0, bidQty: 260 },
  { price: 5019.50, askQty: 0, bidQty: 310 },
  { price: 5019.25, askQty: 0, bidQty: 450 },
];

export default function DOMOrderBookSimulator() {
  const [book, setBook] = useState(INITIAL_BOOK);
  const [lastPrice, setLastPrice] = useState(5020.00);
  const [openPrice] = useState(5020.00);
  const [highPrice, setHighPrice] = useState(5020.00);
  const [lowPrice, setLowPrice] = useState(5020.00);
  const [log, setLog] = useState('Auction initiated at 5020.00. Ready for execution.');
  const [oscillatorValue, setOscillatorValue] = useState(50.0);

  const applyPriceChange = (newPrice, actionText) => {
    setLastPrice(newPrice);
    setHighPrice((prev) => Math.max(prev, newPrice));
    setLowPrice((prev) => Math.min(prev, newPrice));
    setLog(actionText);

    // Stale oscillator responds with delayed 10% smoothing
    const targetOsc = 50 + (newPrice - openPrice) * 12;
    setOscillatorValue((prev) => +(prev + (targetOsc - prev) * 0.15).toFixed(1));
  };

  const handleMarketBuy = (size = 150) => {
    let remaining = size;
    let currentFillPrice = lastPrice;

    const nextBook = book.map((level) => {
      if (level.price > lastPrice && level.askQty > 0 && remaining > 0) {
        if (level.askQty <= remaining) {
          remaining -= level.askQty;
          currentFillPrice = level.price;
          return { ...level, askQty: 0 };
        } else {
          const updatedQty = level.askQty - remaining;
          remaining = 0;
          currentFillPrice = level.price;
          return { ...level, askQty: updatedQty };
        }
      }
      return level;
    });

    setBook(nextBook);
    applyPriceChange(
      currentFillPrice,
      `Executed Aggressive Market Buy (${size} contracts). Swept ask depth up to ${currentFillPrice.toFixed(2)}.`
    );
  };

  const handleMarketSell = (size = 150) => {
    let remaining = size;
    let currentFillPrice = lastPrice;

    const reversed = [...book].reverse().map((level) => {
      if (level.price <= lastPrice && level.bidQty > 0 && remaining > 0) {
        if (level.bidQty <= remaining) {
          remaining -= level.bidQty;
          currentFillPrice = level.price;
          return { ...level, bidQty: 0 };
        } else {
          const updatedQty = level.bidQty - remaining;
          remaining = 0;
          currentFillPrice = level.price;
          return { ...level, bidQty: updatedQty };
        }
      }
      return level;
    });

    setBook(reversed.reverse());
    applyPriceChange(
      currentFillPrice,
      `Executed Aggressive Market Sell (${size} contracts). Swept bid depth down to ${currentFillPrice.toFixed(2)}.`
    );
  };

  const handleAddIcebergBid = () => {
    const targetPrice = 5019.50;
    const nextBook = book.map((level) => {
      if (level.price === targetPrice) {
        return { ...level, bidQty: level.bidQty + 600 };
      }
      return level;
    });
    setBook(nextBook);
    setLog(`Institutional Iceberg Limit Order injected: +600 contracts resting at ${targetPrice.toFixed(2)}.`);
  };

  const handleReset = () => {
    setBook(INITIAL_BOOK);
    setLastPrice(5020.00);
    setHighPrice(5020.00);
    setLowPrice(5020.00);
    setOscillatorValue(50.0);
    setLog('Order book reset to balanced baseline.');
  };

  const minP = 5018.75;
  const maxP = 5021.50;
  const svgH = 180;
  const getY = (p) => svgH - ((p - minP) / (maxP - minP)) * svgH;

  const isBull = lastPrice >= openPrice;
  const openY = getY(openPrice);
  const lastY = getY(lastPrice);
  const highY = getY(highPrice);
  const lowY = getY(lowPrice);
  const bodyTop = Math.min(openY, lastY);
  const bodyH = Math.max(3, Math.abs(openY - lastY));

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
              Central Limit Order Book (DOM) & Indicator Latency
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Execute aggressive market sweeps and inspect real-time price discovery versus stale oscillator lag.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
          Last Fill: <span className="text-blue-400 font-bold">{lastPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* EXPLICIT LAB INSTRUCTIONS */}
      <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 space-y-2">
        <strong className="text-blue-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <span>🧪</span> Lab Exercise
        </strong>
        <ol className="list-decimal pl-5 text-sm text-slate-300 space-y-1">
          <li>Look at the yellow <strong className="text-slate-100">14-Period RSI</strong> bar on the right. Note its position.</li>
          <li>Click the green <strong className="text-emerald-400">+ Sweep Asks</strong> button multiple times rapidly.</li>
          <li>Observe how the candlestick instantly shoots up, but the RSI mathematically lags behind the real-time order flow.</li>
          <li><strong>Takeaway:</strong> Indicators are delayed derivatives of price. Institutions trade raw liquidity, not lagging math.</li>
        </ol>
      </div>

      {/* 3-PANE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* PANE 1: DOM DEPTH LADDER */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800 pb-2 mb-2 px-1">
              <span>Bid Qty</span>
              <span>Price</span>
              <span>Ask Qty</span>
            </div>

            <div className="space-y-1">
              {book.map((lvl) => {
                const isCurrent = lvl.price === lastPrice;
                return (
                  <div
                    key={lvl.price}
                    className={`flex items-center justify-between px-2 py-1 rounded text-xs font-mono transition-colors ${
                      isCurrent ? 'bg-blue-900/30 border border-blue-500/40 font-bold' : 'hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-16 flex items-center gap-1.5">
                      {lvl.bidQty > 0 && (
                        <>
                          <div className="h-2 bg-emerald-500/50 rounded-sm" style={{ width: `${Math.min(100, (lvl.bidQty / 600) * 45)}px` }} />
                          <span className="text-emerald-400 text-[10px]">{lvl.bidQty}</span>
                        </>
                      )}
                    </div>
                    <span className={isCurrent ? 'text-white font-bold' : 'text-slate-300'}>{lvl.price.toFixed(2)}</span>
                    <div className="w-16 flex items-center justify-end gap-1.5">
                      {lvl.askQty > 0 && (
                        <>
                          <span className="text-rose-400 text-[10px]">{lvl.askQty}</span>
                          <div className="h-2 bg-rose-500/50 rounded-sm" style={{ width: `${Math.min(100, (lvl.askQty / 600) * 45)}px` }} />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-center border-t border-slate-800/80 pt-2 mt-2">
            Exchange Matching Engine: FIFO Priority
          </div>
        </div>

        {/* PANE 2: LIVE CANDLESTICK AUCTION CANVAS */}
        <div className="lg:col-span-4 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between relative">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Real-Time 5-Min ES Bar</span>
          <svg className="w-full h-44 select-none" viewBox="0 0 160 180">
            {[5021.0, 5020.5, 5020.0, 5019.5].map((p) => (
              <g key={p}>
                <line x1="10" y1={getY(p)} x2="150" y2={getY(p)} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <text x="155" y={getY(p) + 3} fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="end">{p.toFixed(2)}</text>
              </g>
            ))}
            <line x1="20" y1={openY} x2="140" y2={openY} stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80" y1={highY} x2="80" y2={lowY} stroke={isBull ? '#10b981' : '#f43f5e'} strokeWidth="2" />
            <rect x="60" y={bodyTop} width="40" height={bodyH} fill={isBull ? '#065f46' : '#881337'} stroke={isBull ? '#10b981' : '#f43f5e'} strokeWidth="2" rx="1.5" />
          </svg>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <span>O: <strong className="text-slate-200">{openPrice.toFixed(2)}</strong></span>
            <span>H: <strong className="text-slate-200">{highPrice.toFixed(2)}</strong></span>
            <span>L: <strong className="text-slate-200">{lowPrice.toFixed(2)}</strong></span>
            <span>C: <strong className={isBull ? 'text-emerald-400' : 'text-rose-400'}>{lastPrice.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* PANE 3: LAGGING INDICATOR */}
        <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Mathematical Derivative</span>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">14-Period RSI:</span>
                <span className="text-amber-400 font-bold">{oscillatorValue}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, oscillatorValue))}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block pt-0.5">Latency: Average 7 to 14 bars behind.</span>
            </div>
          </div>
        </div>

      </div>

      {/* CONTROLS & LOG FEED */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleMarketBuy(220)} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-semibold transition-colors">
              + Sweep Asks (Market Buy 220)
            </button>
            <button onClick={() => handleMarketSell(220)} className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-mono font-semibold transition-colors">
              - Sweep Bids (Market Sell 220)
            </button>
            <button onClick={handleAddIcebergBid} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-blue-900/50 text-xs font-mono transition-colors">
              + Place Passive Iceberg Bid (600)
            </button>
          </div>
          <button onClick={handleReset} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded text-xs font-mono border border-slate-800 transition-colors">
            ↺ Reset
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-2 rounded border border-slate-800/80 truncate">
          <span className="text-blue-400 font-semibold">Feed: </span>{log}
        </div>
      </div>

    </div>
  );
}
