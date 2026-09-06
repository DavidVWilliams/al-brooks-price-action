// Version: v1.0 - Al Brooks Interactive Price Action Simulator
import { useState, useMemo } from 'react';
import simulatorData from '../data/simulatorData.json';
import { evaluateTradersEquation } from '../utils/tradersEquation';

export default function SimulatorView() {
  const instruments = simulatorData.instruments;
  const scenarios = simulatorData.scenarios;

  // 1. Selection & Playback State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = scenarios[selectedScenarioIndex] || scenarios[0];
  const [selectedSymbol, setSelectedSymbol] = useState(scenario.instrumentSymbol || 'ES');
  const instrument = instruments[selectedSymbol] || instruments.ES;

  // Bar step state: starts at the signal bar
  const [currentBarIndex, setCurrentBarIndex] = useState(scenario.signalBarIndex);

  // 2. Order Parameters State
  const [direction, setDirection] = useState(scenario.canonicalMetrics.direction || 'LONG');
  const [orderType, setOrderType] = useState(scenario.canonicalMetrics.orderType || 'STOP');
  const [entryPrice, setEntryPrice] = useState(scenario.canonicalMetrics.suggestedEntry);
  const [stopPrice, setStopPrice] = useState(scenario.canonicalMetrics.suggestedStop);
  const [targetPrice, setTargetPrice] = useState(scenario.canonicalMetrics.suggestedTarget);
  const [probability, setProbability] = useState(scenario.canonicalMetrics.estimatedProbability || 0.60);

  // 3. Execution & Trade Lifecycle State
  // Status: 'IDLE' | 'PENDING' | 'ACTIVE' | 'TARGET_HIT' | 'STOPPED_OUT'
  const [tradeStatus, setTradeStatus] = useState('IDLE');
  const [fillPrice, setFillPrice] = useState(null);
  const [tradeExitPrice, setTradeExitPrice] = useState(null);

  const tickSize = instrument.tickSize || 0.25;
  const decimals = instrument.priceDecimals !== undefined ? instrument.priceDecimals : 2;

  // Visible bars slice
  const visibleBars = useMemo(() => {
    return scenario.bars.slice(0, currentBarIndex + 1);
  }, [scenario, currentBarIndex]);

  // Dynamic Trader's Equation Evaluation
  const equationResult = useMemo(() => {
    return evaluateTradersEquation({
      entry: Number(entryPrice),
      stop: Number(stopPrice),
      target: Number(targetPrice),
      direction,
      probability: Number(probability),
      instrument
    });
  }, [entryPrice, stopPrice, targetPrice, direction, probability, instrument]);

  // Adjust prices by tick steps
  const adjustPrice = (setter, currentVal, deltaTicks) => {
    setter((prev) => {
      const updated = Number(prev) + (deltaTicks * tickSize);
      return Number(updated.toFixed(decimals));
    });
  };

  // Place Order Action
  const handlePlaceOrder = () => {
    if (!equationResult.isValid) return;
    setTradeStatus('PENDING');
  };

  // Reset Scenario
  const handleReset = () => {
    setCurrentBarIndex(scenario.signalBarIndex);
    setTradeStatus('IDLE');
    setFillPrice(null);
    setTradeExitPrice(null);
    setEntryPrice(scenario.canonicalMetrics.suggestedEntry);
    setStopPrice(scenario.canonicalMetrics.suggestedStop);
    setTargetPrice(scenario.canonicalMetrics.suggestedTarget);
  };

  // Step to Next Bar (Execution Engine)
  const handleStepNextBar = () => {
    if (currentBarIndex + 1 >= scenario.bars.length) return;

    const nextIndex = currentBarIndex + 1;
    const nextBar = scenario.bars[nextIndex];
    let newStatus = tradeStatus;
    let newFill = fillPrice;
    let newExit = tradeExitPrice;

    if (tradeStatus === 'PENDING') {
      // Check for Order Trigger
      if (direction === 'LONG') {
        if (orderType === 'STOP' && nextBar.high >= entryPrice) {
          newStatus = 'ACTIVE';
          newFill = entryPrice;
        } else if (orderType === 'LIMIT' && nextBar.low <= entryPrice) {
          newStatus = 'ACTIVE';
          newFill = entryPrice;
        }
      } else {
        if (orderType === 'STOP' && nextBar.low <= entryPrice) {
          newStatus = 'ACTIVE';
          newFill = entryPrice;
        } else if (orderType === 'LIMIT' && nextBar.high >= entryPrice) {
          newStatus = 'ACTIVE';
          newFill = entryPrice;
        }
      }
    }

    if (newStatus === 'ACTIVE') {
      // Check for Target or Stop hit
      if (direction === 'LONG') {
        if (nextBar.low <= stopPrice) {
          newStatus = 'STOPPED_OUT';
          newExit = stopPrice;
        } else if (nextBar.high >= targetPrice) {
          newStatus = 'TARGET_HIT';
          newExit = targetPrice;
        }
      } else {
        if (nextBar.high >= stopPrice) {
          newStatus = 'STOPPED_OUT';
          newExit = stopPrice;
        } else if (nextBar.low <= targetPrice) {
          newStatus = 'TARGET_HIT';
          newExit = targetPrice;
        }
      }
    }

    setCurrentBarIndex(nextIndex);
    setTradeStatus(newStatus);
    setFillPrice(newFill);
    setTradeExitPrice(newExit);
  };

  // --- SVG Chart Geometry Calculations ---
  const chartHeight = 280;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;

  const minPrice = useMemo(() => {
    const barLows = visibleBars.map((b) => b.low);
    const candidateMin = Math.min(...barLows, stopPrice || Infinity, targetPrice || Infinity);
    return candidateMin - (tickSize * 4);
  }, [visibleBars, stopPrice, targetPrice, tickSize]);

  const maxPrice = useMemo(() => {
    const barHighs = visibleBars.map((b) => b.high);
    const candidateMax = Math.max(...barHighs, stopPrice || -Infinity, targetPrice || -Infinity);
    return candidateMax + (tickSize * 4);
  }, [visibleBars, stopPrice, targetPrice, tickSize]);

  const priceRange = maxPrice - minPrice || 1;

  const getY = (p) => {
    const normalized = (p - minPrice) / priceRange;
    return chartHeight - paddingY - (normalized * (chartHeight - (paddingY * 2)));
  };

  const barSpacing = Math.max((chartWidth - (paddingX * 2)) / Math.max(scenario.bars.length, 16), 34);

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-y-auto text-slate-100 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-800">
      
      {/* 1. Control Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* Symbol Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-mono text-slate-500 uppercase">Symbol:</span>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-bold text-blue-400 focus:outline-none cursor-pointer"
            >
              {Object.keys(instruments).map((sym) => (
                <option key={sym} value={sym} className="bg-slate-900 text-slate-200">
                  {sym} — {instruments[sym].name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Badge */}
          <div className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400">
            ⏱ {scenario.timeframe}
          </div>

          {/* Setup / Scenario Name */}
          <div className="hidden lg:block text-xs font-mono text-slate-300">
            <strong className="text-blue-400">Setup:</strong> {scenario.title}
          </div>
        </div>

        {/* Playback & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            ↺ Reset
          </button>
          <button
            onClick={handleStepNextBar}
            disabled={currentBarIndex + 1 >= scenario.bars.length}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5"
          >
            <span>Step Next Bar</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left/Top Canvas: SVG Chart (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
            
            {/* Chart Info Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-400">
                  Bar {visibleBars.length} of {scenario.bars.length}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-blue-400">{scenario.marketContext.alwaysInStatus}</span>
              </div>
              <div className="text-slate-500">
                Tick Value: ${instrument.tickValue.toFixed(2)} / {instrument.tickSize} pt
              </div>
            </div>

            {/* SVG Candlestick Rendering Canvas */}
            <div className="w-full overflow-x-auto py-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-72 md:h-80 select-none overflow-visible"
              >
                {/* Horizontal Grid lines */}
                <line x1={paddingX} y1={getY(minPrice)} x2={chartWidth - paddingX} y2={getY(minPrice)} stroke="#1e293b" strokeDasharray="3 3" />
                <line x1={paddingX} y1={getY((minPrice + maxPrice) / 2)} x2={chartWidth - paddingX} y2={getY((minPrice + maxPrice) / 2)} stroke="#1e293b" strokeDasharray="3 3" />
                <line x1={paddingX} y1={getY(maxPrice)} x2={chartWidth - paddingX} y2={getY(maxPrice)} stroke="#1e293b" strokeDasharray="3 3" />

                {/* Entry, Stop, Target Horizontal Marker Lines */}
                {entryPrice && (
                  <g>
                    <line
                      x1={paddingX}
                      y1={getY(entryPrice)}
                      x2={chartWidth - paddingX}
                      y2={getY(entryPrice)}
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x={chartWidth - paddingX + 6} y={getY(entryPrice) + 4} fill="#60a5fa" fontSize="9" fontFamily="monospace">
                      Entry: {entryPrice.toFixed(decimals)}
                    </text>
                  </g>
                )}

                {stopPrice && (
                  <g>
                    <line
                      x1={paddingX}
                      y1={getY(stopPrice)}
                      x2={chartWidth - paddingX}
                      y2={getY(stopPrice)}
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x={chartWidth - paddingX + 6} y={getY(stopPrice) + 4} fill="#fb7185" fontSize="9" fontFamily="monospace">
                      Stop: {stopPrice.toFixed(decimals)}
                    </text>
                  </g>
                )}

                {targetPrice && (
                  <g>
                    <line
                      x1={paddingX}
                      y1={getY(targetPrice)}
                      x2={chartWidth - paddingX}
                      y2={getY(targetPrice)}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x={chartWidth - paddingX + 6} y={getY(targetPrice) + 4} fill="#34d399" fontSize="9" fontFamily="monospace">
                      Target: {targetPrice.toFixed(decimals)}
                    </text>
                  </g>
                )}

                {/* Candlesticks Rendering */}
                {visibleBars.map((b, idx) => {
                  const x = paddingX + (idx * barSpacing) + (barSpacing / 2);
                  const isBull = b.close >= b.open;
                  const yHigh = getY(b.high);
                  const yLow = getY(b.low);
                  const yOpen = getY(b.open);
                  const yClose = getY(b.close);
                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);
                  const isSignalBar = idx === scenario.signalBarIndex;

                  return (
                    <g key={b.barNumber}>
                      {/* Upper & Lower Wick */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={isBull ? '#3b82f6' : '#f43f5e'}
                        strokeWidth="1.5"
                      />

                      {/* Real Body */}
                      <rect
                        x={x - 8}
                        y={bodyTop}
                        width="16"
                        height={bodyHeight}
                        fill={isBull ? '#1e3a8a' : '#4c0519'}
                        stroke={isBull ? '#3b82f6' : '#f43f5e'}
                        strokeWidth="1.5"
                        rx="1"
                      />

                      {/* Bar Number Label */}
                      <text
                        x={x}
                        y={chartHeight - 6}
                        fill="#64748b"
                        fontSize="8"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {b.barNumber}
                      </text>

                      {/* Signal Bar Highlight Pin */}
                      {isSignalBar && (
                        <g>
                          <circle cx={x} cy={yHigh - 10} r="3" fill="#f59e0b" />
                          <text x={x} y={yHigh - 16} fill="#f59e0b" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                            Signal
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Context & State Badge */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div>
                <span className="text-slate-500 font-mono">Market State:</span>{' '}
                <strong className="text-slate-200">{scenario.marketContext.marketState}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-mono">Pattern:</span>{' '}
                <strong className="text-amber-400">{scenario.marketContext.setupType}</strong>
              </div>
            </div>
          </div>

          {/* Scenario Background Notes */}
          <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            <span className="text-blue-400 font-mono font-bold uppercase mr-1">Context Analysis:</span>
            {scenario.marketContext.setupDescription}
          </div>
        </div>

        {/* Right Panel: Trader's Equation HUD & Order Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Trader's Equation HUD Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                Trader&apos;s Equation HUD
              </h3>
              {equationResult.isValid && equationResult.metrics && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    equationResult.metrics.expectancy.status === 'EXCELLENT' ||
                    equationResult.metrics.expectancy.status === 'STRONG' ||
                    equationResult.metrics.expectancy.status === 'POSITIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {equationResult.metrics.expectancy.qualityBadge}
                </span>
              )}
            </div>

            {equationResult.isValid && equationResult.metrics ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">RISK (Rk)</span>
                    <span className="text-rose-400 font-bold text-sm">
                      {equationResult.metrics.risk.points} pts
                    </span>
                    <span className="text-slate-500 block text-[10px]">
                      ${equationResult.metrics.risk.dollars}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">REWARD (Rw)</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {equationResult.metrics.reward.points} pts
                    </span>
                    <span className="text-slate-500 block text-[10px]">
                      ${equationResult.metrics.reward.dollars}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reward-to-Risk:</span>
                    <strong className="text-slate-200">{equationResult.metrics.riskRewardRatio}:1</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Break-Even Win Rate:</span>
                    <strong className="text-slate-200">
                      {(equationResult.metrics.requiredWinRate * 100).toFixed(1)}%
                    </strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400 font-bold">Expectancy (E):</span>
                    <strong
                      className={`font-bold ${
                        equationResult.metrics.expectancy.dollars >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {equationResult.metrics.expectancy.dollars >= 0 ? '+' : ''}$
                      {equationResult.metrics.expectancy.dollars} / trade
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal italic">
                  &ldquo;{equationResult.metrics.expectancy.commentary}&rdquo;
                </p>
              </div>
            ) : (
              <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg text-rose-300 text-xs">
                {equationResult.error || 'Configure valid order levels.'}
              </div>
            )}
          </div>

          {/* Order Placement Panel */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono border-b border-slate-800 pb-2">
              Order Parameters
            </h3>

            {/* Direction Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setDirection('LONG')}
                disabled={tradeStatus !== 'IDLE'}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                  direction === 'LONG'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                BUY / LONG
              </button>
              <button
                onClick={() => setDirection('SHORT')}
                disabled={tradeStatus !== 'IDLE'}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                  direction === 'SHORT'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Stepper Inputs for Entry, Stop, Target */}
            <div className="space-y-2.5">
              {/* Entry */}
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono">
                <span className="text-blue-400 font-bold">Entry:</span>
                <span className="text-slate-200">{Number(entryPrice).toFixed(decimals)}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => adjustPrice(setEntryPrice, entryPrice, -1)}
                    disabled={tradeStatus !== 'IDLE'}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustPrice(setEntryPrice, entryPrice, 1)}
                    disabled={tradeStatus !== 'IDLE'}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stop Loss */}
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono">
                <span className="text-rose-400 font-bold">Stop:</span>
                <span className="text-slate-200">{Number(stopPrice).toFixed(decimals)}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => adjustPrice(setStopPrice, stopPrice, -1)}
                    disabled={tradeStatus !== 'IDLE'}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustPrice(setStopPrice, stopPrice, 1)}
                    disabled={tradeStatus !== 'IDLE'}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Profit Target */}
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold">Target:</span>
                <span className="text-slate-200">{Number(targetPrice).toFixed(decimals)}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => adjustPrice(setTargetPrice, targetPrice, -1)}
                    disabled={tradeStatus !== 'IDLE'}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustPrice(setTargetPrice, targetPrice, 1)}
                    disabled={tradeStatus !== 'IDLE'}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Execution Status / Place Order Button */}
            {tradeStatus === 'IDLE' ? (
              <button
                onClick={handlePlaceOrder}
                disabled={!equationResult.isValid}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold font-mono transition-colors"
              >
                Arm Order on Stop ➔
              </button>
            ) : (
              <div
                className={`p-3 rounded-xl border text-center font-mono text-xs font-bold ${
                  tradeStatus === 'PENDING'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : tradeStatus === 'ACTIVE'
                    ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 animate-pulse'
                    : tradeStatus === 'TARGET_HIT'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500 text-rose-300'
                }`}
              >
                {tradeStatus === 'PENDING' && 'ORDER ARMED: Waiting for Entry Trigger'}
                {tradeStatus === 'ACTIVE' && `POSITION ACTIVE: Filled @ ${fillPrice}`}
                {tradeStatus === 'TARGET_HIT' && `🏆 TARGET HIT! Closed @ ${tradeExitPrice}`}
                {tradeStatus === 'STOPPED_OUT' && `🛑 STOPPED OUT. Closed @ ${tradeExitPrice}`}
              </div>
            )}
          </div>

          {/* Post-Trade Debrief Card (Shows when trade completes) */}
          {(tradeStatus === 'TARGET_HIT' || tradeStatus === 'STOPPED_OUT') && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 animate-fadeIn">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                🧠 Brooks Institutional Debrief
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scenario.postTradeDebrief.institutionalAnalysis}
              </p>
              <p className="text-xs text-blue-400 font-mono italic">
                Rule: {scenario.postTradeDebrief.brooksTakeaway}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
