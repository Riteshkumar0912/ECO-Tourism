const { GoogleGenAI } = require('@google/genai');

// ─── KNOWN HIGH-DENSITY MONUMENTS (crowd rerouting reference) ────────────────
const HIGH_DENSITY_SPOTS = {
  'Amber Fort':           { alternateSpot: 'Jaigarh Fort',      distanceKm: 1.2,  perk: '20% off entry + free heritage tea' },
  'Taj Mahal':            { alternateSpot: 'Mehtab Bagh',       distanceKm: 2.1,  perk: '25% off sunset viewing + river view pass' },
  'Dashashwamedh Ghat':  { alternateSpot: 'Assi Ghat',          distanceKm: 4.2,  perk: '15% off morning boat tour + chai voucher' },
  'Baga Beach':           { alternateSpot: 'Morjim Beach',       distanceKm: 14.0, perk: 'Free welcome drink at Morjim Shack' },
  'Red Fort':             { alternateSpot: 'Safdarjung Tomb',   distanceKm: 3.4,  perk: 'Free Heritage Audio Guide + 20% Metro Pass Rebate' },
  'India Gate':           { alternateSpot: "Humayun's Tomb",    distanceKm: 4.8,  perk: '20% off entry + museum audio guide' },
  'Gateway of India':     { alternateSpot: 'Kanheri Caves',     distanceKm: 8.5,  perk: '20% Heritage Ferry Discount + Audio Guide' },
  'City Palace Udaipur':  { alternateSpot: 'Sajjangarh Monsoon Palace', distanceKm: 5.1, perk: 'Rooftop Sunset Pass + Herbal Refreshment' },
  'Golden Temple Main Gate': { alternateSpot: 'Gobindgarh Fort', distanceKm: 3.2, perk: 'Cultural Show Ticket + Craft Discount' },
  'Victoria Memorial':    { alternateSpot: 'Indian Museum',     distanceKm: 2.8,  perk: '15% Tram Heritage Ride Voucher' },
  'Lalbagh Botanical Garden Glass House': { alternateSpot: 'Cubbon Park', distanceKm: 4.0, perk: 'Organic Garden Refreshment + Audio Map' }
};

// ─── FALLBACK ITINERARY TEMPLATES ────────────────────────────────────────────
const FALLBACK_TEMPLATES = {
  Jaipur: {
    cityOverview: 'The Pink City — a UNESCO World Heritage landscape of Mughal and Rajput architecture.',
    days: [
      {
        day: 1, theme: 'Royal Forts & Panoramic Views',
        places: [
          { placeName: 'Amber Fort', timeSlot: '08:00 AM - 11:00 AM', estimatedCost: 500,  category: 'Heritage', practicalTip: 'Arrive at opening to avoid peak heat and crowds. Book elephant ride in advance.' },
          { placeName: 'Jaigarh Fort', timeSlot: '11:30 AM - 01:00 PM', estimatedCost: 85, category: 'Heritage', practicalTip: 'Connected to Amber via tunnel — explore the world\'s largest cannon on wheels.' },
          { placeName: 'Nahargarh Fort', timeSlot: '04:00 PM - 06:30 PM', estimatedCost: 50, category: 'Heritage', practicalTip: 'Sunset from the ramparts offers the best city panorama. Café inside for snacks.' },
        ]
      },
      {
        day: 2, theme: 'Walled City & Royal Heritage',
        places: [
          { placeName: 'Hawa Mahal', timeSlot: '09:00 AM - 10:30 AM', estimatedCost: 50,  category: 'Heritage', practicalTip: 'Best photographed from across the street at Café Coffee Day rooftop.' },
          { placeName: 'City Palace Jaipur', timeSlot: '11:00 AM - 02:00 PM', estimatedCost: 200, category: 'Heritage', practicalTip: 'Museum inside has Maharaja arms & royal carriages. Wear comfortable shoes.' },
          { placeName: 'Jantar Mantar', timeSlot: '02:30 PM - 04:00 PM', estimatedCost: 50, category: 'Heritage', practicalTip: 'UNESCO site — hire a local guide to explain the astronomical instruments.' },
        ]
      }
    ]
  },
  Agra: {
    cityOverview: 'City of the Taj — UNESCO World Heritage-rich Mughal capital on the Yamuna.',
    days: [
      {
        day: 1, theme: 'The Eternal Taj',
        places: [
          { placeName: 'Taj Mahal', timeSlot: '06:00 AM - 09:00 AM', estimatedCost: 1150, category: 'Heritage', practicalTip: 'Enter at sunrise for golden light and fewest crowds. Buy tickets online.' },
          { placeName: 'Mehtab Bagh', timeSlot: '05:00 PM - 07:00 PM', estimatedCost: 30, category: 'Nature', practicalTip: 'North bank garden directly opposite Taj — best sunset view with river foreground.' },
        ]
      }
    ]
  },
  Varanasi: {
    cityOverview: 'The spiritual capital of India — one of the world\'s oldest continuously inhabited cities.',
    days: [
      {
        day: 1, theme: 'Sacred Ghats & River Dawn',
        places: [
          { placeName: 'Dashashwamedh Ghat', timeSlot: '05:00 AM - 07:30 AM', estimatedCost: 0, category: 'Religious', practicalTip: 'Early morning aarti boat ride recommended. Hire a boat at Assi Ghat to avoid touts.' },
          { placeName: 'Assi Ghat', timeSlot: '06:00 PM - 08:00 PM', estimatedCost: 0, category: 'Religious', practicalTip: 'Evening yoga and smaller, intimate aarti ceremony — less crowded than Dashashwamedh.' },
        ]
      }
    ]
  },
  Goa: {
    cityOverview: 'India\'s sunshine state — Portuguese colonial heritage meets golden beaches and vibrant nightlife.',
    days: [
      {
        day: 1, theme: 'Pristine Northern Beaches',
        places: [
          { placeName: 'Morjim Beach', timeSlot: '08:00 AM - 12:00 PM', estimatedCost: 300, category: 'Beach', practicalTip: 'Olive Ridley turtle nesting site. Quieter alternative to Baga with Russian shacks.' },
          { placeName: 'Aguada Fort', timeSlot: '02:00 PM - 04:30 PM', estimatedCost: 0, category: 'Heritage', practicalTip: '17th century Portuguese fort with the oldest lighthouse in Asia. Sunset spectacular.' },
        ]
      }
    ]
  },
  Delhi: {
    cityOverview: 'India\'s historic capital — eight cities, three millennia, and a world of cuisines.',
    days: [
      {
        day: 1, theme: 'Mughal & Colonial Delhi',
        places: [
          { placeName: 'Red Fort', timeSlot: '09:30 AM - 12:30 PM', estimatedCost: 500, category: 'Heritage', practicalTip: 'Iconic red sandstone Mughal fortress. Explore Lahori Gate & Diwan-i-Khas.' },
          { placeName: 'Safdarjung Tomb', timeSlot: '03:00 PM - 05:30 PM', estimatedCost: 50, category: 'Heritage', practicalTip: 'Tranquil garden tomb with zero crowds. Ideal for peaceful evening walk.' },
        ]
      }
    ]
  },
  Mumbai: {
    cityOverview: 'Financial capital of India — Victorian Gothic landmarks, coastal promenades, and film heritage.',
    days: [
      {
        day: 1, theme: 'Colonial Architecture & Marine Bay',
        places: [
          { placeName: 'Gateway of India', timeSlot: '08:00 AM - 10:30 AM', estimatedCost: 0, category: 'Heritage', practicalTip: 'Iconic harbor arch. Enter early to beat ferry crowds.' },
          { placeName: 'Kanheri Caves', timeSlot: '11:30 AM - 02:30 PM', estimatedCost: 200, category: 'Heritage', practicalTip: 'Buddhist cave complex inside Sanjay Gandhi National Park.' },
        ]
      }
    ]
  },
  Udaipur: {
    cityOverview: 'City of Lakes — majestic Mewar royal palaces and serene desert waters.',
    days: [
      {
        day: 1, theme: 'Royal Mewar Palaces & Lakes',
        places: [
          { placeName: 'City Palace Udaipur', timeSlot: '09:00 AM - 12:00 PM', estimatedCost: 300, category: 'Heritage', practicalTip: 'Explore Mewar royal armory and lake balconies.' },
          { placeName: 'Sajjangarh Monsoon Palace', timeSlot: '04:00 PM - 06:30 PM', estimatedCost: 100, category: 'Heritage', practicalTip: 'Hilltop sanctuary offering panoramic sunset over Lake Pichola.' },
        ]
      }
    ]
  },
  Amritsar: {
    cityOverview: 'Spiritual capital of Sikhism — home to the Golden Temple and Punjabi heritage.',
    days: [
      {
        day: 1, theme: 'Golden Sanctuary & Fortresses',
        places: [
          { placeName: 'Golden Temple Main Gate', timeSlot: '06:00 AM - 09:00 AM', estimatedCost: 0, category: 'Religious', practicalTip: 'Serene morning atmosphere and world-famous free langar.' },
          { placeName: 'Gobindgarh Fort', timeSlot: '02:00 PM - 05:00 PM', estimatedCost: 150, category: 'Heritage', practicalTip: '18th-century Sikh military fortress and cultural museum.' },
        ]
      }
    ]
  },
  Kolkata: {
    cityOverview: 'City of Joy — imperial marble monuments, literary cafes, and artistic heritage.',
    days: [
      {
        day: 1, theme: 'Marble Monuments & Cultural Guilds',
        places: [
          { placeName: 'Victoria Memorial', timeSlot: '10:00 AM - 01:00 PM', estimatedCost: 50, category: 'Heritage', practicalTip: 'White marble museum surrounded by formal botanical gardens.' },
          { placeName: 'Indian Museum', timeSlot: '02:00 PM - 04:30 PM', estimatedCost: 50, category: 'Museum', practicalTip: 'Ninth oldest museum in the world with rare heritage galleries.' },
        ]
      }
    ]
  },
  Bengaluru: {
    cityOverview: 'Garden City & Tech Hub — royal palaces, botanical glasshouses, and eco parks.',
    days: [
      {
        day: 1, theme: 'Botanical Canopies & Royal Grounds',
        places: [
          { placeName: 'Lalbagh Botanical Garden Glass House', timeSlot: '08:00 AM - 11:00 AM', estimatedCost: 30, category: 'Nature', practicalTip: '240-acre glasshouse botanical sanctuary.' },
          { placeName: 'Cubbon Park', timeSlot: '03:00 PM - 06:00 PM', estimatedCost: 0, category: 'Nature', practicalTip: 'Shaded eco canopy walks in the heart of Bengaluru.' },
        ]
      }
    ]
  }
};

// ─── FALLBACK GENERATOR ───────────────────────────────────────────────────────
function generateFallbackItinerary({ destination, city, budget, days, interests }) {
  const targetCity = (city || destination || 'Jaipur').trim();
  const templateKey = Object.keys(FALLBACK_TEMPLATES).find(k => k.toLowerCase() === targetCity.toLowerCase());
  const template = templateKey ? FALLBACK_TEMPLATES[templateKey] : null;

  if (!template) {
    return {
      destination: targetCity,
      budget,
      days,
      interests,
      cityOverview: `Explore the rich culture and heritage of ${targetCity}, one of India's vibrant destinations.`,
      generatedBy: 'smart-tourism-fallback-v1',
      schedule: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        theme: `Day ${i + 1} — Discover ${targetCity}`,
        places: [
          { placeName: `${targetCity} Central Museum`, timeSlot: '09:00 AM - 12:00 PM', estimatedCost: Math.round(budget * 0.05), category: 'Museum', practicalTip: `Start with local museum in ${targetCity} for historical context.`, crowdStatus: 'GREEN', isAlternative: false },
          { placeName: `${targetCity} Heritage Walk`, timeSlot: '03:00 PM - 06:00 PM', estimatedCost: Math.round(budget * 0.03), category: 'Heritage', practicalTip: `Join guided heritage walks through ${targetCity}.`, crowdStatus: 'GREEN', isAlternative: false },
        ]
      })),
      crowdAlerts: [],
      budgetBreakdown: { accommodation: Math.round(budget * 0.5), food: Math.round(budget * 0.25), transport: Math.round(budget * 0.1), activities: Math.round(budget * 0.15) },
      totalEstimatedCost: budget
    };
  }

  let scheduledDays = template.days.slice(0, days);
  if (scheduledDays.length < days) {
    for (let i = scheduledDays.length; i < days; i++) {
      scheduledDays.push({
        day: i + 1,
        theme: `Day ${i + 1} — Local Hidden Gems of ${templateKey}`,
        places: [
          { placeName: `${templateKey} Crafts & Heritage Center`, timeSlot: '10:00 AM - 01:00 PM', estimatedCost: Math.round(budget * 0.04), category: 'Heritage', practicalTip: `Discover local artisanal heritage of ${templateKey}.` },
          { placeName: `${templateKey} Sunset View Point`, timeSlot: '05:00 PM - 07:00 PM', estimatedCost: Math.round(budget * 0.02), category: 'Nature', practicalTip: 'Panoramic views with zero entry queue.' }
        ]
      });
    }
  }

  const schedule = scheduledDays.map(dayData => ({
    day: dayData.day,
    theme: dayData.theme,
    places: dayData.places.map(place => {
      const crowdAlert = HIGH_DENSITY_SPOTS[place.placeName];
      return {
        placeName: place.placeName,
        timeSlot: place.timeSlot,
        estimatedCost: place.estimatedCost,
        category: place.category,
        practicalTip: place.practicalTip,
        crowdStatus: crowdAlert ? 'RED' : 'GREEN',
        isAlternative: false,
        ...(crowdAlert && {
          crowdWarning: `⚠️ ${place.placeName} is currently at high capacity.`,
          alternateSpot: {
            name: crowdAlert.alternateSpot,
            distanceKm: crowdAlert.distanceKm,
            incentive: crowdAlert.perk
          }
        })
      };
    })
  }));

  return {
    destination: templateKey || targetCity,
    budget,
    days,
    interests,
    cityOverview: template.cityOverview,
    generatedBy: 'smart-tourism-fallback-v1',
    schedule,
    crowdAlerts: Object.keys(HIGH_DENSITY_SPOTS)
      .filter(name => schedule.some(d => d.places.some(p => p.placeName === name)))
      .map(name => ({ monument: name, status: 'RED', alternative: HIGH_DENSITY_SPOTS[name].alternateSpot })),
    budgetBreakdown: {
      accommodation: Math.round(budget * 0.45),
      food: Math.round(budget * 0.2),
      transport: Math.round(budget * 0.1),
      activities: Math.round(budget * 0.15),
      miscellaneous: Math.round(budget * 0.1)
    },
    totalEstimatedCost: Math.round(budget * 0.85)
  };
}

// ─── GEMINI AI CLIENT ─────────────────────────────────────────────────────────
let aiClient = null;

function getAIClient() {
  const key = process.env.GEMINI_API_KEY;
  const isMock = !key || key.includes('MOCK') || key.includes('YOUR_') || key.length < 20;
  if (isMock) return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

// ─── 1. PERSONALIZED ECO-ITINERARY GENERATOR ────────────────────────────────
async function generateSmartItinerary({ destination, city, budget, days, travelPace, interests }) {
  const client = getAIClient();
  const targetCity = (city || destination || 'Jaipur').trim();

  if (!client) {
    console.log(`ℹ️  Gemini API key not configured — using smart fallback generator for ${targetCity}.`);
    return generateFallbackItinerary({ destination: targetCity, city: targetCity, budget, days, interests });
  }

  const interestsList = Array.isArray(interests) ? interests.join(', ') : (interests || 'Heritage, Culture, Eco-friendly');
  const pace = travelPace || 'Moderate';

  const prompt = `You are an expert sustainable tourism planner with real-time crowd intelligence.
Create a personalized day-wise eco-travel itinerary strictly for the city: "${targetCity}", India.

CRITICAL LOCATION RULE:
ONLY include authentic monuments, heritage sites, markets, and attractions located strictly within "${targetCity}".
Do NOT include places from other cities under any circumstances (for example: if city is Delhi, ONLY include Delhi attractions such as Humayun's Tomb, Qutub Minar, Red Fort, India Gate, Lotus Temple, Chandni Chowk, Jama Masjid, etc. Do NOT include Jaipur or Agra monuments).

Trip parameters:
- City: ${targetCity}
- Duration: ${days} days
- Budget: ₹${budget} total for ${days} days
- Travel Pace: ${pace}
- Interests: ${interestsList}

Rules:
1. Generate exactly ${days} days of schedule.
2. Each day must have 2-3 places to visit strictly in ${targetCity}.
3. For each place provide: placeName, timeSlot (e.g. "09:00 AM - 12:00 PM"), estimatedCost (in INR integer), category (one of: Heritage, Religious, Beach, Nature, Museum, Adventure, Food, Shopping), practicalTip (one helpful, specific local tip for ${targetCity}).
4. crowdStatus: If the place is known to be high-density (Amber Fort, Taj Mahal, Dashashwamedh Ghat, Baga Beach, India Gate), set crowdStatus to "RED" and include alternateSpot with: name, distanceKm, incentive.
5. isAlternative: true only if this place was added as a crowd-diversion alternative.
6. Include a cityOverview (2-sentence description of ${targetCity}), budgetBreakdown object, and totalEstimatedCost.
7. Ensure totalEstimatedCost is <= budget.
8. Return ONLY valid JSON — no markdown fences, no commentary.

JSON schema:
{
  "destination": "${targetCity}",
  "budget": number,
  "days": number,
  "interests": [string],
  "cityOverview": string,
  "generatedBy": "gemini-ai",
  "schedule": [
    {
      "day": number,
      "theme": string,
      "places": [
        {
          "placeName": string,
          "timeSlot": string,
          "estimatedCost": number,
          "category": string,
          "practicalTip": string,
          "crowdStatus": "GREEN" | "YELLOW" | "RED",
          "isAlternative": boolean,
          "crowdWarning": string | null,
          "alternateSpot": { "name": string, "distanceKm": number, "incentive": string } | null
        }
      ]
    }
  ],
  "crowdAlerts": [{ "monument": string, "status": string, "alternative": string }],
  "budgetBreakdown": { "accommodation": number, "food": number, "transport": number, "activities": number, "miscellaneous": number },
  "totalEstimatedCost": number
}`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 4096
      }
    });

    const rawText = response.text();
    const parsed = JSON.parse(rawText);
    parsed.generatedBy = 'gemini-ai';
    parsed.destination = targetCity;
    console.log(`✅ Gemini AI itinerary generated for ${targetCity} (${days} days)`);
    return parsed;

  } catch (err) {
    console.warn(`⚠️  Gemini API error: ${err.message} — falling back to smart generator for ${targetCity}.`);
    return generateFallbackItinerary({ destination: targetCity, city: targetCity, budget, days, interests });
  }
}

// ─── 2. DYNAMIC CROWD REROUTE EXPLANATION ────────────────────────────────────
async function generateRerouteReasoning({ originalSpot, alternateSpot, currentLoad, city }) {
  const client = getAIClient();

  if (!client) {
    return {
      originalSpot,
      alternateSpot,
      currentLoad: currentLoad || 92,
      reasoning: `${originalSpot} is currently operating at ${currentLoad || 92}% saturation. Recommending ${alternateSpot} in ${city || 'the area'} ensures a smoother experience with zero queue delays and exclusive green incentive perks.`,
      ecoImpact: 'Reduces peak footfall pressure on historic structures by 25% and distributes regional tourism revenue evenly.',
      recommendedBestTime: 'Visit primary spot early morning tomorrow (07:30 AM) when saturation drops below 40%.'
    };
  }

  const prompt = `You are an AI Crowd Intelligence & Sustainable Tourism Specialist for Indian Heritage Sites.
Provide a real-time advisory on why tourists should temporarily reroute from ${originalSpot} to ${alternateSpot} in ${city || 'India'}.
${originalSpot} is currently experiencing high crowd saturation (${currentLoad || 92}% capacity).

Return ONLY valid JSON matching this schema:
{
  "originalSpot": "${originalSpot}",
  "alternateSpot": "${alternateSpot}",
  "currentLoad": ${currentLoad || 92},
  "reasoning": string (2 clear sentences on why rerouting avoids queues & enhances experience),
  "ecoImpact": string (1 sentence on structural conservation and sustainable crowd distribution),
  "recommendedBestTime": string (best time slot to visit ${originalSpot} later)
}`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

    return JSON.parse(response.text());
  } catch (err) {
    console.warn(`⚠️  Gemini reroute reasoning fallback: ${err.message}`);
    return {
      originalSpot,
      alternateSpot,
      currentLoad: currentLoad || 92,
      reasoning: `${originalSpot} is experiencing ${currentLoad || 92}% peak capacity. Redirection to ${alternateSpot} guarantees shorter wait times and a comfortable visit.`,
      ecoImpact: 'Balanced footfall preserves heritage masonry and reduces urban congestion.',
      recommendedBestTime: 'Early morning (07:30 AM - 09:00 AM) tomorrow.'
    };
  }
}

// ─── 3. LOCAL CULTURAL & ECO INSIGHTS ─────────────────────────────────────────
async function generateLocalInsights({ spotName, city }) {
  const client = getAIClient();

  if (!client) {
    return {
      spotName,
      city,
      culturalInsight: `${spotName} is an architectural emblem in ${city}, celebrated for its rich historical craftsmanship and heritage significance.`,
      sustainabilityTip: 'Use eco-friendly electric rickshaws or walk along marked heritage corridors; carry reusable water bottles.',
      insiderTip: 'Visit during early morning hours for optimal photography light and peaceful exploration.'
    };
  }

  const prompt = `You are an expert Indian heritage historian and eco-tourism guide.
Generate concise cultural insights and eco-sustainability recommendations for ${spotName} in ${city || 'India'}.

Return ONLY valid JSON matching this schema:
{
  "spotName": "${spotName}",
  "city": "${city || 'India'}",
  "culturalInsight": string (2 engaging sentences on history & significance),
  "sustainabilityTip": string (1 actionable eco-friendly advice for visitors),
  "insiderTip": string (1 practical tip on timing or hidden spots)
}`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

    return JSON.parse(response.text());
  } catch (err) {
    console.warn(`⚠️  Gemini local insights fallback: ${err.message}`);
    return {
      spotName,
      city,
      culturalInsight: `${spotName} represents iconic architectural heritage in ${city}.`,
      sustainabilityTip: 'Dispose of waste responsibly in designated bins and support local artisans nearby.',
      insiderTip: 'Early mornings offer the best atmosphere and lowest crowds.'
    };
  }
}

module.exports = {
  generateSmartItinerary,
  generateRerouteReasoning,
  generateLocalInsights,
  HIGH_DENSITY_SPOTS
};
