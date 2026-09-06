// Canonical Curriculum Data Aggregator
// Imports modular tier files and exports a unified master curriculum object.

import tier0 from './tiers/tier0.json';
import tier1 from './tiers/tier1.json';
import tier2 from './tiers/tier2.json';
import tier3 from './tiers/tier3.json';
import tier4 from './tiers/tier4.json';
import tier5 from './tiers/tier5.json';

export const curriculumData = {
  version: 'v5.0-master-complete',
  modules: [
    ...tier0.modules,
    ...tier1.modules,
    ...tier2.modules,
    ...tier3.modules,
    ...tier4.modules,
    ...tier5.modules
  ]
};

export default curriculumData;
