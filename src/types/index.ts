export type AppMode = 'somatic' | 'syncretic' | 'split';

export type DivinationType = 'tarot' | 'runes' | 'iching';

export interface ThreeZoneDetail {
  name: string;
  domain: string;
  percentageRatio: number;
  prominence: 'Prominent' | 'Harmonious' | 'Recessed';
  reading: string;
}

export interface ThreeZones {
  shangTing: ThreeZoneDetail;
  zhongTing: ThreeZoneDetail;
  xiaTing: ThreeZoneDetail;
}

export interface FiveOfficer {
  name: string;
  element: string;
  trait: string;
}

export interface ElementalBalance {
  dominantElement: 'Metal' | 'Water' | 'Wood' | 'Fire' | 'Earth';
  secondaryElement: 'Metal' | 'Water' | 'Wood' | 'Fire' | 'Earth';
  yinRatio: number;
  yangRatio: number;
  somaticTemperament: string;
}

export interface FaceAnalysisResult {
  subjectName: string;
  threeZones: ThreeZones;
  fiveOfficers: {
    eyes: FiveOfficer;
    eyebrows: FiveOfficer;
    nose: FiveOfficer;
    mouth: FiveOfficer;
    ears: FiveOfficer;
  };
  elementalBalance: ElementalBalance;
  somaticSummary: string;
}

export interface EnergeticFlowVector {
  from: string;
  to: string;
  nature: string;
  intensity: 'High' | 'Very High' | 'Moderate';
}

export interface ComparativeMatchResult {
  overallSynergyScore: number;
  resonanceClassification: string;
  zoneInterlock: {
    shangTingHarmony: string;
    zhongTingHarmony: string;
    xiaTingHarmony: string;
  };
  elementalPolarity: {
    p1Element: string;
    p2Element: string;
    cycle: string;
    dynamic: string;
  };
  energeticFlowVectors: EnergeticFlowVector[];
  somaticStrengths: string[];
  shadowDynamics: string[];
  mysticalSynthesis: string;
}

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  archetype: string;
  suit?: 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  uprightMeaning: string;
  reversedMeaning: string;
  imageSymbol: string;
  element: string;
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean;
  position: string;
}

export interface TarotReadingResult {
  theme: string;
  cardInterpretations: {
    cardName: string;
    position: string;
    meaning: string;
  }[];
  somaticGuidance: string;
  oracleSynthesis: string;
}

export interface RuneStone {
  id: string;
  name: string;
  symbol: string;
  letter: string;
  aett: string;
  meaning: string;
  esotericContext: string;
}

export interface CastRune extends RuneStone {
  orientation: 'Upright' | 'Merkstave (Inverted)';
  quadrant: 'Origin' | 'Threshold' | 'Manifestation' | 'Apex';
  x: number;
  y: number;
  rotation: number;
}

export interface RuneReadingResult {
  staveSynthesis: string;
  elementalForces: string;
  runeInsights: {
    rune: string;
    counsel: string;
  }[];
  runeAction: string;
}

export interface IChingLine {
  position: number;
  isYang: boolean;
  isChanging: boolean;
  coins: number[]; // e.g. [2, 3, 3] = 8 (Young Yin)
}

export interface IChingReadingResult {
  hexagramName: string;
  trigramBreakdown: string;
  theJudgement: string;
  theImage: string;
  changingLineGuidance: string;
  taoistWisdom: string;
}

export interface PlanetaryAspect {
  aspect: string;
  harmony: string;
  note: string;
}

export interface CelestialAlignmentResult {
  starHexagram: {
    number: number;
    name: string;
    symbol: string;
    celestialDegree: string;
  };
  synchronicityIndex: number;
  celestialTriad: {
    past: string;
    present: string;
    future: string;
  };
  planetaryAspects: PlanetaryAspect[];
  osirisSynthesis: string;
}

export interface PortraitSlot {
  id: '1' | '2';
  name: string;
  image: string | null;
  analysis: FaceAnalysisResult | null;
  loading: boolean;
}

export interface SavedReading {
  id: string;
  timestamp: string;
  type: 'face_match' | 'face_single' | 'tarot' | 'runes' | 'iching' | 'celestial';
  title: string;
  summary: string;
  score?: number;
  details: any;
}
