// Version: v1.5 - Complete Registry for Tiers 0, 1, 2, 3, and 4
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

export function getInteractiveLab(moduleId) {
  if (!moduleId) return null;
  const id = String(moduleId).trim().toLowerCase();

  // Tier 0
  if (id === 'tier0-mod-0.1' || id === '0.1' || id.includes('order-book') || id.includes('auction')) return DOMOrderBookSimulator;
  if (id === 'tier0-mod-0.2' || id === '0.2' || id.includes('dual-engine') || id.includes('mindset')) return DualEngineArchitectureDiagram;

  // Tier 1
  if (id === 'tier1-mod-1.1' || id === '1.1') return BarLifecycleScrubber;
  if (id === 'tier1-mod-1.2' || id === '1.2') return BodyRangeRatioLab;
  if (id === 'tier1-mod-1.3' || id === '1.3') return InsideBarCompressionLab;
  if (id === 'tier1-mod-1.4' || id === '1.4') return OutsideBarTrapLab;
  if (id === 'tier1-mod-1.5' || id === '1.5') return SignalVsEntryBarSequencer;
  if (id === 'tier1-mod-1.6' || id === '1.6') return ReversalBarAnatomyLab;
  if (id === 'tier1-mod-1.7' || id === '1.7') return MicroChannelDisciplineLab;
  if (id === 'tier1-mod-1.8' || id === '1.8') return MarketStateClassifier;

  // Tier 2
  if (id === 'tier2-mod-2.1' || id === '2.1') return AlwaysInDirectionDetector;
  if (id === 'tier2-mod-2.2' || id === '2.2') return SpikeAndChannelLifecycle;
  if (id === 'tier2-mod-2.3' || id === '2.3') return EightyPercentRuleSimulator;
  if (id === 'tier2-mod-2.4' || id === '2.4') return MeasuredMoveRuler;

  // Tier 3
  if (id === 'tier3-mod-3.1' || id === '3.1') return High1High2BarCounter;
  if (id === 'tier3-mod-3.2' || id === '3.2') return Low1Low2BearCounter;
  if (id === 'tier3-mod-3.3' || id === '3.3') return MovingAverageGapBarLab;
  if (id === 'tier3-mod-3.4' || id === '3.4') return WedgePullbackIdentifier;
  if (id === 'tier3-mod-3.5' || id === '3.5') return BarbWireTradingRangeLab;

  // Tier 4
  if (id === 'tier4-mod-4.1' || id === '4.1' || id.includes('mtr')) return MTRStructureMapper;
  if (id === 'tier4-mod-4.2' || id === '4.2' || id.includes('climax') || id.includes('overshoot')) return ClimaxTCLOvershootLab;
  if (id === 'tier4-mod-4.3' || id === '4.3' || id.includes('final-flag')) return FinalFlagReversalTrap;
  if (id === 'tier4-mod-4.4' || id === '4.4' || id.includes('double-top') || id.includes('double-bottom')) return DoubleTopBottomPullbackLab;

  return null;
}
