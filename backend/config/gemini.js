const { GoogleGenAI } = require('@google/genai');

// ─── KNOWN HIGH-DENSITY MONUMENTS (crowd rerouting reference) ────────────────
const HIGH_DENSITY_SPOTS = {
  'Amber Fort':           { alternateSpot: 'Jaigarh Fort',      distanceKm: 1.2,  perk: '20% off entry + free heritage tea' },
  'Taj Mahal':            { alternateSpot: 'Mehtab Bagh',       distanceKm: 3.5,  perk: '25% off sunset viewing + river view pass' },
  'Dashashwamedh Ghat':  { alternateSpot: 'Assi Ghat',          distanceKm: 2.1,  perk: '15% off morning boat tour + chai voucher' },
  'Baga Beach':           { alternateSpot: 'Morjim Beach',       distanceKm: 14.0, perk: 'Free welcome drink at Morjim Shack' },
  'India Gate':           { alternateSpot: "Humayun's Tomb",    distanceKm: 4.8,  perk: '20% off entry + museum audio guide' },
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
      },
      {
        day: 3, theme: 'Bazaars & Local Flavours',
        places: [
          { placeName: 'Johari Bazaar', timeSlot: '10:00 AM - 12:30 PM', estimatedCost: 1500, category: 'Shopping', practicalTip: 'Best for semi-precious gemstone jewellery. Bargain firmly — expect 30% markup.' },
          { placeName: 'Albert Hall Museum', timeSlot: '01:00 PM - 03:00 PM', estimatedCost: 40, category: 'Museum', practicalTip: 'The oldest museum in Rajasthan — Egyptian mummy and royal artefacts highlight.' },
          { placeName: 'Chokhi Dhani', timeSlot: '06:00 PM - 09:30 PM', estimatedCost: 900, category: 'Food', practicalTip: 'All-inclusive folk village experience with Rajasthani thali dinner. Book ahead.' },
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
      },
      {
        day: 2, theme: 'Mughal Fortresses',
        places: [
          { placeName: 'Agra Fort', timeSlot: '08:00 AM - 11:00 AM', estimatedCost: 640, category: 'Heritage', practicalTip: 'Red sandstone marvel where Shah Jahan was imprisoned. Taj visible from Musamman Burj.' },
          { placeName: 'Fatehpur Sikri', timeSlot: '01:00 PM - 04:30 PM', estimatedCost: 610, category: 'Heritage', practicalTip: '40 km from Agra. Abandoned Mughal capital — hire a guide for historical context.' },
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
      },
      {
        day: 2, theme: 'Ancient Temples & Archaeology',
        places: [
          { placeName: 'Kashi Vishwanath Temple', timeSlot: '06:00 AM - 08:00 AM', estimatedCost: 0, category: 'Religious', practicalTip: 'One of the 12 Jyotirlingas. Deposit phone and bags at locker before entry.' },
          { placeName: 'Sarnath Archaeological Site', timeSlot: '10:00 AM - 01:00 PM', estimatedCost: 530, category: 'Heritage', practicalTip: 'Where Buddha gave his first sermon. Visit the Sarnath Museum for the Lion Capital original.' },
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
      },
      {
        day: 2, theme: 'Cultural Goa',
        places: [
          { placeName: 'Basilica of Bom Jesus', timeSlot: '09:00 AM - 11:00 AM', estimatedCost: 0, category: 'Religious', practicalTip: 'UNESCO World Heritage. Houses St. Francis Xavier\'s relics. Dress modestly.' },
          { placeName: 'Fontainhas Latin Quarter', timeSlot: '11:30 AM - 01:30 PM', estimatedCost: 0, category: 'Heritage', practicalTip: 'Goa\'s charming Portuguese heritage neighbourhood — great for photography and bakeries.' },
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
          { placeName: "Humayun's Tomb", timeSlot: '08:00 AM - 10:30 AM', estimatedCost: 585, category: 'Heritage', practicalTip: 'UNESCO precursor to the Taj Mahal. Gardens are pristine — great for early photography.' },
          { placeName: 'India Gate', timeSlot: '05:00 PM - 07:00 PM', estimatedCost: 0, category: 'Heritage', practicalTip: 'Visit at dusk for the illuminated memorial. Avoid summer afternoons — it\'s extremely hot.' },
          { placeName: 'Connaught Place', timeSlot: '07:30 PM - 09:30 PM', estimatedCost: 800, category: 'Food', practicalTip: 'Vibrant central hub for dinner — try Wengers, United Coffee House, or Rajma Chawal at Sagar Ratna.' },
        ]
      },
      {
        day: 2, theme: 'Islamic Heritage & Old Delhi',
        places: [
          { placeName: 'Qutub Minar', timeSlot: '08:00 AM - 10:30 AM', estimatedCost: 585, category: 'Heritage', practicalTip: 'UNESCO site — visit the Iron Pillar that hasn\'t rusted in 1600 years.' },
          { placeName: 'Jama Masjid', timeSlot: '12:00 PM - 01:30 PM', estimatedCost: 0, category: 'Religious', practicalTip: 'India\'s largest mosque. Cover your head and remove shoes. Minarets offer panoramic views.' },
          { placeName: 'Chandni Chowk', timeSlot: '02:00 PM - 04:30 PM', estimatedCost: 600, category: 'Food', practicalTip: 'Street food paradise — try Paranthe Wali Gali, Jalebi at Old Famous, and Daulat Ki Chaat.' },
        ]
      }
    ]
  }
};

// ─── FALLBACK GENERATOR ───────────────────────────────────────────────────────
function generateFallbackItinerary({ destination, budget, days, interests }) {
  const city = destination.trim();
  const template = FALLBACK_TEMPLATES[city];

  if (!template) {
    // Generic fallback for unlisted cities
    return {
      destination: city,
      budget,
      days,
      interests,
      cityOverview: `Explore the rich culture and heritage of ${city}, one of India's vibrant destinations.`,
      generatedBy: 'smart-tourism-fallback-v1',
      schedule: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        theme: `Day ${i + 1} — Discover ${city}`,
        places: [
          { placeName: `${city} Central Museum`, timeSlot: '09:00 AM - 12:00 PM', estimatedCost: Math.round(budget * 0.05), category: 'Museum', practicalTip: 'Start with local museum for historical context.', crowdStatus: 'GREEN', isAlternative: false },
          { placeName: `${city} Heritage Walk`, timeSlot: '03:00 PM - 06:00 PM', estimatedCost: Math.round(budget * 0.03), category: 'Heritage', practicalTip: 'Join guided heritage walks for curated insights.', crowdStatus: 'GREEN', isAlternative: false },
        ]
      })),
      crowdAlerts: [],
      budgetBreakdown: { accommodation: Math.round(budget * 0.5), food: Math.round(budget * 0.25), transport: Math.round(budget * 0.1), activities: Math.round(budget * 0.15) },
      totalEstimatedCost: budget
    };
  }

  // Cap to requested days
  const scheduledDays = template.days.slice(0, days);

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

  // Budget breakdown
  const perDayCost = Math.round(budget / Math.max(days, 1));
  const totalActivity = schedule.reduce((sum, day) => sum + day.places.reduce((s, p) => s + p.estimatedCost, 0), 0);

  return {
    destination: city,
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
      activities: totalActivity,
      miscellaneous: Math.max(0, budget - Math.round(budget * 0.75) - totalActivity)
    },
    totalEstimatedCost: Math.round(budget * 0.85)
  };
}

// ─── GEMINI AI GENERATOR ──────────────────────────────────────────────────────
let aiClient = null;

function getAIClient() {
  const key = process.env.GEMINI_API_KEY;
  const isMock = !key || key.includes('MOCK') || key.includes('YOUR_') || key.length < 20;
  if (isMock) return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

async function generateSmartItinerary({ destination, budget, days, interests }) {
  const client = getAIClient();

  if (!client) {
    console.log('ℹ️  Gemini API key not configured — using smart fallback generator.');
    return generateFallbackItinerary({ destination, budget, days, interests });
  }

  const interestsList = Array.isArray(interests) ? interests.join(', ') : interests;

  const prompt = `You are an expert Indian tourism planner with real-time crowd intelligence.

Generate a detailed ${days}-day travel itinerary for ${destination}, India.
Tourist budget: ₹${budget} total for ${days} days.
Interests: ${interestsList}.

Rules:
1. Generate exactly ${days} days of schedule.
2. Each day must have 2-3 places to visit.
3. For each place provide: placeName, timeSlot (e.g. "09:00 AM - 12:00 PM"), estimatedCost (in INR integer), category (one of: Heritage, Religious, Beach, Nature, Museum, Adventure, Food, Shopping), practicalTip (one helpful, specific local tip).
4. crowdStatus: If the place is known to be high-density (Amber Fort, Taj Mahal, Dashashwamedh Ghat, Baga Beach, India Gate), set crowdStatus to "RED" and include alternateSpot with: name, distanceKm, incentive.
5. isAlternative: true only if this place was added as a crowd-diversion alternative.
6. Include a cityOverview (2-sentence description), budgetBreakdown object, and totalEstimatedCost.
7. Ensure totalEstimatedCost is <= budget.
8. Return ONLY valid JSON — no markdown fences, no commentary.

JSON schema:
{
  "destination": string,
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
    console.log(`✅ Gemini AI itinerary generated for ${destination} (${days} days)`);
    return parsed;

  } catch (err) {
    console.warn(`⚠️  Gemini API error: ${err.message} — falling back to smart generator.`);
    return generateFallbackItinerary({ destination, budget, days, interests });
  }
}

module.exports = { generateSmartItinerary, HIGH_DENSITY_SPOTS };
