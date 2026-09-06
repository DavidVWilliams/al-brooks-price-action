// Version: v1.0 - Centralized Interactive Lab Registry
// Maps curriculum module IDs to their respective interactive micro-labs.

import DOMOrderBookSimulator from './DOMOrderBookSimulator.jsx';
import DualEngineArchitectureDiagram from './DualEngineArchitectureDiagram.jsx';
import BarLifecycleScrubber from './BarLifecycleScrubber.jsx';
import BodyRangeRatioLab from './BodyRangeRatioLab.jsx';

const LAB_REGISTRY = {
  'tier0-mod-0.1': DOMOrderBookSimulator,
  'tier0-mod-0.2': DualEngineArchitectureDiagram,
  'tier1-mod-1.1': BarLifecycleScrubber,
  'tier1-mod-1.2': BodyRangeRatioLab,
  // Future components will be registered here in 1 line:
  // 'tier1-mod-1.3': InsideBarCompressionLab,
};

export function getInteractiveLab(moduleId) {
  return LAB_REGISTRY[moduleId] || null;
}
