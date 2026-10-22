import { TarotCard, RuneStone } from '../types';

// Preset archetype portrait images (SVG Data URIs for instant testing)
export const PRESET_PORTRAITS = [
  {
    id: 'archetype_sol',
    name: 'Aurelius (Solar Archetype)',
    description: 'Prominent Shang Ting (Forehead), clear limbal gaze, high bone symmetry',
    gender: 'Masculine Yang',
    element: 'Fire / Metal',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="solGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%231e293b" />
          <stop offset="70%" stop-color="%230f172a" />
          <stop offset="100%" stop-color="%23020617" />
        </radialGradient>
        <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23fbbf24" stop-opacity="0.9" />
          <stop offset="100%" stop-color="%23d97706" stop-opacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23solGrad)" />
      <!-- Starry grid -->
      <circle cx="200" cy="200" r="160" fill="none" stroke="%23334155" stroke-width="1" stroke-dasharray="4 4" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="%23d4af37" stroke-width="0.75" stroke-opacity="0.4" />
      
      <!-- Stylized Face Contours -->
      <!-- Cranium & Forehead -->
      <path d="M 120 180 C 120 90, 280 90, 280 180 C 280 260, 250 310, 200 330 C 150 310, 120 260, 120 180 Z" fill="%231a2234" stroke="url(%23goldGlow)" stroke-width="2.5" />
      
      <!-- Upper Zone Wireframe (Shang Ting) -->
      <path d="M 132 150 Q 200 135 268 150" fill="none" stroke="%2338bdf8" stroke-width="1.5" stroke-opacity="0.8" />
      <line x1="200" y1="95" x2="200" y2="150" stroke="%2338bdf8" stroke-width="1" stroke-dasharray="2 2" />
      
      <!-- Brows & Eyes (Middle Zone / Zhong Ting) -->
      <path d="M 148 165 Q 175 160 190 166" stroke="%23fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M 210 166 Q 225 160 252 165" stroke="%23fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <ellipse cx="169" cy="182" rx="14" ry="7" fill="%230f172a" stroke="%23f8fafc" stroke-width="1.5" />
      <circle cx="169" cy="182" r="3.5" fill="%2338bdf8" />
      <ellipse cx="231" cy="182" rx="14" ry="7" fill="%230f172a" stroke="%23f8fafc" stroke-width="1.5" />
      <circle cx="231" cy="182" r="3.5" fill="%2338bdf8" />
      
      <!-- Nose & Midline -->
      <path d="M 200 165 L 196 220 L 206 223 L 200 228" fill="none" stroke="%23e2e8f0" stroke-width="2" stroke-linejoin="round" />
      <path d="M 188 228 Q 200 234 212 228" fill="none" stroke="%23e2e8f0" stroke-width="1.5" />
      
      <!-- Middle to Lower Zone Boundary (Xia Ting) -->
      <line x1="140" y1="230" x2="260" y2="230" stroke="%23a855f7" stroke-width="1.5" stroke-opacity="0.8" />
      
      <!-- Philtrum & Mouth -->
      <line x1="200" y1="232" x2="200" y2="246" stroke="%2394a3b8" stroke-width="1.5" />
      <path d="M 180 255 Q 192 250 200 254 Q 208 250 220 255 Q 200 268 180 255 Z" fill="%23e2e8f0" fill-opacity="0.8" />
      
      <!-- Mandible & Chin -->
      <path d="M 185 292 Q 200 298 215 292" fill="none" stroke="%23fbbf24" stroke-width="2" />
      
      <!-- Auricular (Ears) -->
      <path d="M 120 170 Q 106 195 120 225" fill="none" stroke="%23d4af37" stroke-width="2" />
      <path d="M 280 170 Q 294 195 280 225" fill="none" stroke="%23d4af37" stroke-width="2" />
      
      <!-- Esoteric Nodes -->
      <circle cx="200" cy="122" r="3" fill="%2338bdf8" />
      <circle cx="200" cy="195" r="3" fill="%23fbbf24" />
      <circle cx="200" cy="275" r="3" fill="%23a855f7" />
      <text x="200" y="375" text-anchor="middle" fill="%2394a3b8" font-size="12" font-family="sans-serif" letter-spacing="3">AURELIUS · SOLAR METAL</text>
    </svg>`,
  },
  {
    id: 'archetype_luna',
    name: 'Selene (Lunar Archetype)',
    description: 'Balanced Xia Ting (Mandible), serene Water eyes, receptive curved hairline',
    gender: 'Feminine Yin',
    element: 'Water / Wood',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="lunaGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%231e1b4b" />
          <stop offset="70%" stop-color="%230f172a" />
          <stop offset="100%" stop-color="%23030712" />
        </radialGradient>
        <linearGradient id="silverGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23e0e7ff" stop-opacity="0.95" />
          <stop offset="100%" stop-color="%2338bdf8" stop-opacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23lunaGrad)" />
      <!-- Concentric Harmonic Circles -->
      <circle cx="200" cy="200" r="160" fill="none" stroke="%23312e81" stroke-width="1" stroke-dasharray="3 3" />
      <circle cx="200" cy="200" r="130" fill="none" stroke="%23818cf8" stroke-width="0.75" stroke-opacity="0.5" />
      
      <!-- Oval Receptive Face Contour -->
      <path d="M 125 175 C 125 95, 275 95, 275 175 C 275 255, 245 315, 200 330 C 155 315, 125 255, 125 175 Z" fill="%23171b30" stroke="url(%23silverGlow)" stroke-width="2.5" />
      
      <!-- Shang Ting Division -->
      <path d="M 135 152 Q 200 140 265 152" fill="none" stroke="%23818cf8" stroke-width="1.5" stroke-opacity="0.8" />
      
      <!-- Gentle Arching Brows & Luminous Almond Eyes -->
      <path d="M 148 166 Q 172 155 192 165" stroke="%23c7d2fe" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M 208 165 Q 228 155 252 166" stroke="%23c7d2fe" stroke-width="2" fill="none" stroke-linecap="round" />
      <ellipse cx="170" cy="180" rx="15" ry="8" fill="%230f172a" stroke="%23e0e7ff" stroke-width="1.5" />
      <circle cx="170" cy="180" r="4" fill="%232dd4bf" />
      <ellipse cx="230" cy="180" rx="15" ry="8" fill="%230f172a" stroke="%23e0e7ff" stroke-width="1.5" />
      <circle cx="230" cy="180" r="4" fill="%232dd4bf" />
      
      <!-- Delicate Refined Nose -->
      <path d="M 200 168 L 198 220 Q 200 224 204 220" fill="none" stroke="%23e0e7ff" stroke-width="1.75" />
      <path d="M 191 224 Q 200 229 209 224" fill="none" stroke="%23e0e7ff" stroke-width="1.5" />
      
      <!-- Zhong to Xia Ting Division -->
      <line x1="145" y1="228" x2="255" y2="228" stroke="%23ec4899" stroke-width="1.5" stroke-opacity="0.7" />
      
      <!-- Full Receptive Lips -->
      <line x1="200" y1="230" x2="200" y2="246" stroke="%23818cf8" stroke-width="1.2" />
      <path d="M 182 254 Q 192 249 200 252 Q 208 249 218 254 Q 200 269 182 254 Z" fill="%23fda4af" fill-opacity="0.85" />
      
      <!-- Rounded Receptive Chin -->
      <path d="M 188 290 Q 200 295 212 290" fill="none" stroke="%23c7d2fe" stroke-width="2" />
      
      <!-- Ears -->
      <path d="M 125 172 Q 112 195 125 222" fill="none" stroke="%23818cf8" stroke-width="1.8" />
      <path d="M 275 172 Q 288 195 275 222" fill="none" stroke="%23818cf8" stroke-width="1.8" />
      
      <!-- Nodes -->
      <circle cx="200" cy="120" r="3" fill="%23818cf8" />
      <circle cx="200" cy="195" r="3" fill="%232dd4bf" />
      <circle cx="200" cy="272" r="3" fill="%23ec4899" />
      <text x="200" y="375" text-anchor="middle" fill="%2394a3b8" font-size="12" font-family="sans-serif" letter-spacing="3">SELENE · LUNAR WATER</text>
    </svg>`,
  },
  {
    id: 'archetype_mercury',
    name: 'Hermes (Alchemical Archetype)',
    description: 'Dynamic forehead, piercing analytical gaze, sharp communicative chin',
    gender: 'Hermaphroditic / Fluid',
    element: 'Wood / Air',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="hermGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%23064e3b" />
          <stop offset="70%" stop-color="%23022c22" />
          <stop offset="100%" stop-color="%23020617" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23hermGrad)" />
      <polygon points="200,60 320,310 80,310" fill="none" stroke="%23059669" stroke-width="1" stroke-opacity="0.4" />
      <path d="M 128 170 C 128 95, 272 95, 272 170 C 272 250, 240 315, 200 335 C 160 315, 128 250, 128 170 Z" fill="%23062820" stroke="%2334d399" stroke-width="2.5" />
      <line x1="135" y1="148" x2="265" y2="148" stroke="%236ee7b7" stroke-width="1.5" />
      <line x1="142" y1="228" x2="258" y2="228" stroke="%2338bdf8" stroke-width="1.5" />
      <ellipse cx="170" cy="180" rx="14" ry="7" fill="%23022c22" stroke="%236ee7b7" stroke-width="1.5" />
      <circle cx="170" cy="180" r="3.5" fill="%23fbbf24" />
      <ellipse cx="230" cy="180" rx="14" ry="7" fill="%23022c22" stroke="%236ee7b7" stroke-width="1.5" />
      <circle cx="230" cy="180" r="3.5" fill="%23fbbf24" />
      <path d="M 200 165 L 198 220 L 204 220" fill="none" stroke="%23a7f3d0" stroke-width="2" />
      <path d="M 184 252 Q 200 260 216 252" fill="none" stroke="%236ee7b7" stroke-width="2" />
      <text x="200" y="375" text-anchor="middle" fill="%236ee7b7" font-size="12" font-family="sans-serif" letter-spacing="3">HERMES · ALCHEMICAL WOOD</text>
    </svg>`,
  },
  {
    id: 'archetype_gaia',
    name: 'Demeter (Terrestrial Archetype)',
    description: 'Grounding Xia Ting, warm Earth cheekbones, stable foundational fortitude',
    gender: 'Feminine Earth',
    element: 'Earth / Metal',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="gaiaGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%23451a03" />
          <stop offset="70%" stop-color="%231c1917" />
          <stop offset="100%" stop-color="%230c0a09" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23gaiaGrad)" />
      <rect x="70" y="70" width="260" height="260" fill="none" stroke="%23b45309" stroke-width="1" stroke-opacity="0.3" transform="rotate(45 200 200)" />
      <path d="M 120 175 C 120 100, 280 100, 280 175 C 280 260, 255 315, 200 330 C 145 315, 120 260, 120 175 Z" fill="%23292524" stroke="%23f59e0b" stroke-width="2.5" />
      <line x1="130" y1="150" x2="270" y2="150" stroke="%23fbbf24" stroke-width="1.5" />
      <line x1="138" y1="230" x2="262" y2="230" stroke="%23fbbf24" stroke-width="1.5" />
      <ellipse cx="168" cy="182" rx="14" ry="8" fill="%231c1917" stroke="%23fde68a" stroke-width="1.5" />
      <circle cx="168" cy="182" r="4" fill="%23f59e0b" />
      <ellipse cx="232" cy="182" rx="14" ry="8" fill="%231c1917" stroke="%23fde68a" stroke-width="1.5" />
      <circle cx="232" cy="182" r="4" fill="%23f59e0b" />
      <path d="M 200 165 L 195 222 L 205 222" fill="none" stroke="%23fde68a" stroke-width="2" />
      <path d="M 180 255 Q 200 264 220 255" fill="none" stroke="%23f59e0b" stroke-width="2.5" />
      <text x="200" y="375" text-anchor="middle" fill="%23f59e0b" font-size="12" font-family="sans-serif" letter-spacing="3">DEMETER · SACRED EARTH</text>
    </svg>`,
  },
];

// Tarot Deck (22 Major Arcana + Sacred Archetypes)
export const TAROT_DECK: TarotCard[] = [
  {
    id: '0_fool',
    number: 0,
    name: '0. The Fool',
    archetype: 'The Divine Leap',
    suit: 'Major',
    element: 'Air',
    imageSymbol: '🌀',
    uprightMeaning: 'Purity of beginning, untamed potential, spontaneous courage, zero karma state.',
    reversedMeaning: 'Recklessness, fear of taking the necessary leap, blind folly, hesitation.',
  },
  {
    id: '1_magician',
    number: 1,
    name: 'I. The Magician',
    archetype: 'The Conscious Channel',
    suit: 'Major',
    element: 'Mercury',
    imageSymbol: '☿️',
    uprightMeaning: 'As above, so below; mastery of elements, active manifestation, concentrated willpower.',
    reversedMeaning: 'Illusions, scattered intent, withheld power, manipulation of sacred currents.',
  },
  {
    id: '2_high_priestess',
    number: 2,
    name: 'II. The High Priestess',
    archetype: 'The Veil of Intuition',
    suit: 'Major',
    element: 'Water / Moon',
    imageSymbol: '🌙',
    uprightMeaning: 'Subconscious knowing, sacred silence, esoteric receptivity, trust in the unseen.',
    reversedMeaning: 'Repressed somatic wisdom, superficial secrets, ignoring instinctual alarm.',
  },
  {
    id: '3_empress',
    number: 3,
    name: 'III. The Empress',
    archetype: 'The Primal Mother',
    suit: 'Major',
    element: 'Venus / Earth',
    imageSymbol: '🌿',
    uprightMeaning: 'Radical abundance, creative gestation, somatic sensuality, effortless nourishment.',
    reversedMeaning: 'Creative blockages, smothering attachments, disharmony with natural rhythms.',
  },
  {
    id: '4_emperor',
    number: 4,
    name: 'IV. The Emperor',
    archetype: 'The Sacred Foundation',
    suit: 'Major',
    element: 'Aries / Fire',
    imageSymbol: '🏛️',
    uprightMeaning: 'Sovereign structure, protective boundaries, paternal authority, benevolent order.',
    reversedMeaning: 'Rigid dogmatism, tyrannical fragility, collapse of internal discipline.',
  },
  {
    id: '5_hierophant',
    number: 5,
    name: 'V. The Hierophant',
    archetype: 'The Ancient Key',
    suit: 'Major',
    element: 'Taurus / Earth',
    imageSymbol: '🗝️',
    uprightMeaning: 'Spiritual lineage, initiation, sacred study, bridge between mortal and divine doctrine.',
    reversedMeaning: 'Stifling orthodoxy, blind obedience, outmoded dogmas ripe for dismantling.',
  },
  {
    id: '6_lovers',
    number: 6,
    name: 'VI. The Lovers',
    archetype: 'The Alchemical Union',
    suit: 'Major',
    element: 'Gemini / Air',
    imageSymbol: '♾️',
    uprightMeaning: 'Somatic resonance, soul contract, harmonization of polarities, conscious choice.',
    reversedMeaning: 'Inner rift, values misaligned, co-dependent projections, divided devotion.',
  },
  {
    id: '7_chariot',
    number: 7,
    name: 'VII. The Chariot',
    archetype: 'The Guided Sphinxes',
    suit: 'Major',
    element: 'Cancer / Water',
    imageSymbol: '⚡',
    uprightMeaning: 'Triumphant vector of will, harnessing opposing passions, forward breakthrough.',
    reversedMeaning: 'Loss of trajectory, violent impatience, feeling pulled in divergent extremes.',
  },
  {
    id: '8_strength',
    number: 8,
    name: 'VIII. Strength',
    archetype: 'The Gentle Lion',
    suit: 'Major',
    element: 'Leo / Fire',
    imageSymbol: '🦁',
    uprightMeaning: 'Compassionate fortitude, somatic courage, taming raw instincts through love.',
    reversedMeaning: 'Self-doubt, brute force replacing grace, surrender to base fears.',
  },
  {
    id: '9_hermit',
    number: 9,
    name: 'IX. The Hermit',
    archetype: 'The Solitary Lantern',
    suit: 'Major',
    element: 'Virgo / Earth',
    imageSymbol: '🕯️',
    uprightMeaning: 'Introspective pilgrimage, inner illumination, withdrawal from social noise.',
    reversedMeaning: 'Paralyzing isolation, stubborn reclusion, fear of reconnecting with the world.',
  },
  {
    id: '10_wheel_of_fortune',
    number: 10,
    name: 'X. Wheel of Fortune',
    archetype: 'The Cosmic Axis',
    suit: 'Major',
    element: 'Jupiter',
    imageSymbol: '☸️',
    uprightMeaning: 'Cyclical inevitability, karmic turning points, destiny aligning with effort.',
    reversedMeaning: 'Resistance to change, feeling victimized by temporal cycles, clinging to the old.',
  },
  {
    id: '11_justice',
    number: 11,
    name: 'XI. Justice',
    archetype: 'The Sword & Scales',
    suit: 'Major',
    element: 'Libra / Air',
    imageSymbol: '⚖️',
    uprightMeaning: 'Objective truth, karmic equilibrium, cause and effect in equilibrium, integrity.',
    reversedMeaning: 'Hypocrisy, bias, avoidance of accountability, internal disharmony.',
  },
  {
    id: '12_hanged_man',
    number: 12,
    name: 'XII. The Hanged Man',
    archetype: 'The Sacred Inversion',
    suit: 'Major',
    element: 'Water',
    imageSymbol: '⏳',
    uprightMeaning: 'Willing surrender, inversion of perspective, spiritual pause before rebirth.',
    reversedMeaning: 'Stalling out of fear, needless martyrdom, clinging to ego control.',
  },
  {
    id: '13_death',
    number: 13,
    name: 'XIII. Death & Transmutation',
    archetype: 'The Great Gate',
    suit: 'Major',
    element: 'Scorpio / Water',
    imageSymbol: '🦂',
    uprightMeaning: 'Absolute completion, shedding of dead skin, organic transformation, fertile compost.',
    reversedMeaning: 'Clinging to corpses of past identity, protracted grief, refusal to die to the old.',
  },
  {
    id: '14_temperance',
    number: 14,
    name: 'XIV. Temperance',
    archetype: 'The Dual Goblets',
    suit: 'Major',
    element: 'Sagittarius / Fire-Water',
    imageSymbol: '🍶',
    uprightMeaning: 'Alchemical blending, somatic balance, middle path, gentle patience.',
    reversedMeaning: 'Extremes, internal turbulence, clashing elements, lack of spiritual temperance.',
  },
  {
    id: '15_devil',
    number: 15,
    name: 'XV. The Shadow (Devil)',
    archetype: 'The Chained Desires',
    suit: 'Major',
    element: 'Capricorn / Earth',
    imageSymbol: '⛓️',
    uprightMeaning: 'Confrontation with the shadow, material entanglement, unmasking illusory bondages.',
    reversedMeaning: 'Reclaiming sovereignty, breaking ancestral chains, awakening from the trance.',
  },
  {
    id: '16_tower',
    number: 16,
    name: 'XVI. The Tower',
    archetype: 'The Lightning Flash',
    suit: 'Major',
    element: 'Mars / Fire',
    imageSymbol: '⚡',
    uprightMeaning: 'Shattering of false illusions, sudden divine intervention, release of built-up pressure.',
    reversedMeaning: 'Prolonging inevitable collapse, fear of catastrophic awakening.',
  },
  {
    id: '17_star',
    number: 17,
    name: 'XVII. The Star',
    archetype: 'The Luminous Vessel',
    suit: 'Major',
    element: 'Aquarius / Air-Water',
    imageSymbol: '✨',
    uprightMeaning: 'Serene hope, cosmic inspiration, pure renewal, the guiding light of destiny.',
    reversedMeaning: 'Disillusionment, despair, disconnected from the divine spring, cynicism.',
  },
  {
    id: '18_moon',
    number: 18,
    name: 'XVIII. The Moon',
    archetype: 'The Shadow Waters',
    suit: 'Major',
    element: 'Pisces / Water',
    imageSymbol: '🌑',
    uprightMeaning: 'Navigating illusion, subconscious dreams, primal somatic instincts, twilight passage.',
    reversedMeaning: 'Lifting of confusion, seeing through deception, anxiety calming.',
  },
  {
    id: '19_sun',
    number: 19,
    name: 'XIX. The Sun',
    archetype: 'The Solar Child',
    suit: 'Major',
    element: 'Sun / Fire',
    imageSymbol: '☀️',
    uprightMeaning: 'Radiant vitality, uncomplicated joy, absolute clarity, somatic warmth and health.',
    reversedMeaning: 'Temporary overcast, overconfidence, veiled enthusiasm.',
  },
  {
    id: '20_judgement',
    number: 20,
    name: 'XX. Judgement (Resurrection)',
    archetype: 'The Angelic Horn',
    suit: 'Major',
    element: 'Fire',
    imageSymbol: '🎺',
    uprightMeaning: 'Deep spiritual calling, rebirth, evaluation of one’s path with clear forgiveness.',
    reversedMeaning: 'Harsh self-condemnation, ignoring the awakening bell, lingering guilt.',
  },
  {
    id: '21_world',
    number: 21,
    name: 'XXI. The World (Cosmos)',
    archetype: 'The Ouroboros Whole',
    suit: 'Major',
    element: 'Saturn / Earth-Cosmos',
    imageSymbol: '🪐',
    uprightMeaning: 'Cosmic individuation, integrated wholeness, celebratory triumph, complete cycle.',
    reversedMeaning: 'Unfinished business, delayed closure, the final lesson awaiting integration.',
  },
];

// Elder Futhark Runes
export const RUNES_DATA: RuneStone[] = [
  { id: 'fehu', name: 'Fehu', symbol: 'ᚠ', letter: 'F', aett: 'Freyr', meaning: 'Mobile Wealth, Vital Fire, Creative Stamina', esotericContext: 'The primordial spark of cattle and gold that fuels creation.' },
  { id: 'uruz', name: 'Uruz', symbol: 'ᚢ', letter: 'U', aett: 'Freyr', meaning: 'Primal Ox, Untamed Health, Somatic Tenacity', esotericContext: 'Raw physical vitality, the aura of health and endurance.' },
  { id: 'thurisaz', name: 'Thurisaz', symbol: 'ᚦ', letter: 'Th', aett: 'Freyr', meaning: 'The Thorn / Giant, Defensive Barrier, Catalyst', esotericContext: 'Reactive power, clearing obstacles with lightning focus.' },
  { id: 'ansuz', name: 'Ansuz', symbol: 'ᚨ', letter: 'A', aett: 'Freyr', meaning: 'Odinic Breath, Divine Word, Inspired Song', esotericContext: 'The sovereign breath of wisdom, speech that manifests reality.' },
  { id: 'raidho', name: 'Raidho', symbol: 'ᚱ', letter: 'R', aett: 'Freyr', meaning: 'The Sacred Journey, Cosmic Rhythm, Right Order', esotericContext: 'The wagon wheel moving in alignment with cosmic laws.' },
  { id: 'kenaz', name: 'Kenaz', symbol: 'ᚲ', letter: 'K', aett: 'Freyr', meaning: 'The Torch, Alchemical Illumination, Craft', esotericContext: 'The controlled flame that transforms ignorance into skill.' },
  { id: 'gebo', name: 'Gebo', symbol: 'ᚷ', letter: 'G', aett: 'Freyr', meaning: 'The Divine Gift, Sacred Exchange, Mutual Honor', esotericContext: 'A gift demands a gift: equilibrium in relationship.' },
  { id: 'wunjo', name: 'Wunjo', symbol: 'ᚹ', letter: 'W', aett: 'Freyr', meaning: 'Harmonious Fellowship, Unclouded Joy, Grace', esotericContext: 'The banishing of sorrow when true community converges.' },
  { id: 'hagalaz', name: 'Hagalaz', symbol: 'ᚺ', letter: 'H', aett: 'Heimdall', meaning: 'The Hailstone, Primal Cosmic Egg, Disruptive Transformation', esotericContext: 'Destruction of outworn forms to reveal the crystal core.' },
  { id: 'nauthiz', name: 'Nauthiz', symbol: 'ᚾ', letter: 'N', aett: 'Heimdall', meaning: 'Sacred Need-Fire, Friction of Destiny, Resilience', esotericContext: 'From the crucible of constraint comes indomitable will.' },
  { id: 'isa', name: 'Isa', symbol: 'ᛁ', letter: 'I', aett: 'Heimdall', meaning: 'Still Ice, Concentrated Stillness, The Pivot', esotericContext: 'Preserving energy in the deep freeze before the spring melt.' },
  { id: 'jera', name: 'Jera', symbol: 'ᛃ', letter: 'J', aett: 'Heimdall', meaning: 'The Harvest, Faithful Seasons, Fruitful Reward', esotericContext: 'Patience rewarded when work is conducted in sync with nature.' },
  { id: 'eihwaz', name: 'Eihwaz', symbol: 'ᛇ', letter: 'Ei', aett: 'Heimdall', meaning: 'Yggdrasil Yew, Axis Mundi, Death & Immortality', esotericContext: 'The tree that bridges the upper and nether worlds.' },
  { id: 'perthro', name: 'Perthro', symbol: 'ᛈ', letter: 'P', aett: 'Heimdall', meaning: 'The Dice Cup of Fate, Unrevealed Mystery, The Matrix', esotericContext: 'The womb of Wyrd where all possibilities wait to be cast.' },
  { id: 'algiz', name: 'Algiz', symbol: 'ᛉ', letter: 'Z', aett: 'Heimdall', meaning: 'The Elk Antlers, Divine Protection, Upper Reach', esotericContext: 'The shield of higher consciousness sheltering the seeker.' },
  { id: 'sowilo', name: 'Sowilo', symbol: 'ᛊ', letter: 'S', aett: 'Heimdall', meaning: 'The Solar Sun, Victorious Light, Crown Radiance', esotericContext: 'Undivided light piercing every shadow with crystalline truth.' },
  { id: 'tiwaz', name: 'Tiwaz', symbol: 'ᛏ', letter: 'T', aett: 'Tyr', meaning: 'Tyr’s Spear, Sovereign Justice, Unwavering Sacrifice', esotericContext: 'Honor, lawful balance, guiding North Star of virtue.' },
  { id: 'berkana', name: 'Berkana', symbol: 'ᛒ', letter: 'B', aett: 'Tyr', meaning: 'The Birch Goddess, Rebirth, Sanctuary, Nurturing', esotericContext: 'Gentle springtime emergence and quiet healing of the soul.' },
  { id: 'ehwaz', name: 'Ehwaz', symbol: 'ᛖ', letter: 'E', aett: 'Tyr', meaning: 'The Twin Horses, Symbiotic Loyalty, Swift Passage', esotericContext: 'Harmonious partnership between horse and rider, soul and mind.' },
  { id: 'mannaz', name: 'Mannaz', symbol: 'ᛗ', letter: 'M', aett: 'Tyr', meaning: 'The Awakened Human, Collective Mind, True Self', esotericContext: 'The mortal vessel reflecting the cosmic divine architecture.' },
  { id: 'laguz', name: 'Laguz', symbol: 'ᛚ', letter: 'L', aett: 'Tyr', meaning: 'The Flowing Water, Somatic Tide, Psychic Depth', esotericContext: 'Yielding to the subterranean rivers of instinct and vision.' },
  { id: 'ingwaz', name: 'Ingwaz', symbol: 'ᛜ', letter: 'Ing', aett: 'Tyr', meaning: 'The Seed, Earth Gestation, Potential Sealed', esotericContext: 'Internal consolidation before explosive spring growth.' },
  { id: 'dagaz', name: 'Dagaz', symbol: 'ᛞ', letter: 'D', aett: 'Tyr', meaning: 'The Breakthrough Dawn, Polar Synthesis, Daybreak', esotericContext: 'The flash of total realization where night becomes noon.' },
  { id: 'othala', name: 'Othala', symbol: 'ᛟ', letter: 'O', aett: 'Tyr', meaning: 'Ancestral Homeland, Spiritual Inheritance, Sacred Ground', esotericContext: 'Claiming the timeless sanctuary of your true lineage.' },
];

// I Ching Trigrams and Primary Hexagrams
export const I_CHING_TRIGRAMS = [
  { name: 'Qian (Heaven)', nature: 'Creative, Strong', element: 'Metal', lines: [true, true, true], symbol: '☰' },
  { name: 'Kun (Earth)', nature: 'Receptive, Yielding', element: 'Earth', lines: [false, false, false], symbol: '☷' },
  { name: 'Zhen (Thunder)', nature: 'Arousing, Incisive', element: 'Wood', lines: [true, false, false], symbol: '☳' },
  { name: 'Kan (Water)', nature: 'Abysmal, Dangerous', element: 'Water', lines: [false, true, false], symbol: '☵' },
  { name: 'Gen (Mountain)', nature: 'Still, Boundary', element: 'Earth', lines: [false, false, true], symbol: '☶' },
  { name: 'Xun (Wind/Wood)', nature: 'Gentle, Penetrating', element: 'Wood', lines: [false, true, true], symbol: '☴' },
  { name: 'Li (Fire)', nature: 'Clinging, Luminous', element: 'Fire', lines: [true, false, true], symbol: '☲' },
  { name: 'Dui (Lake)', nature: 'Joyous, Open', element: 'Metal', lines: [true, true, false], symbol: '☱' },
];
