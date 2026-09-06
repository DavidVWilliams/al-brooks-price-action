import DOMOrderBookSimulator from './DOMOrderBookSimulator.jsx';
import DualEngineArchitectureDiagram from './DualEngineArchitectureDiagram.jsx';
import BarLifecycleScrubber from './BarLifecycleScrubber.jsx';
import BodyRangeRatioLab from './BodyRangeRatioLab.jsx';
import InsideBarCompressionLab from './InsideBarCompressionLab.jsx'; // 1. Import new lab

const LAB_REGISTRY = {
  'tier0-mod-0.1': DOMOrderBookSimulator,
  'tier0-mod-0.2': DualEngineArchitectureDiagram,
  'tier1-mod-1.1': BarLifecycleScrubber,
  'tier1-mod-1.2': BodyRangeRatioLab,
  'tier1-mod-1.3': InsideBarCompressionLab, // 2. Register module ID
};

export function getInteractiveLab(moduleId) {
  return LAB_REGISTRY[moduleId] || null;
}
