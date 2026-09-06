// Version: v1.1 - Centralized Interactive Lab Registry (Tiers 0 & 1 Complete)
// Maps curriculum module IDs to their respective interactive micro-labs.

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

const LAB_REGISTRY = {
  // Tier 0: Orientation & Microstructure
  'tier0-mod-0.1': DOMOrderBookSimulator,
  'tier0-mod-0.2': DualEngineArchitectureDiagram,

  // Tier 1: Foundations & Bar Anatomy
  'tier1-mod-1.1': BarLifecycleScrubber,
  'tier1-mod-1.2': BodyRangeRatioLab,
  'tier1-mod-1.3': InsideBarCompressionLab,
  'tier1-mod-1.4': OutsideBarTrapLab,
  'tier1-mod-1.5': SignalVsEntryBarSequencer,
  'tier1-mod-1.6': ReversalBarAnatomyLab,
  'tier1-mod-1.7': MicroChannelDisciplineLab,
  'tier1-mod-1.8': MarketStateClassifier,
};

export function getInteractiveLab(moduleId) {
  return LAB_REGISTRY[moduleId] || null;
}
