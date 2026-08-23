import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import { useSocket } from '../context/SocketContext';
import {
  Map, Sparkles, IndianRupee, Calendar, Tag, Loader2,
  ChevronDown, ChevronUp, Clock, MapPin, AlertTriangle,
  CheckCircle, X, ArrowRight, Gift, Printer, Leaf,
  Navigation, Users, Star, Coffee, Camera, Mountain,
  Utensils, Heart, Zap, Shield, TrendingUp, Info, Landmark,
  ShieldCheck, Ticket, Check, Sun, Award
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'https://eco-tourism-fhui.onrender.com').replace(/\/$/, '');
const CITIES = ['Jaipur', 'Agra', 'Varanasi', 'Goa', 'Delhi', 'Mumbai', 'Udaipur', 'Amritsar', 'Kolkata', 'Bengaluru'];

const INTEREST_OPTIONS = [
  { id: 'Heritage',   label: 'Heritage & History', icon: Landmark },
  { id: 'Food',       label: 'Food & Culture',     icon: Utensils },
  { id: 'Photography',label: 'Photography',        icon: Camera },
  { id: 'Nature',     label: 'Nature & Adventure', icon: Leaf },
  { id: 'Religious',  label: 'Spiritual & Temples', icon: ShieldCheck },
];

const STATUS_CONFIG = {
  GREEN:  { label: 'Low Density (35%)',   color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-600' },
  YELLOW: { label: 'Moderate Density (65%)', color: 'text-amber-800',  bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500' },
  RED:    { label: 'High Density (92%)', color: 'text-red-800',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-600' },
};

const PLACE_IMAGES = {
  'Amber Fort': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80',
  'Jaigarh Fort': 'https://images.unsplash.com/photo-1609137144822-472a1e64177d?auto=format&fit=crop&w=700&q=80',
  'Hawa Mahal': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80',
  'Taj Mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80',
  'Mehtab Bagh': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=700&q=80',
  'Agra Fort': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
  'Dashashwamedh Ghat': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=700&q=80',
  'Assi Ghat': 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=700&q=80',
  'India Gate': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=80',
  'Qutub Minar': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=700&q=80',
  "Humayun's Tomb": 'https://i.pinimg.com/736x/21/e4/20/21e420db5508a8a7caadca71ea0dcbc1.jpg',
  'Baga Beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80',
  'Morjim Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
  'Aguada Fort': 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=700&q=80',
};

// ─── City Hero Showcase Data ──────────────────────────────────────────────────

const CITY_HERO_DATA = {
  Jaipur: {
    state: 'Rajasthan',
    title: 'Jaipur — The Pink City',
    tagline: 'UNESCO World Heritage royal landscape of Mughal & Rajput forts.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    weather: '26°C · Ideal Sunlight',
    bestTime: 'Best Oct – Mar',
    monuments: [
      { name: 'Amber Fort', load: 92, status: 'RED', queue: '45 mins queue', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80' },
      { name: 'Jaigarh Fort', load: 35, status: 'GREEN', queue: '< 5 mins queue (Recommended)', img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=400&q=80' },
      { name: 'Hawa Mahal', load: 65, status: 'YELLOW', queue: '15 mins queue', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  Agra: {
    state: 'Uttar Pradesh',
    title: 'Agra — City of the Taj',
    tagline: 'Historic Mughal capital on the Yamuna banks with 3 UNESCO Heritage sites.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    weather: '24°C · Mild Breeze',
    bestTime: 'Best Oct – Mar',
    monuments: [
      { name: 'Taj Mahal', load: 95, status: 'RED', queue: '60 mins queue', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80' },
      { name: 'Mehtab Bagh', load: 28, status: 'GREEN', queue: '< 5 mins queue (Recommended)', img: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=400&q=80' },
      { name: 'Agra Fort', load: 60, status: 'YELLOW', queue: '20 mins queue', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  Varanasi: {
    state: 'Uttar Pradesh',
    title: 'Varanasi — Spiritual Capital',
    tagline: 'Ancient living city on the sacred Ganges river with timeless ghats.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    weather: '25°C · Clear Sky',
    bestTime: 'Best Nov – Feb',
    monuments: [
      { name: 'Dashashwamedh Ghat', load: 88, status: 'RED', queue: 'High Congestion', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80' },
      { name: 'Assi Ghat', load: 30, status: 'GREEN', queue: 'Spacious (Recommended)', img: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sarnath Site', load: 45, status: 'GREEN', queue: '10 mins queue', img: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  Goa: {
    state: 'Goa',
    title: 'Goa — Coastal Heritage & Beaches',
    tagline: 'Portuguese colonial architecture meets pristine eco beaches & sanctuaries.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    weather: '29°C · Coastal Breeze',
    bestTime: 'Best Nov – Mar',
    monuments: [
      { name: 'Baga Beach', load: 90, status: 'RED', queue: 'Peak Traffic', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
      { name: 'Morjim Beach', load: 25, status: 'GREEN', queue: 'Quiet Zone (Recommended)', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      { name: 'Aguada Fort', load: 50, status: 'YELLOW', queue: '15 mins queue', img: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  Delhi: {
    state: 'National Capital Territory',
    title: 'Delhi — Historic Capital Hub',
    tagline: 'Three millennia of royal empires, Mughal tombs & vibrant bazaars.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    weather: '23°C · Crisp Air',
    bestTime: 'Best Oct – Mar',
    monuments: [
      { name: 'India Gate', load: 92, status: 'RED', queue: 'High Perimeter Rush', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
      { name: "Humayun's Tomb", load: 32, status: 'GREEN', queue: '< 5 mins queue (Recommended)', img: 'https://i.pinimg.com/736x/21/e4/20/21e420db5508a8a7caadca71ea0dcbc1.jpg' },
      { name: 'Qutub Minar', load: 58, status: 'YELLOW', queue: '15 mins queue', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=400&q=80' },
    ]
  }
};

// ─── Realistic Fallback Itinerary Data ────────────────────────────────────────

function buildFallbackItinerary(destination, budget, days, interests) {
  const templates = {
    Jaipur: [
      { day: 1, theme: 'Royal Forts & Panoramic Views', places: [
        { placeName: 'Amber Fort', timeSlot: '08:00 AM – 11:00 AM', estimatedCost: 500, category: 'Heritage', practicalTip: 'Arrive at opening to beat heat and crowds. Book elephant ride in advance.', crowdStatus: 'RED', isAlternative: false },
        { placeName: 'Jaigarh Fort', timeSlot: '11:30 AM – 01:00 PM', estimatedCost: 85, category: 'Heritage', practicalTip: 'Connected to Amber — explore the world\'s largest cannon on wheels.', crowdStatus: 'GREEN', isAlternative: false },
        { placeName: 'Nahargarh Fort', timeSlot: '04:30 PM – 06:30 PM', estimatedCost: 50, category: 'Heritage', practicalTip: 'Sunset from the ramparts is spectacular. Café inside for chai and snacks.', crowdStatus: 'GREEN', isAlternative: false },
      ]},
      { day: 2, theme: 'Walled City & Royal Palaces', places: [
        { placeName: 'Hawa Mahal', timeSlot: '09:00 AM – 10:30 AM', estimatedCost: 50, category: 'Heritage', practicalTip: 'Best photographed from the rooftop across the street.', crowdStatus: 'GREEN', isAlternative: false },
        { placeName: 'City Palace Jaipur', timeSlot: '11:00 AM – 01:30 PM', estimatedCost: 200, category: 'Heritage', practicalTip: 'Museum holds Maharaja arms & royal carriages. Wear comfortable shoes.', crowdStatus: 'YELLOW', isAlternative: false },
        { placeName: 'Jantar Mantar', timeSlot: '02:30 PM – 04:00 PM', estimatedCost: 50, category: 'Heritage', practicalTip: 'UNESCO site — hire a guide to decode the astronomical instruments.', crowdStatus: 'GREEN', isAlternative: false },
      ]},
      { day: 3, theme: 'Bazaars, Art & Local Flavours', places: [
        { placeName: 'Johari Bazaar', timeSlot: '10:00 AM – 12:30 PM', estimatedCost: 1500, category: 'Shopping', practicalTip: 'Best for semi-precious jewellery. Bargain firmly — expect 30% markup.', crowdStatus: 'GREEN', isAlternative: false },
        { placeName: 'Albert Hall Museum', timeSlot: '01:00 PM – 03:00 PM', estimatedCost: 40, category: 'Museum', practicalTip: 'Oldest museum in Rajasthan — Egyptian mummy is the star exhibit.', crowdStatus: 'GREEN', isAlternative: false },
        { placeName: 'Chokhi Dhani', timeSlot: '06:00 PM – 09:30 PM', estimatedCost: 900, category: 'Food', practicalTip: 'All-inclusive folk village experience with authentic Rajasthani thali dinner.', crowdStatus: 'GREEN', isAlternative: false },
      ]},
    ],
  };

  const cityData = templates[destination] || templates['Jaipur'];
  const schedule = cityData.slice(0, Math.min(days, cityData.length));

  return {
    _id: `local_${Date.now()}`,
    destination,
    budget,
    days,
    interests,
    schedule,
    isLocal: true,
    cityOverview: `Explore the rich culture and sustainable heritage spots of ${destination}.`,
    crowdAlerts: [],
    budgetBreakdown: {
      accommodation: Math.round(budget * 0.45),
      food: Math.round(budget * 0.20),
      transport: Math.round(budget * 0.10),
      activities: Math.round(schedule.reduce((sum, day) =>
        sum + day.places.reduce((s, p) => s + p.estimatedCost, 0), 0)),
    },
    totalEstimatedCost: Math.round(budget * 0.85),
  };
}

// ─── Coupon Catalogue & City Reroute Definitions ─────────────────────────────

const COUPON_MAP = {
  // Jaipur
  'Amber Fort':          { code: 'JAIGARH20',       discount: 20, alt: 'Jaigarh Fort',        distKm: 1.2,  perk: '20% Entry Discount + Partner Hospitality Perk', businessName: 'Rajputana Heritage Café' },
  'Hawa Mahal':          { code: 'JAIGARH20',       discount: 20, alt: 'Jaigarh Fort',        distKm: 3.5,  perk: '20% Entry Discount + Partner Hospitality Perk', businessName: 'Rajputana Heritage Café' },
  'City Palace Jaipur':  { code: 'JAIGARH20',       discount: 20, alt: 'Nahargarh Fort',      distKm: 4.1,  perk: '20% Entry Discount + Free Heritage Tea',        businessName: 'Nahargarh Palace Café' },

  // Agra
  'Taj Mahal':           { code: 'MEHTAB25',         discount: 25, alt: 'Mehtab Bagh',         distKm: 3.5,  perk: '25% Entry Discount + River View Photography Pass', businessName: 'Yamuna Riverside Tours' },
  'Agra Fort':           { code: 'MEHTAB25',         discount: 25, alt: 'Mehtab Bagh',         distKm: 4.2,  perk: '25% Entry Discount + Sunset View Pass',         businessName: 'Mughal Heritage Walks' },

  // Varanasi
  'Dashashwamedh Ghat':  { code: 'ASSIGHAT15',       discount: 15, alt: 'Assi Ghat',           distKm: 2.1,  perk: '15% Boat Tour Discount + Complimentary Refreshment', businessName: 'Kashi Boat Services' },
  'Kashi Vishwanath':    { code: 'ASSIGHAT15',       discount: 15, alt: 'Assi Ghat',           distKm: 2.5,  perk: '15% Entry Discount + Temple Pass',             businessName: 'Kashi Spiritual Tours' },

  // Goa
  'Baga Beach':          { code: 'MORJIMPERK',        discount: 10, alt: 'Morjim Beach',        distKm: 14.0, perk: 'Complimentary Welcome Drink at Morjim Partner Shack', businessName: 'Morjim Shack & Bar' },
  'Calangute Beach':     { code: 'MORJIMPERK',        discount: 10, alt: 'Morjim Beach',        distKm: 12.5, perk: 'Complimentary Welcome Drink at Morjim Shack', businessName: 'Morjim Shack & Bar' },

  // Delhi
  'India Gate':          { code: 'HERITAGEDELHI',     discount: 20, alt: "Humayun's Tomb",     distKm: 4.8,  perk: '20% Entry Discount + Audio Guide Included', businessName: 'Delhi Heritage Audio Guides' },
  'Red Fort':            { code: 'HERITAGEDELHI',     discount: 20, alt: "Humayun's Tomb",     distKm: 4.8,  perk: '20% Entry Discount + Audio Guide Included', businessName: 'Delhi Heritage Audio Guides' },
  'Qutub Minar':         { code: 'HERITAGEDELHI',     discount: 20, alt: "Humayun's Tomb",     distKm: 8.5,  perk: '20% Entry Discount + Museum Pass',         businessName: 'Delhi Heritage Audio Guides' },
};

export const CITY_CROWD_REGISTRY = {
  Delhi: {
    primary: "Red Fort",
    alternate: "Safdarjung Tomb",
    distance: "3.4 km",
    saturation: "92%",
    primaryQueue: "~55m Long Queue",
    altQueue: "< 5m Instant Entry",
    perk: "Free Heritage Audio Guide + 20% Metro Pass Rebate",
    primaryImg: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
    altImg: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=600"
  },
  Jaipur: {
    primary: "Amber Fort",
    alternate: "Jaigarh Fort",
    distance: "1.2 km",
    saturation: "94%",
    primaryQueue: "~45m Long Queue",
    altQueue: "< 5m Instant Entry",
    perk: "20% Entry Discount + Partner Hospitality Perk",
    primaryImg: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    altImg: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600"
  },
  Agra: {
    primary: "Taj Mahal",
    alternate: "Mehtab Bagh & Itimad-ud-Daulah",
    distance: "2.1 km",
    saturation: "96%",
    primaryQueue: "~65m Long Queue",
    altQueue: "< 10m Instant Entry",
    perk: "Sunset View Point Access + 25% Souvenir Voucher",
    primaryImg: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    altImg: "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600"
  },
  Varanasi: {
    primary: "Dashashwamedh Ghat",
    alternate: "Assi Ghat & Sarnath Heritage Complex",
    distance: "4.2 km",
    saturation: "91%",
    primaryQueue: "~50m Crowd Congestion",
    altQueue: "< 5m Peaceful Access",
    perk: "Eco-Boat Ride Pass + Cultural Tea Voucher",
    primaryImg: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
    altImg: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600"
  },
  Goa: {
    primary: "Baga Beach",
    alternate: "Morjim Beach & Chorao Island",
    distance: "14.0 km",
    saturation: "90%",
    primaryQueue: "~45m Peak Traffic",
    altQueue: "< 5m Quiet Zone Entry",
    perk: "Complimentary Welcome Drink at Morjim Shack",
    primaryImg: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    altImg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
  },
  Mumbai: {
    primary: "Gateway of India",
    alternate: "Kanheri Caves & Elephanta Heritage Walk",
    distance: "8.5 km",
    saturation: "93%",
    primaryQueue: "~50m Rush Hour Queue",
    altQueue: "< 10m Eco Trail Access",
    perk: "20% Heritage Ferry Discount + Audio Guide",
    primaryImg: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600",
    altImg: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600"
  },
  Udaipur: {
    primary: "City Palace Udaipur",
    alternate: "Sajjangarh Monsoon Palace",
    distance: "5.1 km",
    saturation: "89%",
    primaryQueue: "~40m Entrance Queue",
    altQueue: "< 5m Scenic Entry",
    perk: "Rooftop Sunset Pass + Herbal Refreshment",
    primaryImg: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600",
    altImg: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600"
  },
  Amritsar: {
    primary: "Golden Temple Main Gate",
    alternate: "Gobindgarh Fort & Ram Bagh",
    distance: "3.2 km",
    saturation: "95%",
    primaryQueue: "~60m Queue",
    altQueue: "< 5m Instant Entry",
    perk: "Cultural Show Ticket + Heritage Craft Discount",
    primaryImg: "https://images.unsplash.com/photo-1588096344356-9b5797f1f91b?w=600",
    altImg: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600"
  },
  Kolkata: {
    primary: "Victoria Memorial",
    alternate: "Indian Museum & Marble Palace",
    distance: "2.8 km",
    saturation: "90%",
    primaryQueue: "~45m Entry Queue",
    altQueue: "< 5m Quiet Garden Access",
    perk: "15% Tram Heritage Ride Voucher",
    primaryImg: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600",
    altImg: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600"
  },
  Bengaluru: {
    primary: "Lalbagh Botanical Garden Glass House",
    alternate: "Cubbon Park & Bangalore Palace",
    distance: "4.0 km",
    saturation: "88%",
    primaryQueue: "~35m Gate Queue",
    altQueue: "< 5m Eco Canopy Walk",
    perk: "Organic Garden Refreshment + Audio Map",
    primaryImg: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600",
    altImg: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"
  }
};

export function getCityCrowdData(cityName) {
  if (!cityName) cityName = 'Delhi';
  const cleanCity = cityName.trim();

  const matchedKey = Object.keys(CITY_CROWD_REGISTRY).find(
    key => key.toLowerCase() === cleanCity.toLowerCase()
  );

  if (matchedKey) {
    return CITY_CROWD_REGISTRY[matchedKey];
  }

  return {
    primary: `${cleanCity} Central Landmark`,
    alternate: `${cleanCity} Heritage & Eco Corridor`,
    distance: "3.0 km",
    saturation: "88%",
    primaryQueue: "~30m Queue",
    altQueue: "< 5m Instant Entry",
    perk: "Complimentary Heritage Map & 15% Partner Rebate",
    primaryImg: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    altImg: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600"
  };
}

const CITY_REROUTE_CONFIG = CITY_CROWD_REGISTRY;
const CITY_REROUTE_DATA = CITY_CROWD_REGISTRY;

function getCouponForMonument(monumentName, currentCity = 'Delhi') {
  const cityConfig = getCityCrowdData(currentCity);

  if (monumentName && COUPON_MAP[monumentName]) {
    const coupon = COUPON_MAP[monumentName];
    return {
      monumentName,
      couponInfo: {
        ...coupon,
        saturation: cityConfig.saturation,
        queue: cityConfig.primaryQueue,
        altQueue: cityConfig.altQueue,
        distKm: coupon.distKm || parseFloat(cityConfig.distance) || 3.0
      }
    };
  }

  if (monumentName) {
    const matchedKey = Object.keys(COUPON_MAP).find(key =>
      monumentName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(monumentName.toLowerCase())
    );
    if (matchedKey) {
      const coupon = COUPON_MAP[matchedKey];
      return {
        monumentName: matchedKey,
        couponInfo: {
          ...coupon,
          saturation: cityConfig.saturation,
          queue: cityConfig.primaryQueue,
          altQueue: cityConfig.altQueue,
          distKm: coupon.distKm || parseFloat(cityConfig.distance) || 3.0
        }
      };
    }
  }

  return {
    monumentName: cityConfig.primary,
    couponInfo: {
      code: "HERITAGEDELHI",
      discount: 20,
      alt: cityConfig.alternate,
      distKm: parseFloat(cityConfig.distance) || 3.4,
      perk: cityConfig.perk,
      businessName: "Heritage Audio & Priority Pass",
      saturation: cityConfig.saturation,
      queue: cityConfig.primaryQueue,
      altQueue: cityConfig.altQueue
    }
  };
}

// ─── City Destination Hub Component (Rich Initial State) ──────────────────────

function CityDestinationHub({ selectedCity, onQuickStart, liveWeather }) {
  const cityData = CITY_HERO_DATA[selectedCity] || CITY_HERO_DATA['Jaipur'];
  const weatherText = liveWeather ? `${liveWeather.temperature}°C · ${liveWeather.condition}` : cityData.weather;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* ── 1. Dynamic City Hero & Visual Showcase ─────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group">
        <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
          <img
            src={cityData.image}
            alt={cityData.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
            <span className="bg-white/95 text-slate-800 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 backdrop-blur-md">
              <Sun size={13} className="text-amber-500" /> {weatherText}
            </span>
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {selectedCity}: Live Telemetry Connected
            </span>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest">{cityData.state} · {cityData.bestTime}</div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{cityData.title}</h2>
            <p className="text-xs text-slate-200 leading-relaxed font-medium max-w-xl">{cityData.tagline}</p>
          </div>
        </div>
      </div>

      {/* ── 4. Quick-Start Action Chips ────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Zap size={14} className="text-emerald-700" /> Quick-Start Presets
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => onQuickStart(1, 4000, ['Heritage'])}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
              1-Day Heritage Express <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-700" />
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">1 Day · Heritage · ₹4,000</div>
          </button>

          <button
            onClick={() => onQuickStart(3, 10000, ['Heritage', 'Food'])}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
              Eco-Cultural Trail <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-700" />
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">3 Days · Heritage & Food · ₹10,000</div>
          </button>

          <button
            onClick={() => onQuickStart(2, 5000, ['Nature', 'Food'])}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
              Budget Explorer <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-700" />
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">2 Days · Nature & Food · ₹5,000</div>
          </button>
        </div>
      </div>

      {/* ── 2. Live Monument Quick-Preview Grid ────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark size={14} className="text-emerald-700" /> Live Monument Capacity & Queue Preview
          </h3>
          <span className="text-[10px] font-semibold text-slate-500">{selectedCity} Perimeter</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {cityData.monuments.map((mon, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-xs hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              <div className="relative h-24 rounded-lg overflow-hidden bg-slate-100">
                <img src={mon.img} alt={mon.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-xs ${
                  mon.status === 'RED'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : mon.status === 'YELLOW'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {mon.load}% Load
                </span>
              </div>

              <div>
                <div className="font-bold text-slate-900 text-xs truncate">{mon.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-semibold">
                  <Clock size={11} className="text-emerald-700 shrink-0" />
                  {mon.queue}
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                <div
                  className={`h-1.5 rounded-full ${
                    mon.status === 'RED' ? 'bg-red-700' : mon.status === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-700'
                  }`}
                  style={{ width: `${mon.load}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Animated "How Dynamic Rerouting Works" 3-Step Flow ───── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-700" /> Dynamic AI Rerouting Protocol
        </h3>

        <div className="grid md:grid-cols-3 gap-4 relative">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <div className="font-bold text-slate-900 text-xs">Set Trip Constraints</div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Choose your city, budget, trip duration, and travel interests.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <div className="font-bold text-slate-900 text-xs">AI Crowd Balancing</div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Edge Computer Vision cameras detect real-time bottleneck spikes at primary sites.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <div className="font-bold text-slate-900 text-xs">Earn Green Passes</div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Accept recommended alternate sites to unlock 20% ticket discounts & partner perks.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function BudgetMeter({ breakdown, total, budget }) {
  const spent = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const remaining = Math.max(budget - spent, 0);

  const segments = [
    { label: 'Accommodations', value: breakdown.accommodation, color: 'bg-emerald-700', textColor: 'text-emerald-800' },
    { label: 'Hospitality',    value: breakdown.food,          color: 'bg-teal-600',    textColor: 'text-teal-800' },
    { label: 'Transit Corridor', value: breakdown.transport,  color: 'bg-amber-500',   textColor: 'text-amber-800' },
    { label: 'Monument Entry', value: breakdown.activities,   color: 'bg-slate-700',   textColor: 'text-slate-800' },
  ].filter(s => s.value > 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp size={15} className="text-emerald-700" />
          Estimated Expenditure & Carbon Impact Breakdown
        </h3>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 font-semibold">Estimated Allocation</span>
          <div className="text-xs font-bold text-slate-900 font-mono">₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`h-full ${seg.color} transition-all duration-700`}
            style={{ width: `${(seg.value / budget) * 100}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="text-center bg-slate-50 rounded-lg p-2 border border-slate-200">
            <div className={`text-xs font-bold font-mono ${seg.textColor}`}>₹{seg.value.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-500 font-semibold">{seg.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3 font-semibold">
        <span className="text-slate-600 flex items-center gap-1.5">
          <Leaf size={14} className="text-emerald-700" /> Sustainable Impact: 14.2 kg CO₂ Saved via Reroute
        </span>
        <span className={remaining > 0 ? 'text-emerald-800 font-bold font-mono' : 'text-red-700 font-bold font-mono'}>
          Unallocated Cushion: ₹{remaining.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}

function CrowdStatusBadge({ placeName, globalMonuments, fallbackStatus = 'GREEN' }) {
  const live = globalMonuments?.find(m =>
    m.name?.toLowerCase().includes(placeName?.toLowerCase()) ||
    placeName?.toLowerCase().includes(m.name?.toLowerCase().split(' ')[0])
  );
  const status = live?.status || fallbackStatus;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.GREEN;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {placeName} — {cfg.label}
    </span>
  );
}

function PlaceCard({ index, place, globalMonuments, onRedAlert }) {
  const live = globalMonuments?.find(m =>
    m.name?.toLowerCase().includes(place.placeName?.toLowerCase()) ||
    place.placeName?.toLowerCase().includes(m.name?.toLowerCase().split(' ')[0])
  );
  const liveStatus = live?.status || place.crowdStatus || 'GREEN';

  useEffect(() => {
    if (liveStatus === 'RED' && !place.isAlternative && COUPON_MAP[place.placeName]) {
      onRedAlert?.(place.placeName, liveStatus);
    }
  }, [liveStatus]);

  return (
    <div className={`p-5 space-y-3 rounded-xl border transition-all ${place.isAlternative ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-white shadow-xs'} relative overflow-hidden`}>
      {place.isAlternative && (
        <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-lg font-mono">
          RECOMMENDED ALTERNATE CORRIDOR
        </div>
      )}
      {/* 16:9 Thumbnail Image Preview */}
      <div className="relative overflow-hidden rounded-xl bg-slate-100 h-44 w-full">
        <img
          src={PLACE_IMAGES[place.placeName] || place.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80'}
          alt={place.placeName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm leading-tight">{place.placeName}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-semibold border border-slate-200">{place.category}</span>
              <CrowdStatusBadge placeName={place.placeName} globalMonuments={globalMonuments} fallbackStatus={place.crowdStatus} />
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-slate-900 font-mono">
            {place.estimatedCost > 0 ? `₹${place.estimatedCost.toLocaleString('en-IN')}` : 'Complimentary'}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">entry fee</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
        <Clock size={13} className="text-emerald-700 shrink-0" />
        {place.timeSlot}
      </div>

      {place.practicalTip && (
        <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Info size={13} className="text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{place.practicalTip}</p>
        </div>
      )}

      {liveStatus === 'RED' && !place.isAlternative && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-700 shrink-0" />
            <span className="text-xs text-red-800 font-bold">{place.placeName} — High Density Capacity Breach (92%)</span>
          </div>
          <button
            onClick={() => onRedAlert?.(place.placeName, liveStatus)}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            Accept Reroute & Claim Perks
          </button>
        </div>
      )}
    </div>
  );
}

function DayAccordion({ dayData, globalMonuments, isOpen, onToggle, onRedAlert }) {
  const totalCost = dayData.places.reduce((s, p) => s + p.estimatedCost, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100/70 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center font-mono">
            D{dayData.day}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Day {dayData.day}: {dayData.theme}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">
              {dayData.places.length} stops · Est. Entry Allocation: ₹{totalCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 bg-white border-t border-slate-200">
          {dayData.places.map((place, idx) => (
            <PlaceCard
              key={idx}
              index={idx}
              place={place}
              globalMonuments={globalMonuments}
              onRedAlert={onRedAlert}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reroute Modal ───────────────────────────────────────────────────────────

function RerouteModal({ isOpen, onClose, target, onAccept, loading, currentCity, selectedCity: propCity }) {
  if (!isOpen) return null;
  const activeCity = propCity || currentCity || 'Delhi';
  const cityData = getCityCrowdData(activeCity);

  const targetNameMatchesCity = target?.monumentName && target.monumentName.toLowerCase().includes(activeCity.toLowerCase());

  const primaryTitle = (target?.monumentName && targetNameMatchesCity)
    ? target.monumentName
    : cityData.primary;

  const alternateTitle = (target?.couponInfo?.alt && targetNameMatchesCity)
    ? target.couponInfo.alt
    : cityData.alternate;

  const rawDist = target?.couponInfo?.distKm ? `${target.couponInfo.distKm} km` : cityData.distance;
  const distanceText = rawDist.includes("from") ? rawDist : `${rawDist} from ${primaryTitle}`;

  const saturationText = (target?.couponInfo?.saturation && targetNameMatchesCity)
    ? target.couponInfo.saturation
    : cityData.saturation;

  const queueText = (target?.couponInfo?.queue && targetNameMatchesCity)
    ? target.couponInfo.queue
    : cityData.primaryQueue;

  const altQueueText = (target?.couponInfo?.altQueue && targetNameMatchesCity)
    ? target.couponInfo.altQueue
    : cityData.altQueue;

  const perkText = (target?.couponInfo?.perk && targetNameMatchesCity)
    ? target.couponInfo.perk
    : cityData.perk;

  const primaryImg = (target?.monumentName && targetNameMatchesCity)
    ? (PLACE_IMAGES[target.monumentName] || cityData.primaryImg)
    : cityData.primaryImg;

  const altImg = (target?.couponInfo?.alt && targetNameMatchesCity)
    ? (PLACE_IMAGES[target.couponInfo.alt] || cityData.altImg)
    : cityData.altImg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border border-red-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Crowd Density Reroute Recommendation</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
            <div className="font-bold text-red-800 text-sm">
              Notice: {primaryTitle} has reached {saturationText} capacity limit.
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Load-balancing incentives are active. Diversion is advised to avoid security delays and long queues.
            </p>
          </div>

          {/* Side-by-side visual photo comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-100 rounded-xl overflow-hidden border border-red-200 space-y-1 p-2">
              <div className="relative h-24 w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src={primaryImg}
                  alt={primaryTitle}
                  className="w-full h-full object-cover opacity-80"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="absolute top-1 left-1 bg-red-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                  {saturationText} SATURATED
                </span>
              </div>
              <div className="font-bold text-[11px] text-slate-900 truncate">{primaryTitle}</div>
              <div className="text-[10px] text-red-700 font-bold font-mono">{queueText}</div>
            </div>

            <div className="bg-emerald-50 rounded-xl overflow-hidden border border-emerald-300 space-y-1 p-2">
              <div className="relative h-24 w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src={altImg}
                  alt={alternateTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                  RECOMMENDED
                </span>
              </div>
              <div className="font-bold text-[11px] text-emerald-900 truncate">{alternateTitle}</div>
              <div className="text-[10px] text-emerald-800 font-bold font-mono">{altQueueText}</div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-700" /> Recommended Alternate Site
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {distanceText}
              </span>
            </div>

            <div className="text-lg font-bold text-slate-900">{alternateTitle}</div>

            <div className="bg-white border border-emerald-200 rounded-lg p-3 text-xs space-y-1">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Tag size={13} /> {target?.couponInfo?.discount || 20}% Entry Discount + Partner Hospitality Perk
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">{target?.couponInfo?.perk || "Complimentary Audio Guide & Instant Priority Transit Pass"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all"
            >
              Keep Original Route
            </button>
            <button
              onClick={onAccept}
              disabled={loading}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <><CheckCircle size={14} /> Accept Reroute & Claim Perks</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Official ASI / Municipal Digital Pass Modal ──────────────────────────────

function VoucherModal({ isOpen, onClose, voucher, couponInfo }) {
  const { latestRedemption } = useSocket();
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(1800);
    setIsExpired(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !couponInfo) return null;

  const isRedeemed = latestRedemption && latestRedemption.code === couponInfo.code;
  const passSerial = voucher?.voucherId || `ASI-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`;

  const qrValue = JSON.stringify({
    passId: passSerial,
    code: couponInfo.code,
    discount: couponInfo.discount,
    monument: couponInfo.alt,
    business: couponInfo.businessName,
    issuedAt: new Date().toISOString(),
  });

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = (timeLeft / 1800) * 100;

  const handleTest10s = () => {
    setIsExpired(false);
    setTimeLeft(10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Official ASI / Municipal Header */}
        <div className="bg-slate-900 px-6 py-4 text-center text-white border-b border-slate-800">
          <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            ARCHAEOLOGICAL SURVEY OF INDIA & MUNICIPAL BOARD
          </div>
          <div className="font-extrabold text-white text-base tracking-tight flex items-center justify-center gap-2 mt-0.5">
            <Award size={18} className="text-emerald-400" /> Digital Tourism Verification Pass
          </div>
          <div className="text-slate-400 text-[11px] font-mono mt-0.5">SERIAL NO: {passSerial}</div>
        </div>

        <div className="p-6 space-y-4">
          {!isExpired ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-700" />
                  Transit Window: <span className="font-mono text-emerald-900 font-bold">{formatTime(timeLeft)} mins</span>
                </span>
                <button
                  onClick={handleTest10s}
                  className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full hover:bg-emerald-200 transition-colors font-bold"
                >
                  10s Test Expiration
                </button>
              </div>
              <div className="w-full bg-emerald-200/70 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-700 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 text-center font-medium">
                Present this official QR code at municipal gate scanners or partner entry points.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center space-y-1">
              <div className="text-red-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 font-mono">
                <AlertTriangle size={15} className="shrink-0" />
                PASS EXPIRED — Transit Window Closed
              </div>
              <p className="text-[11px] text-slate-600">
                This municipal pass has expired. Please generate a new itinerary or purchase standard tickets.
              </p>
            </div>
          )}

          <div className="flex justify-center relative">
            <div className={`bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs transition-all ${isExpired ? 'blur-sm opacity-30 pointer-events-none' : ''}`}>
              <QRCode
                value={qrValue}
                size={140}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox="0 0 256 256"
                level="M"
              />
            </div>
            {isExpired && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-md uppercase tracking-wider font-mono">
                  Pass Expired
                </span>
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <div className={`font-mono font-bold text-2xl tracking-widest ${isExpired ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {couponInfo.code}
            </div>
            <div className={`font-bold text-sm ${isExpired ? 'text-slate-400' : 'text-emerald-800'}`}>
              {isExpired ? 'Offer Expired' : `${couponInfo.discount}% Entry Discount + Partner Hospitality Perk`}
            </div>
          </div>

          {isRedeemed && !isExpired && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-center">
              <div className="text-emerald-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 font-mono">
                <CheckCircle size={16} className="text-emerald-700 shrink-0" />
                VERIFIED AT ENTRY GATE — Welcome to {latestRedemption.monumentName || couponInfo.alt}
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500 font-medium">Target Monument</span>
              <span className="font-bold">{couponInfo.alt}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="text-slate-500 font-medium">Incentive Benefit</span>
              <span className={`font-bold ${isExpired ? 'line-through text-slate-400' : 'text-emerald-800'}`}>
                {couponInfo.discount}% Off Entry
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <span className="text-slate-600 font-medium">{couponInfo.perk}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => window.print()}
              disabled={isExpired}
              className={`flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Printer size={14} /> Print Pass
            </button>
            <button onClick={onClose} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2">
              <CheckCircle size={14} /> Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TouristPlanner() {
  const { selectedCity, monuments: globalMonuments, activeAlert, dismissAlert, switchCity } = useSocket();

  const [destination,  setDestination]  = useState(selectedCity || 'Jaipur');
  const [budget,       setBudget]       = useState(10000);
  const [tripDays,     setTripDays]     = useState(3);
  const [interests,    setInterests]    = useState(['Heritage']);

  const [liveWeather,  setLiveWeather]  = useState(null);

  const [itinerary,    setItinerary]    = useState(null);
  const [generating,   setGenerating]   = useState(false);
  const [genError,     setGenError]     = useState(null);
  const [openDays,     setOpenDays]     = useState([1]);

  const [rerouteTarget, setRerouteTarget]   = useState(null);
  const [showReroute,   setShowReroute]     = useState(false);
  const [rerouting,     setRerouting]       = useState(false);

  const [voucher,       setVoucher]     = useState(null);
  const [voucherCoupon, setVoucherCoupon] = useState(null);
  const [showVoucher,   setShowVoucher] = useState(false);

  const [alertBanner,  setAlertBanner]  = useState(null);
  const alertedMonuments = useRef(new Set());

  useEffect(() => {
    setDestination(selectedCity || 'Jaipur');
  }, [selectedCity]);

  // Fetch Live Weather from Backend API
  useEffect(() => {
    let isMounted = true;
    async function getWeather() {
      try {
        const res = await fetch(`${API_BASE}/api/weather?city=${destination}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            setLiveWeather(json.data);
          }
        }
      } catch (e) {}
    }
    getWeather();
    return () => { isMounted = false; };
  }, [destination]);

  useEffect(() => {
    if (!activeAlert) return;

    const name = activeAlert.crowdedSpot?.name;
    if (alertedMonuments.current.has(name)) return;

    const { monumentName: resolvedName, couponInfo } = getCouponForMonument(name, destination);
    if (name) alertedMonuments.current.add(name);
    alertedMonuments.current.add(resolvedName);
    setAlertBanner({ name: resolvedName, loadPercent: activeAlert.crowdedSpot?.loadPercent || 92, couponInfo });
    setRerouteTarget({ monumentName: resolvedName, couponInfo });
    setShowReroute(true);
  }, [activeAlert, destination]);

  const handleRedAlert = useCallback((monumentName) => {
    if (alertedMonuments.current.has(monumentName)) return;
    const { monumentName: resolvedName, couponInfo } = getCouponForMonument(monumentName, destination);
    if (monumentName) alertedMonuments.current.add(monumentName);
    alertedMonuments.current.add(resolvedName);
    setAlertBanner({ name: resolvedName, loadPercent: 92, couponInfo });
    setRerouteTarget({ monumentName: resolvedName, couponInfo });
    setShowReroute(true);
  }, [destination]);

  const generateItinerary = async (overrideDays, overrideBudget, overrideInterests) => {
    setGenerating(true);
    setGenError(null);
    setItinerary(null);
    setOpenDays([1]);
    alertedMonuments.current.clear();
    setAlertBanner(null);

    const useDays = overrideDays || tripDays;
    const useBudget = overrideBudget || budget;
    const useInterests = overrideInterests || interests;

    try {
      const res = await fetch(`${API_BASE}/api/itinerary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: destination, destination, budget: useBudget, days: useDays, interests: useInterests }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      if (json.success) {
        const data = json.data;
        const enriched = {
          ...data,
          schedule: data.aiEnrichedSchedule || data.schedule,
          cityOverview: data.cityOverview,
        };
        setItinerary(enriched);
      } else {
        throw new Error(json.message || 'Generation failed');
      }
    } catch (err) {
      console.warn('API call failed, using local fallback:', err.message);
      const fallback = buildFallbackItinerary(destination, useBudget, useDays, useInterests);
      setItinerary(fallback);
    } finally {
      setGenerating(false);
    }
  };

  const handleQuickStart = (days, budgetVal, interestArr) => {
    setTripDays(days);
    setBudget(budgetVal);
    setInterests(interestArr);
    generateItinerary(days, budgetVal, interestArr);
  };

  const acceptReroute = async () => {
    if (!rerouteTarget) return;
    setRerouting(true);

    const { monumentName, couponInfo } = rerouteTarget;

    setItinerary(prev => {
      if (!prev) return prev;
      const newSchedule = prev.schedule.map(day => ({
        ...day,
        places: day.places.map(place => {
          const matches =
            place.placeName?.toLowerCase().includes(monumentName.toLowerCase()) ||
            monumentName.toLowerCase().includes(place.placeName?.toLowerCase().split(' ')[0]);
          if (matches && !place.isAlternative) {
            return {
              ...place,
              placeName:     couponInfo.alt,
              crowdStatus:   'GREEN',
              isAlternative: true,
              practicalTip:  `Crowd-diverted alternative — ${couponInfo.distKm} km from ${monumentName}. ${couponInfo.perk}`,
              category:      place.category,
            };
          }
          return place;
        })
      }));
      return { ...prev, schedule: newSchedule, isRerouted: true };
    });

    let voucherData = null;
    try {
      const claimRes = await fetch(`${API_BASE}/api/coupons/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInfo.code, touristName: 'Tourist' }),
      });
      const claimJson = await claimRes.json();
      if (claimJson.success) voucherData = claimJson.voucher;
    } catch (e) {
      console.warn('Backend claim:', e.message);
    }

    setShowReroute(false);
    setRerouting(false);
    setVoucher(voucherData || { voucherId: `V-${Date.now()}`, code: couponInfo.code });
    setVoucherCoupon(couponInfo);
    setTimeout(() => setShowVoucher(true), 400);
  };

  const toggleInterest = (id) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleDay = (day) => {
    setOpenDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, d]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900">

      {/* ── Top Alert Banner (Exact Specification) ────────────────────── */}
      {alertBanner && (
        <div className="sticky top-16 z-30 w-full px-4 py-3 bg-red-50 border-b border-red-200 text-slate-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <AlertTriangle size={18} className="text-red-700 shrink-0" />
              <span className="text-slate-900 text-xs sm:text-sm font-bold truncate font-mono">
                Notice: {alertBanner.name} has reached {alertBanner.loadPercent || 92}% capacity. Load-balancing incentives active.
              </span>
              <button
                onClick={() => { setShowReroute(true); }}
                className="shrink-0 bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                View Recommended Alternate Site
              </button>
            </div>
            <button
              onClick={() => { setAlertBanner(null); dismissAlert(); }}
              className="text-slate-400 hover:text-slate-700 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Page Title Header ────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="max-w-3xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold font-mono">
              <Sparkles size={13} className="text-emerald-700" /> DYNAMIC ITINERARY MANAGEMENT PROTOCOL
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Smart Tourism Itinerary & Crowd Diversion Planner
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Generate sustainable, crowd-balanced travel schedules with live capacity reroutes, alternative heritage recommendations, and entry discounts.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT: Trip Builder ──────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Destination */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={15} className="text-emerald-700" /> Destination City
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => { setDestination(city); switchCity(city); }}
                    disabled={generating}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border
                      ${destination === city
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      } disabled:opacity-50`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <IndianRupee size={15} className="text-emerald-700" /> Total Budget
                </h2>
                <span className="text-sm font-black text-slate-900 font-mono">₹{budget.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={50000}
                step={1000}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                disabled={generating}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold font-mono">
                <span>₹2,000</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={15} className="text-emerald-700" /> Trip Duration
              </h2>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map(days => (
                  <button
                    key={days}
                    onClick={() => setTripDays(days)}
                    disabled={generating}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border font-mono
                      ${tripDays === days
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Tags */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Tag size={15} className="text-emerald-700" /> Travel Interests
              </h2>
              <div className="space-y-1.5">
                {INTEREST_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id)}
                    disabled={generating}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left
                      ${interests.includes(id)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    <Icon size={14} className="text-emerald-700 shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={() => generateItinerary()}
              disabled={generating}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <><Loader2 size={16} className="animate-spin" /> Generating Schedule…</>
              ) : (
                <><Sparkles size={16} /> Generate Smart Itinerary</>
              )}
            </button>

            {genError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle size={14} /> {genError}
              </div>
            )}

            {/* Budget Overview card */}
            {itinerary?.budgetBreakdown && (
              <BudgetMeter
                breakdown={itinerary.budgetBreakdown}
                total={itinerary.totalEstimatedCost}
                budget={budget}
              />
            )}
          </div>

          {/* ── RIGHT: Itinerary Display / Rich City Destination Hub ──────── */}
          <div className="lg:col-span-2 space-y-4">

            {!itinerary && !generating && (
              <CityDestinationHub
                selectedCity={destination}
                onQuickStart={handleQuickStart}
                liveWeather={liveWeather}
              />
            )}

            {generating && (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
                <Loader2 size={40} className="text-emerald-700 animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Generating Optimal Schedule…</h3>
                <p className="text-xs text-slate-500">Evaluating crowd densities and load-balancing parameters for {destination}.</p>
              </div>
            )}

            {itinerary && (
              <>
                {/* Header Summary */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-700" />
                      {itinerary.destination} — {itinerary.days}-Day Itinerary
                    </h2>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                      ✓ Crowd Balanced
                    </span>
                  </div>
                  {itinerary.cityOverview && (
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{itinerary.cityOverview}</p>
                  )}
                </div>

                {/* Day Accordions */}
                <div className="space-y-3">
                  {itinerary.schedule.map((dayData) => (
                    <DayAccordion
                      key={dayData.day}
                      dayData={dayData}
                      globalMonuments={globalMonuments}
                      isOpen={openDays.includes(dayData.day)}
                      onToggle={() => toggleDay(dayData.day)}
                      onRedAlert={handleRedAlert}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reroute Modal */}
      <RerouteModal
        isOpen={showReroute}
        onClose={() => setShowReroute(false)}
        target={rerouteTarget}
        onAccept={acceptReroute}
        loading={rerouting}
        currentCity={destination}
      />

      {/* Voucher Pass Modal */}
      <VoucherModal
        isOpen={showVoucher}
        onClose={() => setShowVoucher(false)}
        voucher={voucher}
        couponInfo={voucherCoupon}
      />
    </div>
  );
}
