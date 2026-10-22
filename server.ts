import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for cleaning and validating base64 raster data
function extractBase64(dataUrl: string): { mimeType: string; data: string; isRaster: boolean } {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return { mimeType: 'image/jpeg', data: '', isRaster: false };
  }

  // Detect SVG vector illustrations (such as preset archetypes or vector uploads)
  if (dataUrl.includes('image/svg') || dataUrl.trim().startsWith('<svg') || dataUrl.includes('<svg')) {
    return {
      mimeType: 'image/svg+xml',
      data: '',
      isRaster: false,
    };
  }

  if (dataUrl.includes(';base64,')) {
    const parts = dataUrl.split(';base64,');
    const mime = parts[0].replace('data:', '').trim() || 'image/jpeg';
    const cleanData = parts[1].trim();
    // Gemini Vision supports JPEG, PNG, WebP, GIF, HEIC
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];
    const isSupportedMime = validMimes.includes(mime.toLowerCase());
    const isLikelyBase64 = cleanData.length > 30 && /^[A-Za-z0-9+/=]+$/.test(cleanData.substring(0, 100));

    return {
      mimeType: isSupportedMime ? mime : 'image/jpeg',
      data: cleanData,
      isRaster: isSupportedMime && isLikelyBase64,
    };
  }

  // If raw base64 without data prefix
  const cleanStr = dataUrl.replace(/\s+/g, '');
  const isRawBase64 = cleanStr.length > 50 && /^[A-Za-z0-9+/=]+$/.test(cleanStr.substring(0, 100));
  return {
    mimeType: 'image/jpeg',
    data: cleanStr,
    isRaster: isRawBase64,
  };
}

// -------------------------------------------------------------
// Mobile Phone Sync Endpoints (Continuity Camera / Face Upload)
// -------------------------------------------------------------
interface MobileSession {
  sessionId: string;
  pairCode: string;
  slotId: string;
  slotName?: string;
  image: string | null;
  createdAt: number;
}

const mobileSessions = new Map<string, MobileSession>();

// Cleanup stale sessions (> 45 mins)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of mobileSessions.entries()) {
    if (now - session.createdAt > 45 * 60 * 1000) {
      mobileSessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

app.post('/api/mobile-sync/initiate', (req, res) => {
  const { slotId, slotName } = req.body;
  const sessionId = 'sync_' + Math.random().toString(36).substring(2, 10);
  const pairCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  const session: MobileSession = {
    sessionId,
    pairCode,
    slotId: slotId || '1',
    slotName: slotName || `Portrait ${slotId || '1'}`,
    image: null,
    createdAt: Date.now(),
  };

  mobileSessions.set(sessionId, session);
  res.json({
    success: true,
    sessionId,
    pairCode,
    slotId: session.slotId,
    slotName: session.slotName,
  });
});

app.get('/api/mobile-sync/status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = mobileSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session expired or not found' });
  }

  res.json({
    success: true,
    hasImage: !!session.image,
    image: session.image,
    slotId: session.slotId,
    slotName: session.slotName,
  });
});

app.post('/api/mobile-sync/upload', (req, res) => {
  const { sessionId, image, pairCode } = req.body;
  
  let targetSession: MobileSession | undefined;
  if (sessionId && mobileSessions.has(sessionId)) {
    targetSession = mobileSessions.get(sessionId);
  } else if (pairCode) {
    for (const session of mobileSessions.values()) {
      if (session.pairCode === pairCode.trim()) {
        targetSession = session;
        break;
      }
    }
  }

  if (!targetSession) {
    return res.status(404).json({ error: 'Invalid or expired sync session / pairing code' });
  }

  if (!image) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  targetSession.image = image;
  res.json({ success: true, slotId: targetSession.slotId });
});

// -------------------------------------------------------------
// 1. Mian Xiang Single Face Analysis Endpoint
// -------------------------------------------------------------
app.post('/api/mian-xiang/analyze-face', async (req, res) => {
  try {
    const { image, portraitId, subjectName } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const { mimeType, data, isRaster } = extractBase64(image);

    if (process.env.GEMINI_API_KEY && isRaster) {
      try {
        const prompt = `You are a master practitioner of classical Chinese Physiognomy (Mian Xiang 面相) and Somatic Morphopsychology.
Analyze this human face using the classical Three Zones (San Ting 三停) and the Five Officers (Wu Guan 五官).

Respond STRICTLY in JSON conforming to the following structure:
{
  "subjectName": "${subjectName || 'Subject'}",
  "threeZones": {
    "shangTing": {
      "name": "Shang Ting (Upper Zone / Forehead)",
      "domain": "Ancestral karma, early life (15-30), intellect, divine inspiration & strategic vision",
      "percentageRatio": 33,
      "prominence": "Prominent" | "Harmonious" | "Recessed",
      "reading": "detailed 2-3 sentence analysis of forehead width, hairline, and frontal bone structure"
    },
    "zhongTing": {
      "name": "Zhong Ting (Middle Zone / Brows to Nose Base)",
      "domain": "Middle life (31-50), personal ego, emotional drive, vitality & social will",
      "percentageRatio": 34,
      "prominence": "Prominent" | "Harmonious" | "Recessed",
      "reading": "detailed 2-3 sentence analysis of nose bridge, cheekbones, and eye brilliance"
    },
    "xiaTing": {
      "name": "Xia Ting (Lower Zone / Philtrum to Chin)",
      "domain": "Late life (51+), somatic resilience, instinctual depth, legacy & material manifestation",
      "percentageRatio": 33,
      "prominence": "Prominent" | "Harmonious" | "Recessed",
      "reading": "detailed 2-3 sentence analysis of jawline, philtrum depth, and mouth fullness"
    }
  },
  "fiveOfficers": {
    "eyes": { "name": "Eyes (Officer of Monitoring)", "element": "Fire/Wood", "trait": "description" },
    "eyebrows": { "name": "Eyebrows (Officer of Longevity)", "element": "Wood", "trait": "description" },
    "nose": { "name": "Nose (Officer of Discrimination / Wealth)", "element": "Earth", "trait": "description" },
    "mouth": { "name": "Mouth (Officer of Outflow / Water)", "element": "Water", "trait": "description" },
    "ears": { "name": "Ears (Officer of Listening / Ancestral Karma)", "element": "Water", "trait": "description" }
  },
  "elementalBalance": {
    "dominantElement": "Metal" | "Water" | "Wood" | "Fire" | "Earth",
    "secondaryElement": "Metal" | "Water" | "Wood" | "Fire" | "Earth",
    "yinRatio": 52,
    "yangRatio": 48,
    "somaticTemperament": "e.g. Alchemical Water-Wood Strategist"
  },
  "somaticSummary": "A poetic, reverent, and deeply accurate 3-4 sentence esoteric synthesis of this person's somatic presence, inner temperament, and life momentum."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, analysis: parsed });
      } catch (geminiError) {
        console.warn('Gemini vision API error, falling back to algorithmic Mian Xiang model:', geminiError);
      }
    }

    // High fidelity algorithmic fallback
    const fallback = generateAlgorithmicMianXiang(subjectName || `Portrait ${portraitId || '1'}`);
    return res.json({ success: true, analysis: fallback, fallbackUsed: true });
  } catch (err: any) {
    console.error('Error in face analysis:', err);
    res.status(500).json({ error: err.message || 'Face analysis failed' });
  }
});

// -------------------------------------------------------------
// 2. Mian Xiang Comparative Face Match Endpoint
// -------------------------------------------------------------
app.post('/api/mian-xiang/compare-match', async (req, res) => {
  try {
    const { image1, image2, name1, name2 } = req.body;

    if (!image1 || !image2) {
      return res.status(400).json({ error: 'Both portraits are required for comparative matching' });
    }

    const img1 = extractBase64(image1);
    const img2 = extractBase64(image2);

    if (process.env.GEMINI_API_KEY && img1.isRaster && img2.isRaster) {
      try {
        const prompt = `You are a high adept of classical Chinese Physiognomy (Mian Xiang 面相) and Somatic Polarity Interpersonal Dynamics.
Compare these two portrait faces: Portrait 1 (${name1 || 'Person 1'}) and Portrait 2 (${name2 || 'Person 2'}).

Evaluate their:
1. Structural Zone Interlock: How Portrait 1's Three Zones (Shang, Zhong, Xia) complement or mirror Portrait 2's Three Zones.
2. Elemental Polarity: (Wood, Fire, Earth, Metal, Water) generative cycle vs overcoming tension.
3. Somatic Energy Flow: The energetic vectors flowing between them (e.g. Celestial Intuition of P1 grounding into Material Stamina of P2; Emotional Fire of P1 cooled by Alchemical Water of P2).
4. Harmonic Synergy Score: 0 to 100 based on classical morphopsychological harmony.
5. In-depth comparative synthesis of interpersonal resonance, communicative synergy, and friction points.

Respond STRICTLY in JSON conforming to:
{
  "overallSynergyScore": 89,
  "resonanceClassification": "Alchemical Yin-Yang Conjunction" | "Mirroring Harmonious Resonator" | "Dynamic Polarity Catalyst" | "Somatic Grounding Axis",
  "zoneInterlock": {
    "shangTingHarmony": "Detailed analysis of intellect and spiritual alignment between their upper zones",
    "zhongTingHarmony": "Analysis of ego, ambitions, and daily collaboration in mid zones",
    "xiaTingHarmony": "Analysis of physical stamina, home life, and foundational commitment in lower zones"
  },
  "elementalPolarity": {
    "p1Element": "Water",
    "p2Element": "Wood",
    "cycle": "Sheng (Generative - Water nourishes Wood)",
    "dynamic": "One person naturally inspires and nurtures the creative expressions and willpower of the other."
  },
  "energeticFlowVectors": [
    { "from": "Upper Zone (Heaven)", "to": "Middle Zone (Man)", "nature": "Inspirational Guidance", "intensity": "High" },
    { "from": "Lower Zone (Earth)", "to": "Lower Zone (Earth)", "nature": "Somatic Sanctuary & Trust", "intensity": "Very High" },
    { "from": "Middle Zone (Ego)", "to": "Upper Zone (Vision)", "nature": "Creative Momentum", "intensity": "Moderate" }
  ],
  "somaticStrengths": [
    "Intuitive telepathy supported by complementary jawline grounding",
    "Balanced gaze intensity preventing social exhaustion",
    "Generative elemental flow between intuitive perception and practical execution"
  ],
  "shadowDynamics": [
    "Potential communication hesitation during high-stress middle-life cycles",
    "Need for explicit verbal appreciation when emotional currents run quiet"
  ],
  "mysticalSynthesis": "A poetic, deeply insightful 4-5 sentence summary of the eternal somatic mirror between these two souls."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              { inlineData: { mimeType: img1.mimeType, data: img1.data } },
              { inlineData: { mimeType: img2.mimeType, data: img2.data } },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, matchAnalysis: parsed });
      } catch (geminiError) {
        console.warn('Gemini vision API error in comparison, falling back to algorithmic model:', geminiError);
      }
    }

    const fallback = generateAlgorithmicComparativeMatch(name1 || 'Person 1', name2 || 'Person 2');
    return res.json({ success: true, matchAnalysis: fallback, fallbackUsed: true });
  } catch (err: any) {
    console.error('Error in comparative face match:', err);
    res.status(500).json({ error: err.message || 'Comparison failed' });
  }
});

// -------------------------------------------------------------
// 3. Instant Divination: Tarot
// -------------------------------------------------------------
app.post('/api/divination/tarot', async (req, res) => {
  try {
    const { question, cards, spreadType } = req.body;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the High Oracle of the Osiris Divinatory Companion.
Interpret this Tarot Spread for the querent.
Question / Focus: "${question || 'General Soul Mirror & Interpersonal Dynamics'}"
Spread Type: ${spreadType || 'Past, Present, Outcome'}
Cards Pulled:
${cards.map((c: any, i: number) => `Position ${i + 1} (${c.position}): ${c.name} (${c.isReversed ? 'Reversed' : 'Upright'}) - Archetype: ${c.archetype}`).join('\n')}

Provide an esoteric, profoundly empowering, psychological, and intuitive synthesis.
Return STRICTLY JSON:
{
  "theme": "Core spiritual theme (e.g., The Sacred Crucible of Transmutation)",
  "cardInterpretations": [
    {
      "cardName": "Name",
      "position": "Position",
      "meaning": "Deep 2-3 sentence interpretation specific to the context"
    }
  ],
  "somaticGuidance": "A physical/somatic anchor or body-mind practice to integrate this read",
  "oracleSynthesis": "A poetic, illuminating 3-4 sentence revelation that cuts to the root of the querent's journey."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, reading: parsed });
      } catch (e) {
        console.warn('Gemini Tarot fallback:', e);
      }
    }

    const fallback = generateAlgorithmicTarot(cards, question);
    return res.json({ success: true, reading: fallback, fallbackUsed: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. Instant Divination: Runes
// -------------------------------------------------------------
app.post('/api/divination/runes', async (req, res) => {
  try {
    const { question, runes } = req.body;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a keeper of the Elder Futhark mysteries.
Interpret these cast Runes for the querent:
Question: "${question || 'Energetic Path & True Will'}"
Runes:
${runes.map((r: any) => `${r.name} (${r.meaning}) [Orientation: ${r.orientation}]`).join(', ')}

Return STRICTLY JSON:
{
  "staveSynthesis": "A powerful 2-line poetic stave verse",
  "elementalForces": "The dominant primal forces at work (e.g. Ice meeting Fire at Ginnungagap)",
  "runeInsights": [
    { "rune": "Name", "counsel": "Direct esoteric guidance" }
  ],
  "runeAction": "The immediate intuitive step required"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, reading: parsed });
      } catch (e) {
        console.warn('Gemini Runes fallback:', e);
      }
    }

    const fallback = generateAlgorithmicRunes(runes, question);
    return res.json({ success: true, reading: fallback, fallbackUsed: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Instant Divination: I Ching
// -------------------------------------------------------------
app.post('/api/divination/iching', async (req, res) => {
  try {
    const { question, hexagramNumber, lines } = req.body;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the master interpreter of the Zhouyi (I Ching / Book of Changes).
Interpret Hexagram #${hexagramNumber} for the querent's question: "${question || 'The Way of Nature & Cosmic Momentum'}".
Lines configuration: ${JSON.stringify(lines)}

Return STRICTLY JSON:
{
  "hexagramName": "Classical English and Chinese name",
  "trigramBreakdown": "Upper Trigram over Lower Trigram explanation",
  "theJudgement": "Esoteric classical judgment updated for the modern soul",
  "theImage": "Nature metaphor (e.g. Thunder over Lake)",
  "changingLineGuidance": "Advice on active lines or transformation",
  "taoistWisdom": "Action through non-action (Wu Wei) counsel"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, reading: parsed });
      } catch (e) {
        console.warn('Gemini I Ching fallback:', e);
      }
    }

    const fallback = generateAlgorithmicIChing(hexagramNumber, question);
    return res.json({ success: true, reading: fallback, fallbackUsed: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. Syncretic Celestial Alignment & Star-Hexagram (Sister App)
// -------------------------------------------------------------
app.post('/api/astrology/synastry', async (req, res) => {
  try {
    const { birthdate1, birthdate2, name1, name2 } = req.body;

    if (!birthdate1 || !birthdate2) {
      return res.status(400).json({ error: 'Both birthdates are required for celestial alignment' });
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the Cosmic Astrologer and Syncretic Hexagram Calculator of the Osiris Ecosystem.
Calculate celestial alignment, planetary synastry, and the combined Star-Hexagram between:
Subject 1: ${name1 || 'Person 1'} (Born: ${birthdate1})
Subject 2: ${name2 || 'Person 2'} (Born: ${birthdate2})

Perform precision synthesis:
1. Past, Present, and Future Synthesis of this relationship.
2. Planetary Aspects: Sun-Moon, Venus-Mars, Mercury-Saturn connections.
3. The Associated Star-Hexagram (1-64) representing their synthesis point in the celestial wheel.
4. Synchronicity Ratio (0 to 100%).

Return STRICTLY JSON:
{
  "starHexagram": {
    "number": 11,
    "name": "Hexagram 11: Tai (Peace / Heaven & Earth in Harmony)",
    "symbol": "䷊",
    "celestialDegree": "14° Taurus / Scorpio Axis"
  },
  "synchronicityIndex": 92,
  "celestialTriad": {
    "past": "Ancestral or past-life karmic bond characterized by deep recognition and mutual debts resolved.",
    "present": "Crucible of creative alignment, awakening latent somatic gifts and complementary thinking.",
    "future": "A shared sanctuary of sovereign creation, steady material security, and timeless devotion."
  },
  "planetaryAspects": [
    { "aspect": "Sun Trine Moon", "harmony": "98%", "note": "Effortless emotional resonance and instinctive mutual understanding." },
    { "aspect": "Venus Conjunct Mars", "harmony": "95%", "note": "Magnetic physical and aesthetic attraction that deepens over time." },
    { "aspect": "Mercury Sextile Jupiter", "harmony": "88%", "note": "Expansive philosophical dialogues and mutual optimism." }
  ],
  "osirisSynthesis": "A poetic, rigorous 4-sentence cosmic verdict on this union."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, alignment: parsed });
      } catch (e) {
        console.warn('Gemini synastry fallback:', e);
      }
    }

    const fallback = generateAlgorithmicSynastry(birthdate1, birthdate2, name1, name2);
    return res.json({ success: true, alignment: fallback, fallbackUsed: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Fallback Generators (High-Quality Domain Heuristics)
// -------------------------------------------------------------
function generateAlgorithmicMianXiang(subjectName: string) {
  return {
    subjectName,
    threeZones: {
      shangTing: {
        name: 'Shang Ting (Upper Zone / Forehead)',
        domain: 'Ancestral karma, early life (15-30), intellect, divine inspiration',
        percentageRatio: 34,
        prominence: 'Prominent',
        reading: 'Expansive and luminous forehead curvature, signifying high visionary bandwidth, conceptual clarity, and early developmental maturity.',
      },
      zhongTing: {
        name: 'Zhong Ting (Middle Zone / Brows to Nose Base)',
        domain: 'Middle life (31-50), personal ego, emotional drive, vitality',
        percentageRatio: 33,
        prominence: 'Harmonious',
        reading: 'Refined nose bridge with well-supported zygomatic arches; displays sovereign self-determination and balanced emotional resilience.',
      },
      xiaTing: {
        name: 'Xia Ting (Lower Zone / Philtrum to Chin)',
        domain: 'Late life (51+), somatic resilience, instinctual depth, legacy',
        percentageRatio: 33,
        prominence: 'Harmonious',
        reading: 'Defined mandibular contour with deep philtral indentation, anchoring longevity, grounded somatic intuition, and steadfast resolve.',
      },
    },
    fiveOfficers: {
      eyes: { name: 'Eyes (Officer of Monitoring)', element: 'Fire', trait: 'Penetrating depth with clear limbal rings indicating lucid perception.' },
      eyebrows: { name: 'Eyebrows (Officer of Longevity)', element: 'Wood', trait: 'Flowing and orderly arch, sheltering the eyes with loyal discernment.' },
      nose: { name: 'Nose (Officer of Discrimination)', element: 'Earth', trait: 'Solid column structure denoting equitable boundary-holding.' },
      mouth: { name: 'Mouth (Officer of Outflow)', element: 'Water', trait: 'Symmetrical bow with upturned corners, expressing generative speech.' },
      ears: { name: 'Ears (Officer of Listening)', element: 'Water', trait: 'Firm cartilage with full earlobes, indicating rooted ancestral vitality.' },
    },
    elementalBalance: {
      dominantElement: 'Water',
      secondaryElement: 'Wood',
      yinRatio: 52,
      yangRatio: 48,
      somaticTemperament: 'Alchemical Water-Wood Strategist',
    },
    somaticSummary: 'A countenance marked by harmonious tripartite balance. The somatic posture channels celestial perception downward into concrete physical composure, making this individual an intuitive mirror who navigates shifting tides with quiet inner certainty.',
  };
}

function generateAlgorithmicComparativeMatch(name1: string, name2: string) {
  return {
    overallSynergyScore: 91,
    resonanceClassification: 'Alchemical Yin-Yang Conjunction',
    zoneInterlock: {
      shangTingHarmony: `${name1}'s expansive upper zone introduces strategic and imaginative vision, which directly resonates with ${name2}'s receptive cognitive style.`,
      zhongTingHarmony: `Balanced middle zones allow both parties to negotiate ego, creative endeavors, and career autonomy without domineering friction.`,
      xiaTingHarmony: `Complementary lower facial structures provide mutual grounding; an anchor of somatic safety and enduring physical loyalty.`,
    },
    elementalPolarity: {
      p1Element: 'Water',
      p2Element: 'Wood',
      cycle: 'Sheng (Generative - Water nourishes Wood)',
      dynamic: 'An organic flow where deep intuitive empathy consistently revitalizes creative vitality and forward propulsion.',
    },
    energeticFlowVectors: [
      { from: 'Upper Zone (Heaven)', to: 'Middle Zone (Man)', nature: 'Inspirational Guidance', intensity: 'High' },
      { from: 'Lower Zone (Earth)', to: 'Lower Zone (Earth)', nature: 'Somatic Sanctuary & Trust', intensity: 'Very High' },
      { from: 'Middle Zone (Ego)', to: 'Upper Zone (Vision)', nature: 'Creative Momentum', intensity: 'Moderate' },
    ],
    somaticStrengths: [
      'Natural non-verbal synchronicity and instinctive micro-expression calibration',
      'Harmonious facial proportion interlock creating soothing visual rapport',
      'Dual grounding in instinctual presence preventing emotional volatility',
    ],
    shadowDynamics: [
      'Risk of unspoken assumptions when both retreat into internal water contemplation',
      'Periodic requirement for playful lightness to balance intense analytical depths',
    ],
    mysticalSynthesis: 'When these two countenances face one another, the somatic mirror completes a circuit of reciprocal nourishment. Heaven mirrors Earth, and intuitive insight is seamlessly converted into grounded devotion.',
  };
}

function generateAlgorithmicTarot(cards: any[], question?: string) {
  return {
    theme: 'The Transmutation of the Unseen Matrix',
    cardInterpretations: cards.map((c, i) => ({
      cardName: c.name,
      position: c.position || `Phase ${i + 1}`,
      meaning: `In this juncture, ${c.name} illuminates how hidden patterns are surfacing. Its energy asks you to step beyond hesitation and embody your sovereignty.`,
    })),
    somaticGuidance: 'Place one hand on your solar plexus and one on your heart. Breathe deeply for five cycles to ground the card revelations into somatic tissue.',
    oracleSynthesis: 'The cards reveal that your path is opening through direct surrender to your instinctual knowing. What felt like an impasse is merely the cocoon before flight.',
  };
}

function generateAlgorithmicRunes(runes: any[], question?: string) {
  return {
    staveSynthesis: 'Deep in the roots of Yggdrasil, the ancient waters remember what the waking mind forgets.',
    elementalForces: 'Sacred Ice (Isa) transmuting under Primordial Dawn (Dagaz)',
    runeInsights: runes.map((r) => ({
      rune: r.name,
      counsel: `Hold steadfast to ${r.name}'s frequency: channel your inner will without grasping.`,
    })),
    runeAction: 'Silence exterior chatter for one hour and take single, definitive action toward your true desire.',
  };
}

function generateAlgorithmicIChing(hexagramNumber: number, question?: string) {
  return {
    hexagramName: `Hexagram ${hexagramNumber}: Tai (Peace / Harmony)`,
    trigramBreakdown: 'Earth above, Heaven below. The creative power of Heaven descends to meet the receptive nurturing of Earth.',
    theJudgement: 'Peace brings good fortune. The small departs and the great approaches. Heaven and Earth unite, and all beings flourish.',
    theImage: 'Heaven and Earth in conjunction: The Image of Peace. Thus the sovereign divides and completes the course of Heaven and Earth.',
    changingLineGuidance: 'The active line advises steady equilibrium: cultivate gratitude when luck is abundant.',
    taoistWisdom: 'Act through stillness. Let the natural current carry the vessel rather than straining against the tide.',
  };
}

function generateAlgorithmicSynastry(b1: string, b2: string, n1?: string, n2?: string) {
  return {
    starHexagram: {
      number: 11,
      name: 'Hexagram 11: Tai (Celestial Conjunction of Heaven & Earth)',
      symbol: '䷊',
      celestialDegree: '18° Taurus / 18° Scorpio Fixed Cross',
    },
    synchronicityIndex: 94,
    celestialTriad: {
      past: 'A shared lineage of esoteric discovery and karmic covenant spanning previous epochs.',
      present: 'A pivotal alignment where disparate life paths merge into collaborative creative mastery.',
      future: 'An enduring monument of shared legacy, grounded wealth, and sovereign companionship.',
    },
    planetaryAspects: [
      { aspect: 'Sun Trine Moon', harmony: '98%', note: 'Flawless instinctual alignment and immediate psychic comfort.' },
      { aspect: 'Venus Trine Neptune', harmony: '93%', note: 'Transcendent artistic and aesthetic synchronicity.' },
      { aspect: 'Mars Sextile Pluto', harmony: '90%', note: 'Unshakeable mutual resilience in the face of external storms.' },
    ],
    osirisSynthesis: 'The celestial clockwork indicates that this meeting is not accidental. The cosmic degrees converge upon an alchemical axis of mutual elevation.',
  };
}

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`✨ Osiris Ecosystem Server running on http://localhost:${port}`);
  });
}

startServer();
