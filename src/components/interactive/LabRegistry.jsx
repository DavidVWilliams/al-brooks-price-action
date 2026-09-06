// Version: v1.6 - Resilient Matching for All Tier 4 Labs
import DOMOrderBookSimulator from './DOMOrderBookSimulator.jsx';
import DualEngineArchitectureDiagram from './DualEngineArchitectureDiagram.jsx';

import BarLifecycleScrubber from './BarLifecycleScrubber.jsx';
import BodyRangeRatioLab from './BodyRangeRatioLab.jsx';
import InsideBarCompressionLab from './InsideBarCompressionLab.jsx';
import OutsideBarTrapLab from './OutsideBarTrapLab.jsx';
import SignalVsEntryBarSequencer from './SignalVsEntryBarSequencer.jsx';
import ReversalBarAnatomyLab from './ReversalBarAnatomyLab.jsx';
import MicroChannelDisciplineLab from './MicroChannelDisciplineLab.jsx';
import MarketStateClassifier from './MarketStateClassifier.jsx';

import AlwaysInDirectionDetector from './AlwaysInDirectionDetector.jsx';
import SpikeAndChannelLifecycle from './SpikeAndChannelLifecycle.jsx';
import EightyPercentRuleSimulator from './EightyPercentRuleSimulator.jsx';
import MeasuredMoveRuler from './MeasuredMoveRuler.jsx';

import High1High2BarCounter from './High1High2BarCounter.jsx';
import Low1Low2BearCounter from './Low1Low2BearCounter.jsx';
import MovingAverageGapBarLab from './MovingAverageGapBarLab.jsx';
import WedgePullbackIdentifier from './WedgePullbackIdentifier.jsx';
import BarbWireTradingRangeLab from './BarbWireTradingRangeLab.jsx';

import MTRStructureMapper from './MTRStructureMapper.jsx';
import ClimaxTCLOvershootLab from './ClimaxTCLOvershootLab.jsx';
import FinalFlagReversalTrap from './FinalFlagReversalTrap.jsx';
import DoubleTopBottomPullbackLab from './DoubleTopBottomPullbackLab.jsx';

export function getInteractiveLab(moduleId, moduleTitle = '') {
  if (!moduleId && !moduleTitle) return null;
  const id = String(moduleId || '').toLowerCase().trim();
  const title = String(moduleTitle || '').toLowerCase().trim();

  // Tier 0
  if (id.includes('0.1') || id.includes('order-book') || title.includes('order book') || title.includes('microstructure')) return DOMOrderBookSimulator;
  if (id.includes('0.2') || id.includes('dual-engine') || title.includes('feedback') || title.includes('mindset')) return DualEngineArchitectureDiagram;

  // Tier 1
  if (id.includes('1.1') || title.includes('300-second') || title.includes('lifecycle')) return BarLifecycleScrubber;
  if (id.includes('1.2') || title.includes('body-to-range') || title.includes('doji')) return BodyRangeRatioLab;
  if (id.includes('1.3') || title.includes('inside bar') || title.includes('compression')) return InsideBarCompressionLab;
  if (id.includes('1.4') || title.includes('outside bar')) return OutsideBarTrapLab;
  if (id.includes('1.5') || title.includes('signal bar vs') || title.includes('entry bar')) return SignalVsEntryBarSequencer;
  if (id.includes('1.6') || title.includes('reversal bar')) return ReversalBarAnatomyLab;
  if (id.includes('1.7') || title.includes('micro channel')) return MicroChannelDisciplineLab;
  if (id.includes('1.8') || title.includes('two market states') || title.includes('market state')) return MarketStateClassifier;

  // Tier 2
  if (id.includes('2.1') || title.includes('always in')) return AlwaysInDirectionDetector;
  if (id.includes('2.2') || title.includes('spike and channel')) return SpikeAndChannelLifecycle;
  if (id.includes('2.3') || title.includes('80% rule') || title.includes('breakout')) return EightyPercentRuleSimulator;
  if (id.includes('2.4') || title.includes('measured move') || title.includes('leg 1 = leg 2')) return MeasuredMoveRuler;

  // Tier 3
  if (id.includes('3.1') || title.includes('high 1') || title.includes('high 2')) return High1High2BarCounter;
  if (id.includes('3.2') || title.includes('low 1') || title.includes('low 2')) return Low1Low2BearCounter;
  if (id.includes('3.3') || title.includes('gap bar') || title.includes('20 ema')) return MovingAverageGapBarLab;
  if (id.includes('3.4') || title.includes('wedge pullback') || title.includes('wedge')) return WedgePullbackIdentifier;
  if (id.includes('3.5') || title.includes('barb wire')) return BarbWireTradingRangeLab;

  // Tier 4
  if (id.includes('4.1') || title.includes('major trend reversal') || title.includes('mtr')) return MTRStructureMapper;
  if (id.includes('4.2') || title.includes('climax') || title.includes('overshoot') || title.includes('tcl')) return ClimaxTCLOvershootLab;
  if (id.includes('4.3') || title.includes('final flag')) return FinalFlagReversalTrap;
  if (id.includes('4.4') || title.includes('double top') || title.includes('double bottom')) return DoubleTopBottomPullbackLab;

  return null;
}
