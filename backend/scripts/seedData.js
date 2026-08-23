require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Monument = require('../models/Monument');
const Coupon = require('../models/Coupon');

// ─── MONUMENTS DATA ──────────────────────────────────────────────────────────

const monuments = [
  // ── JAIPUR ────────────────────────────────────────────────────────────────
  {
    name: 'Amber Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    coordinates: { lat: 26.9855, lng: 75.8513 },
    maxCapacity: 1000,
    currentCount: 920,
    status: 'RED',
    ticketPrice: { adult: 100, child: 10, foreigner: 500 },
    visitingHours: { open: '08:00', close: '17:30' },
    alternativeSpot: {
      name: 'Jaigarh Fort',
      category: 'Heritage',
      coordinates: { lat: 26.9917, lng: 75.8458 },
      incentiveDescription: '20% off entry + free heritage tea at the fort café',
      distanceKm: 1.2
    }
  },
  {
    name: 'Jaigarh Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    coordinates: { lat: 26.9917, lng: 75.8458 },
    maxCapacity: 800,
    currentCount: 210,
    status: 'GREEN',
    ticketPrice: { adult: 85, child: 20, foreigner: 200 },
    visitingHours: { open: '09:00', close: '17:00' }
  },
  {
    name: 'Hawa Mahal',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    coordinates: { lat: 26.9239, lng: 75.8267 },
    maxCapacity: 600,
    currentCount: 310,
    status: 'GREEN',
    ticketPrice: { adult: 50, child: 10, foreigner: 200 },
    visitingHours: { open: '09:00', close: '17:00' }
  },
  {
    name: 'City Palace Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    coordinates: { lat: 26.9258, lng: 75.8237 },
    maxCapacity: 900,
    currentCount: 680,
    status: 'YELLOW',
    ticketPrice: { adult: 200, child: 50, foreigner: 700 },
    visitingHours: { open: '09:30', close: '17:00' }
  },
  {
    name: 'Nahargarh Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    coordinates: { lat: 26.9394, lng: 75.8042 },
    maxCapacity: 750,
    currentCount: 290,
    status: 'GREEN',
    ticketPrice: { adult: 50, child: 20, foreigner: 200 },
    visitingHours: { open: '10:00', close: '17:30' }
  },

  // ── AGRA ──────────────────────────────────────────────────────────────────
  {
    name: 'Taj Mahal',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    maxCapacity: 2500,
    currentCount: 2400,
    status: 'RED',
    ticketPrice: { adult: 50, child: 0, foreigner: 1100 },
    visitingHours: { open: '06:00', close: '18:30' },
    alternativeSpot: {
      name: 'Mehtab Bagh',
      category: 'Nature',
      coordinates: { lat: 27.1826, lng: 78.0361 },
      incentiveDescription: '25% off sunset viewing + complimentary river view pass',
      distanceKm: 3.5
    }
  },
  {
    name: 'Mehtab Bagh',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Nature',
    coordinates: { lat: 27.1826, lng: 78.0361 },
    maxCapacity: 1200,
    currentCount: 340,
    status: 'GREEN',
    ticketPrice: { adult: 30, child: 0, foreigner: 300 },
    visitingHours: { open: '06:00', close: '18:00' }
  },
  {
    name: 'Agra Fort',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    coordinates: { lat: 27.1795, lng: 78.0211 },
    maxCapacity: 1800,
    currentCount: 1100,
    status: 'YELLOW',
    ticketPrice: { adult: 40, child: 0, foreigner: 600 },
    visitingHours: { open: '06:00', close: '18:00' }
  },

  // ── VARANASI ──────────────────────────────────────────────────────────────
  {
    name: 'Dashashwamedh Ghat',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Religious',
    coordinates: { lat: 25.3075, lng: 83.0107 },
    maxCapacity: 3000,
    currentCount: 2850,
    status: 'RED',
    ticketPrice: { adult: 0, child: 0, foreigner: 0 },
    visitingHours: { open: '05:00', close: '22:00' },
    alternativeSpot: {
      name: 'Assi Ghat',
      category: 'Religious',
      coordinates: { lat: 25.2855, lng: 83.0132 },
      incentiveDescription: '15% off morning boat tour + complimentary chai voucher',
      distanceKm: 2.1
    }
  },
  {
    name: 'Assi Ghat',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Religious',
    coordinates: { lat: 25.2855, lng: 83.0132 },
    maxCapacity: 2000,
    currentCount: 800,
    status: 'GREEN',
    ticketPrice: { adult: 0, child: 0, foreigner: 0 },
    visitingHours: { open: '04:30', close: '22:00' }
  },
  {
    name: 'Sarnath Archaeological Site',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    coordinates: { lat: 25.3810, lng: 83.0229 },
    maxCapacity: 1500,
    currentCount: 350,
    status: 'GREEN',
    ticketPrice: { adult: 30, child: 0, foreigner: 500 },
    visitingHours: { open: '09:00', close: '17:00' }
  },

  // ── GOA ───────────────────────────────────────────────────────────────────
  {
    name: 'Baga Beach',
    city: 'Goa',
    state: 'Goa',
    category: 'Beach',
    coordinates: { lat: 15.5522, lng: 73.7519 },
    maxCapacity: 2000,
    currentCount: 1950,
    status: 'RED',
    ticketPrice: { adult: 0, child: 0, foreigner: 0 },
    visitingHours: { open: '06:00', close: '22:00' },
    alternativeSpot: {
      name: 'Morjim Beach',
      category: 'Beach',
      coordinates: { lat: 15.6347, lng: 73.7326 },
      incentiveDescription: 'Free welcome drink at Morjim Shack on arrival',
      distanceKm: 14.0
    }
  },
  {
    name: 'Morjim Beach',
    city: 'Goa',
    state: 'Goa',
    category: 'Beach',
    coordinates: { lat: 15.6347, lng: 73.7326 },
    maxCapacity: 1500,
    currentCount: 420,
    status: 'GREEN',
    ticketPrice: { adult: 0, child: 0, foreigner: 0 },
    visitingHours: { open: '06:00', close: '21:00' }
  },
  {
    name: 'Aguada Fort',
    city: 'Goa',
    state: 'Goa',
    category: 'Heritage',
    coordinates: { lat: 15.5012, lng: 73.7727 },
    maxCapacity: 1000,
    currentCount: 550,
    status: 'GREEN',
    ticketPrice: { adult: 0, child: 0, foreigner: 100 },
    visitingHours: { open: '09:30', close: '18:00' }
  },

  // ── DELHI ─────────────────────────────────────────────────────────────────
  {
    name: 'India Gate',
    city: 'Delhi',
    state: 'Delhi',
    category: 'Heritage',
    coordinates: { lat: 28.6129, lng: 77.2295 },
    maxCapacity: 4000,
    currentCount: 3700,
    status: 'RED',
    ticketPrice: { adult: 0, child: 0, foreigner: 0 },
    visitingHours: { open: '00:00', close: '23:59' },
    alternativeSpot: {
      name: "Humayun's Tomb",
      category: 'Heritage',
      coordinates: { lat: 28.5933, lng: 77.2507 },
      incentiveDescription: '20% off entry fee + complimentary museum audio guide',
      distanceKm: 4.8
    }
  },
  {
    name: "Humayun's Tomb",
    city: 'Delhi',
    state: 'Delhi',
    category: 'Heritage',
    coordinates: { lat: 28.5933, lng: 77.2507 },
    maxCapacity: 2000,
    currentCount: 600,
    status: 'GREEN',
    ticketPrice: { adult: 35, child: 0, foreigner: 550 },
    visitingHours: { open: '06:00', close: '18:00' }
  },
  {
    name: 'Qutub Minar',
    city: 'Delhi',
    state: 'Delhi',
    category: 'Heritage',
    coordinates: { lat: 28.5245, lng: 77.1855 },
    maxCapacity: 1800,
    currentCount: 950,
    status: 'GREEN',
    ticketPrice: { adult: 35, child: 0, foreigner: 550 },
    visitingHours: { open: '07:00', close: '17:00' }
  }
];

// ─── COUPONS DATA ────────────────────────────────────────────────────────────

const coupons = [
  {
    code: 'JAIGARH20',
    city: 'Jaipur',
    targetMonument: 'Jaigarh Fort',
    discountPercent: 20,
    partnerPerk: 'Free heritage tea + 20% off entry at Jaigarh Fort',
    businessName: 'Rajputana Heritage Café',
    businessCategory: 'Cafe',
    isActive: true,
    expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'MEHTAB25',
    city: 'Agra',
    targetMonument: 'Mehtab Bagh',
    discountPercent: 25,
    partnerPerk: '25% off sunset viewing + river view pass at Mehtab Bagh',
    businessName: 'Yamuna Riverside Tours',
    businessCategory: 'Guide',
    isActive: true,
    expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'ASSIGHAT15',
    city: 'Varanasi',
    targetMonument: 'Assi Ghat',
    discountPercent: 15,
    partnerPerk: '15% off morning boat tour + free chai voucher at Assi Ghat',
    businessName: 'Kashi Boat Services',
    businessCategory: 'Transport',
    isActive: true,
    expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'MORJIMPERK',
    city: 'Goa',
    targetMonument: 'Morjim Beach',
    discountPercent: 10,
    partnerPerk: 'Free welcome drink at Morjim Shack on arrival',
    businessName: 'Morjim Shack & Bar',
    businessCategory: 'Restaurant',
    isActive: true,
    expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'HERITAGEDELHI',
    city: 'Delhi',
    targetMonument: "Humayun's Tomb",
    discountPercent: 20,
    partnerPerk: "20% off entry + complimentary museum audio guide at Humayun's Tomb",
    businessName: 'Delhi Heritage Audio Guides',
    businessCategory: 'Guide',
    isActive: true,
    expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

// ─── SEED FUNCTION ───────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected: ${mongoose.connection.host}`);

    // Clear existing data
    console.log('\n🗑️  Clearing existing collections...');
    await Monument.deleteMany({});
    console.log('   → Monuments cleared');
    await Coupon.deleteMany({});
    console.log('   → Coupons cleared');

    // Seed Monuments
    console.log('\n📍 Seeding monuments...');
    const insertedMonuments = await Monument.insertMany(monuments);
    console.log(`   ✅ ${insertedMonuments.length} monuments inserted across 5 cities`);

    // Log summary by city
    const cities = ['Jaipur', 'Agra', 'Varanasi', 'Goa', 'Delhi'];
    for (const city of cities) {
      const count = insertedMonuments.filter(m => m.city === city).length;
      console.log(`      └─ ${city}: ${count} monuments`);
    }

    // Seed Coupons
    console.log('\n🎟️  Seeding coupons...');
    const insertedCoupons = await Coupon.insertMany(coupons);
    console.log(`   ✅ ${insertedCoupons.length} coupons inserted`);
    insertedCoupons.forEach(c => {
      console.log(`      └─ [${c.code}] → ${c.city} | ${c.targetMonument} | ${c.discountPercent}% off`);
    });

    // Final stats
    const totalMonuments = await Monument.countDocuments();
    const totalCoupons = await Coupon.countDocuments();
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 DATABASE SEEDING COMPLETE');
    console.log(`   Total Monuments : ${totalMonuments}`);
    console.log(`   Total Coupons   : ${totalCoupons}`);

    // RED alert summary
    const redMonuments = await Monument.find({ status: 'RED' }).select('name city currentCount maxCapacity');
    console.log(`\n🔴 RED Status Monuments (${redMonuments.length} overcrowded):`);
    redMonuments.forEach(m => {
      console.log(`   └─ ${m.name} [${m.city}] — ${m.currentCount}/${m.maxCapacity}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

seedDatabase();
