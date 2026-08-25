import { useState, useEffect, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { useSocket } from '../context/SocketContext';
import {
  Hotel, Search, Calendar, Users, SlidersHorizontal, Star,
  MapPin, Leaf, Zap, CheckCircle, ShieldCheck, Tag, X,
  Printer, ArrowRight, Sun, Car, Info, Sparkles, Building, Check, Ticket, Loader2
} from 'lucide-react';

const SEED_HOTELS = [
  {
    id: 'HTL-001',
    name: 'Rajputana Eco Heritage Resort',
    city: 'Jaipur',
    address: 'Amer Road, Kukas, Jaipur',
    distance: '1.2 km from Amber Fort',
    rating: 4.9,
    reviewsCount: 184,
    ecoLevel: 'Eco Platinum Certified',
    crowdZone: 'Low Crowd Zone',
    crowdZoneType: 'LOW',
    pricePerNight: 4200,
    originalPrice: 5200,
    rerouteDiscount: 15,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ecoFeatures: ['Solar Powered', 'Organic Farm Dining', 'EV Charging Station', 'Zero Single-Use Plastic'],
    rooms: [
      { id: 'RM-101', name: 'Standard Heritage Eco Room', price: 4200, desc: 'Garden view with traditional Rajasthani solar cooling' },
      { id: 'RM-102', name: 'Royal Eco Suite', price: 6800, desc: 'Private terrace with rainwater harvesting bath fittings' }
    ]
  },
  {
    id: 'HTL-002',
    name: 'Jaigarh Green Valley Lodge',
    city: 'Jaipur',
    address: 'Near Jaigarh Fort Hills, Jaipur',
    distance: '0.8 km from Jaigarh Fort',
    rating: 4.7,
    reviewsCount: 112,
    ecoLevel: 'Eco Gold Certified',
    crowdZone: 'Low Crowd Zone',
    crowdZoneType: 'LOW',
    pricePerNight: 3100,
    originalPrice: 3800,
    rerouteDiscount: 20,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ecoFeatures: ['Solar Powered', 'Local Craft Furniture', 'Zero Waste Kitchen'],
    rooms: [
      { id: 'RM-201', name: 'Eco Courtyard Room', price: 3100, desc: 'Cool courtyard view with natural terracotta insulation' }
    ]
  },
  {
    id: 'HTL-003',
    name: 'Taj Vista Solar Eco Retreat',
    city: 'Agra',
    address: 'Fatehabad Road, Agra',
    distance: '2.5 km from Taj Mahal',
    rating: 4.8,
    reviewsCount: 240,
    ecoLevel: 'Eco Platinum Certified',
    crowdZone: 'Low Crowd Zone',
    crowdZoneType: 'LOW',
    pricePerNight: 4800,
    originalPrice: 6000,
    rerouteDiscount: 15,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ecoFeatures: ['Solar Powered', '100% Graywater Recycling', 'EV Charging Station', 'Organic Breakfast'],
    rooms: [
      { id: 'RM-301', name: 'Deluxe Taj Garden Eco Room', price: 4800, desc: 'Quiet garden sanctuary with air-purifying indoor plants' }
    ]
  },
  {
    id: 'HTL-004',
    name: 'Mehtab Bagh Riverside Eco Homestay',
    city: 'Agra',
    address: 'Jamuna Bridge Side, Agra',
    distance: '0.5 km from Mehtab Bagh',
    rating: 4.6,
    reviewsCount: 96,
    ecoLevel: 'Eco Gold Certified',
    crowdZone: 'Low Crowd Zone',
    crowdZoneType: 'LOW',
    pricePerNight: 2400,
    originalPrice: 3000,
    rerouteDiscount: 25,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ecoFeatures: ['Solar Water Heating', 'Compost Management', 'Organic Garden'],
    rooms: [
      { id: 'RM-401', name: 'River View Eco Room', price: 2400, desc: 'Peaceful Yamuna view with organic linen bedding' }
    ]
  },
  {
    id: 'HTL-005',
    name: 'Assi Sanctuary Green Heritage',
    city: 'Varanasi',
    address: 'Assi Ghat Road, Varanasi',
    distance: '0.3 km from Assi Ghat',
    rating: 4.9,
    reviewsCount: 310,
    ecoLevel: 'Eco Platinum Certified',
    crowdZone: 'Low Crowd Zone',
    crowdZoneType: 'LOW',
    pricePerNight: 3500,
    originalPrice: 4200,
    rerouteDiscount: 15,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ecoFeatures: ['Solar Powered', 'Zero Plastic Bottle Policy', 'EV E-Rickshaw Transfer', 'Organic Sattvik Kitchen'],
    rooms: [
      { id: 'RM-501', name: 'Ghat Sanctuary Room', price: 3500, desc: 'Serene morning yoga balcony' }
    ]
  }
];

const INITIAL_BOOKINGS = [
  {
    bookingId: 'ECO-HTL-8921',
    hotelName: 'Rajputana Eco Heritage Resort',
    city: 'Jaipur',
    roomName: 'Standard Heritage Eco Room',
    checkIn: '2026-08-25',
    checkOut: '2026-08-27',
    guests: '2 Guests (1 Room)',
    guestName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    evShuttle: true,
    totalPaid: 7340,
    co2SavedKg: 14.2,
    discountCode: 'JAIGARH20',
    bookedAt: '2026-08-23'
  }
];

export default function HotelBooking() {
  const { selectedCity, switchCity } = useSocket();

  const [activeTab, setActiveTab] = useState('EXPLORE');

  const [searchCity, setSearchCity] = useState(selectedCity || 'Jaipur');
  const [checkInDate, setCheckInDate] = useState('2026-08-25');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-27');
  const [guestsCount, setGuestsCount] = useState('2 Guests, 1 Room');
  const [maxPrice, setMaxPrice] = useState(8000);
  const [ecoCertifiedOnly, setEcoCertifiedOnly] = useState(false);
  const [lowCrowdOnly, setLowCrowdOnly] = useState(false);
  const [sortBy, setSortBy] = useState('RECOMMENDED');

  const [liveHotels, setLiveHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [evShuttleAddon, setEvShuttleAddon] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [discountInput, setDiscountInput] = useState('JAIGARH20');
  const [discountApplied, setDiscountApplied] = useState(true);

  const [myBookings, setMyBookings] = useState(INITIAL_BOOKINGS);
  const [passModalBooking, setPassModalBooking] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const handleUpdateSearch = async () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
  };

  // Fetch Live Hotels from Backend API
const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'https://eco-tourism-fhui.onrender.com').replace(/\/$/, '');

  useEffect(() => {
    let isMounted = true;
    async function fetchHotels() {
      setLoadingHotels(true);
      try {
        const params = new URLSearchParams({
          city: searchCity,
          maxPrice: maxPrice.toString(),
          ecoOnly: ecoCertifiedOnly.toString(),
          lowCrowdOnly: lowCrowdOnly.toString(),
          sort: sortBy === 'PRICE_LOW' ? 'price_asc' : sortBy === 'RATING' ? 'rating_desc' : 'recommended'
        });

        const res = await fetch(`${API_BASE}/api/hotels?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            setLiveHotels(json.data);
            setLoadingHotels(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Live API fetch fallback:', e.message);
      }

      // Robust Verified Local Fallback
      if (isMounted) {
        const filtered = SEED_HOTELS.filter(h => {
          if (searchCity && searchCity !== 'ALL' && h.city.toLowerCase() !== searchCity.toLowerCase()) {
            return false;
          }
          if (h.pricePerNight > maxPrice) return false;
          if (ecoCertifiedOnly && !h.ecoLevel.includes('Platinum')) return false;
          if (lowCrowdOnly && h.crowdZoneType !== 'LOW') return false;
          return true;
        }).sort((a, b) => {
          if (sortBy === 'PRICE_LOW') return a.pricePerNight - b.pricePerNight;
          if (sortBy === 'RATING') return b.rating - a.rating;
          return b.rating - a.rating;
        });

        setLiveHotels(filtered);
        setLoadingHotels(false);
      }
    }

    fetchHotels();
    return () => { isMounted = false; };
  }, [searchCity, maxPrice, ecoCertifiedOnly, lowCrowdOnly, sortBy]);

  const handleOpenBooking = (hotel) => {
    setSelectedHotel(hotel);
    setSelectedRoom(hotel.rooms[0]);
    setBookingStep(1);
    setEvShuttleAddon(false);
    setGuestName('Rahul Sharma');
    setGuestPhone('+91 98765 43210');
    setGuestEmail('rahul.sharma@example.com');
  };

  const handleConfirmBooking = () => {
    if (!guestName || !guestPhone) {
      alert('Please enter guest name and phone number.');
      return;
    }

    const nights = 2;
    const baseFare = selectedRoom.price * nights;
    const discountAmt = discountApplied ? Math.round(baseFare * (selectedHotel.rerouteDiscount / 100)) : 0;
    const addonAmt = evShuttleAddon ? 200 : 0;
    const totalPaid = baseFare - discountAmt + addonAmt;
    const co2SavedKg = Math.round((nights * 7.1) * 10) / 10;

    const newBooking = {
      bookingId: `ECO-HTL-${Math.floor(1000 + Math.random() * 9000)}`,
      hotelName: selectedHotel.name,
      city: selectedHotel.city,
      roomName: selectedRoom.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestsCount,
      guestName,
      phone: guestPhone,
      email: guestEmail,
      evShuttle: evShuttleAddon,
      totalPaid,
      co2SavedKg,
      discountCode: discountApplied ? discountInput : '—',
      bookedAt: new Date().toISOString().split('T')[0]
    };

    setMyBookings(prev => [newBooking, ...prev]);
    setSelectedHotel(null);
    setPassModalBooking(newBooking);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {isFlashing && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-[2px] z-[9999] pointer-events-none transition-opacity duration-200" />
      )}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Header & Navigation Tabs ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building className="text-emerald-700" size={24} />
              Hotel & Stay Booking Dashboard
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                Live Open-API Accommodations
              </span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Book certified eco-friendly accommodations in low-density heritage zones with live discount passes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'EXPLORE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building size={14} /> Explore Hotels
            </button>
            <button
              onClick={() => setActiveTab('MY_BOOKINGS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'MY_BOOKINGS'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Ticket size={14} /> My Bookings ({myBookings.length})
            </button>
          </div>
        </div>

        {activeTab === 'EXPLORE' && (
          <>
            {/* ── 1. Top Search Header ───────────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-700" /> Destination City
                  </label>
                  <select
                    value={searchCity}
                    onChange={e => {
                      setSearchCity(e.target.value);
                      if (e.target.value !== 'ALL') switchCity(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Jaipur">Jaipur</option>
                    <option value="Agra">Agra</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Goa">Goa</option>
                    <option value="Delhi">Delhi</option>
                    <option value="ALL">All Cities</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar size={13} className="text-emerald-700" /> Check-in / Check-out
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={e => setCheckInDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={e => setCheckOutDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Users size={13} className="text-emerald-700" /> Guests & Rooms
                  </label>
                  <select
                    value={guestsCount}
                    onChange={e => setGuestsCount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="1 Guest, 1 Room">1 Guest, 1 Room</option>
                    <option value="2 Guests, 1 Room">2 Guests, 1 Room</option>
                    <option value="3 Guests, 1 Room">3 Guests, 1 Room</option>
                    <option value="4 Guests, 2 Rooms">4 Guests, 2 Rooms</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleUpdateSearch}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Search size={14} /> Update Search
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">

              {/* ── 2. Filter Sidebar ─────────────────────────────────────── */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-emerald-700" /> Property Filters
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Price Range / Night</span>
                      <span className="text-slate-900 font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min={1500}
                      max={12000}
                      step={500}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>₹1,500</span>
                      <span>₹12,000+</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecoCertifiedOnly}
                      onChange={e => setEcoCertifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Leaf size={12} className="text-emerald-700" /> Eco Platinum Certified Only
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Highest certified green stays</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lowCrowdOnly}
                      onChange={e => setLowCrowdOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Low-Density Zones Only
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Quiet accommodations outside congested centers</div>
                    </div>
                  </label>

                  <hr className="border-slate-100" />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Sort Results</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    >
                      <option value="RECOMMENDED">Recommended</option>
                      <option value="PRICE_LOW">Price: Low to High</option>
                      <option value="RATING">Guest Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── 3. Hotel Listings ──────────────────────────────────────── */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700">
                    Showing <span className="text-emerald-800">{liveHotels.length}</span> Verified Eco Stays in {searchCity}
                  </div>
                  {loadingHotels && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                      <Loader2 size={14} className="animate-spin" /> Fetching Real-time Inventory…
                    </div>
                  )}
                </div>

                {loadingHotels ? (
                  <div className="space-y-4">
                    {[1, 2].map(n => (
                      <div key={n} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-64 h-44 bg-slate-200 rounded-lg" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                          <div className="h-10 bg-slate-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : liveHotels.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
                    <Building size={40} className="text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800">No Properties Found</h3>
                    <p className="text-xs text-slate-500">Try adjusting your price range slider or unchecking strict filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liveHotels.map(hotel => (
                      <div
                        key={hotel.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row group"
                      >
                        {/* Image */}
                        <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 overflow-hidden bg-slate-100">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                              {hotel.ecoLevel}
                            </span>
                            <span className="bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                              {hotel.crowdZone}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-emerald-800 transition-colors">
                                  {hotel.name}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPin size={13} className="text-emerald-700 shrink-0" />
                                  {hotel.address} · <span className="font-semibold text-emerald-800">{hotel.distance}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md text-emerald-900 shrink-0">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span className="text-xs font-bold">{hotel.rating}</span>
                                <span className="text-[10px] text-slate-500 font-semibold">({hotel.reviewsCount})</span>
                              </div>
                            </div>

                            {/* Eco Perks Chips */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {hotel.ecoFeatures.map((feat, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                                >
                                  <Check size={10} className="text-emerald-700" />
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black text-slate-900">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                                <span className="text-xs text-slate-400 line-through">₹{hotel.originalPrice.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                  {hotel.rerouteDiscount}% Off Pass Active
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">+ taxes & fees · per night</div>
                            </div>

                            <button
                              onClick={() => handleOpenBooking(hotel)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
                            >
                              Reserve Room <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── My Bookings Tab ────────────────────────────────────────── */}
        {activeTab === 'MY_BOOKINGS' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">My Confirmed Eco Stay Passes</h2>

            {myBookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
                <Ticket size={40} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Reservations Yet</h3>
                <p className="text-xs text-slate-500">Explore eco properties and reserve rooms with instant reroute discounts.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myBookings.map(b => (
                  <div key={b.bookingId} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{b.bookingId}</span>
                        <h3 className="font-bold text-slate-900 text-base">{b.hotelName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{b.roomName} · {b.city}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Check-in:</span>
                        <div className="font-bold text-slate-800">{b.checkIn}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Check-out:</span>
                        <div className="font-bold text-slate-800">{b.checkOut}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Guest:</span>
                        <div className="font-bold text-slate-800">{b.guestName}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Total Paid:</span>
                        <div className="font-bold text-emerald-800">₹{b.totalPaid.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                        <Leaf size={14} className="text-emerald-700" /> Carbon Offset: {b.co2SavedKg} kg CO₂ Saved
                      </div>
                      {b.evShuttle && (
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          + EV Shuttle Included
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setPassModalBooking(b)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Printer size={14} /> View Printable Booking Voucher Pass
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Booking Modal (2-Step Flow) ────────────────────────────── */}
        {selectedHotel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setSelectedHotel(null)} />

            <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-emerald-800 px-6 py-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-base text-white">{selectedHotel.name}</h3>
                  <p className="text-emerald-100 text-xs">{selectedHotel.city} · Step {bookingStep} of 2</p>
                </div>
                <button onClick={() => setSelectedHotel(null)} className="text-white/70 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {bookingStep === 1 ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Accommodations Room</h4>
                    <div className="space-y-2">
                      {selectedHotel.rooms.map(rm => (
                        <div
                          key={rm.id}
                          onClick={() => setSelectedRoom(rm)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedRoom?.id === rm.id
                              ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-slate-900 text-xs">{rm.name}</div>
                            <div className="font-black text-slate-900 text-sm">₹{rm.price.toLocaleString('en-IN')} / night</div>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium">{rm.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Car size={16} className="text-emerald-700" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">EV Shuttle Add-on</div>
                            <div className="text-[10px] text-slate-500">Zero-emission transfer between fort & hotel</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">+₹200</span>
                          <input
                            type="checkbox"
                            checked={evShuttleAddon}
                            onChange={e => setEvShuttleAddon(e.target.checked)}
                            className="w-4 h-4 text-emerald-700 focus:ring-emerald-700 rounded"
                          />
                        </div>
                      </label>
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      Continue to Guest Details <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Guest Information & Discount Pass</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600">Guest Full Name</label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600">Mobile Number</label>
                          <input
                            type="text"
                            value={guestPhone}
                            onChange={e => setGuestPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
                          <input
                            type="email"
                            value={guestEmail}
                            onChange={e => setGuestEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Reroute Coupon Code */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            <Tag size={13} /> Applied Reroute Discount Code
                          </span>
                          <span className="text-emerald-800 font-bold">{selectedHotel.rerouteDiscount}% OFF</span>
                        </div>
                        <input
                          type="text"
                          value={discountInput}
                          onChange={e => setDiscountInput(e.target.value)}
                          className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-emerald-900"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-bold"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleConfirmBooking}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
                      >
                        <CheckCircle size={14} /> Confirm Reservation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Printable Pass Modal ───────────────────────────────────── */}
        {passModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setPassModalBooking(null)} />

            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-emerald-800 px-6 py-4 text-center text-white">
                <div className="font-bold text-white text-base tracking-wide flex items-center justify-center gap-2">
                  <Ticket size={18} /> Sustainable Eco Stay Reservation Pass
                </div>
                <div className="text-emerald-100 text-xs">{passModalBooking.bookingId}</div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
                    <QRCode
                      value={JSON.stringify({
                        bookingId: passModalBooking.bookingId,
                        hotel: passModalBooking.hotelName,
                        guest: passModalBooking.guestName,
                        co2SavedKg: passModalBooking.co2SavedKg,
                      })}
                      size={140}
                      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                      viewBox="0 0 256 256"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-slate-900 text-base">{passModalBooking.hotelName}</div>
                  <div className="text-xs text-slate-500 font-medium">{passModalBooking.roomName} · {passModalBooking.city}</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500 font-medium">Guest Name</span>
                    <span className="font-bold">{passModalBooking.guestName}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500 font-medium">Dates</span>
                    <span className="font-bold">{passModalBooking.checkIn} to {passModalBooking.checkOut}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500 font-medium">Total Paid</span>
                    <span className="font-bold text-emerald-800">₹{passModalBooking.totalPaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-emerald-900 font-bold">
                    <span>Carbon Footprint Offset</span>
                    <span>{passModalBooking.co2SavedKg} kg CO₂ Saved</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Printer size={14} /> Print Pass
                  </button>
                  <button
                    onClick={() => setPassModalBooking(null)}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
