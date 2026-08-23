import { VERIFIED_MONUMENTS } from './monumentData';

export const CITIES_LIST = [
  'Jaipur', 'Agra', 'Varanasi', 'Goa', 'Delhi',
  'Mumbai', 'Udaipur', 'Amritsar', 'Kolkata', 'Bengaluru'
];

export const CITY_COORDINATES = {
  Jaipur:   [26.9124, 75.7873],
  Agra:     [27.1767, 78.0081],
  Varanasi: [25.3176, 82.9739],
  Goa:      [15.2993, 74.1240],
  Delhi:    [28.6139, 77.2090],
  Mumbai:   [18.9220, 72.8347],
  Udaipur:  [24.5764, 73.6835],
  Amritsar: [31.6200, 74.8765],
  Kolkata:  [22.5448, 88.3426],
  Bengaluru:[12.9716, 77.5946],
};

export const ALL_MONUMENT_COORDS = {
  // Jaipur
  'Amber Fort':              [26.9855, 75.8513],
  'Jaigarh Fort':            [26.9917, 75.8458],
  'Hawa Mahal':              [26.9239, 75.8267],
  'City Palace Jaipur':      [26.9258, 75.8237],
  'Nahargarh Fort':          [26.9394, 75.8042],

  // Agra
  'Taj Mahal':               [27.1751, 78.0421],
  'Mehtab Bagh':             [27.1826, 78.0361],
  'Agra Fort':               [27.1795, 78.0211],

  // Varanasi
  'Dashashwamedh Ghat':      [25.3075, 83.0107],
  'Assi Ghat':               [25.2855, 83.0132],
  'Sarnath Archaeological Site': [25.3810, 83.0229],

  // Goa
  'Baga Beach':              [15.5522, 73.7519],
  'Morjim Beach':            [15.6347, 73.7326],
  'Aguada Fort':             [15.5012, 73.7727],

  // Delhi
  'Red Fort':                [28.6562, 77.2410],
  'Safdarjung Tomb':         [28.5893, 77.2106],
  "Humayun's Tomb":          [28.5933, 77.2507],
  'India Gate':              [28.6129, 77.2295],
  'Qutub Minar':             [28.5245, 77.1855],

  // Mumbai
  'Gateway of India':        [18.9220, 72.8347],
  'Marine Drive':            [18.9438, 72.8232],
  'Kanheri Caves':           [19.2061, 72.9060],
  'Elephanta Caves':         [18.9633, 72.9315],

  // Udaipur
  'City Palace Udaipur':      [24.5764, 73.6835],
  'Lake Pichola':            [24.5700, 73.6780],
  'Saheliyon Ki Bari':       [24.6008, 73.6853],
  'Sajjangarh Monsoon Palace': [24.5900, 73.6360],

  // Amritsar
  'Golden Temple Main Gate': [31.6200, 74.8765],
  'Jallianwala Bagh':        [31.6206, 74.8801],
  'Gobindgarh Fort':         [31.6315, 74.8562],
  'Wagah Border':            [31.6042, 74.5746],

  // Kolkata
  'Victoria Memorial':       [22.5448, 88.3426],
  'Howrah Bridge':           [22.5851, 88.3468],
  'Dakshineswar Kali Temple':[22.6550, 88.3575],
  'Indian Museum':           [22.5579, 88.3511],

  // Bengaluru
  'Lalbagh Botanical Garden Glass House': [12.9507, 77.5848],
  'Cubbon Park':             [12.9763, 77.5929],
  'Bangalore Palace':        [12.9988, 77.5921],
  'Tipu Sultan\'s Summer Palace': [12.9592, 77.5739],
};

export const MASTER_CITY_DATA = {
  Delhi: {
    name: 'Delhi',
    state: 'National Capital Territory',
    coords: [28.6139, 77.2090],
    tagline: 'Historic Mughal capital and vibrant political heart of India.',
    description: 'Home to majestic UNESCO World Heritage monuments, lush green corridors, and centuries of architectural legacy.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80',
    weather: '28°C · Pleasant Breeze',
    bestTime: 'Best Oct – Mar',
    monuments: [
      {
        name: 'Red Fort',
        coords: [28.6562, 77.2410],
        load: 92,
        status: 'RED',
        queue: '~55m Long Queue',
        img: VERIFIED_MONUMENTS['Red Fort'].image,
        operatingHours: '09:30 AM – 04:30 PM (Closed Mondays)',
        ecoRules: 'Zero single-use plastics permitted · Electric shuttle pass recommended',
        sustainabilityRating: '4.7/5 (Green Flag Monument)'
      },
      {
        name: 'Safdarjung Tomb',
        coords: [28.5893, 77.2106],
        load: 25,
        status: 'GREEN',
        queue: '< 5m Instant Entry',
        img: VERIFIED_MONUMENTS['Safdarjung Tomb'].image,
        operatingHours: '07:00 AM – 06:00 PM',
        ecoRules: 'Eco-walking garden trail · Plastic-free sanctuary',
        sustainabilityRating: '4.9/5 (Peace Corridor Certified)'
      },
      {
        name: "Humayun's Tomb",
        coords: [28.5933, 77.2507],
        load: 65,
        status: 'YELLOW',
        queue: '15m Queue',
        img: VERIFIED_MONUMENTS["Humayun's Tomb"].image,
        operatingHours: '06:00 AM – 06:00 PM',
        ecoRules: 'Persian charbagh water-recycled garden · Digital ticketing only',
        sustainabilityRating: '4.8/5 (UNESCO Eco Garden)'
      }
    ],
    reroutePair: {
      primary: "Red Fort",
      alternate: "Safdarjung Tomb",
      distance: "3.4 km",
      saturation: "92%",
      primaryQueue: "~55m Long Queue",
      altQueue: "< 5m Instant Entry",
      perk: "Free Heritage Audio Guide + 20% Metro Pass Rebate",
      primaryImg: VERIFIED_MONUMENTS["Red Fort"].image,
      altImg: VERIFIED_MONUMENTS["Safdarjung Tomb"].image
    },
    merchants: [
      {
        name: 'Chandni Chowk Eco-Tours & Chai',
        category: 'Culinary & Culture',
        offer: '15% Off Organic Refreshments',
        code: 'DELHICHAI15',
        perk: 'Complimentary Clay Kulhad Chai & Audio Map',
        address: 'Paranthe Wali Gali, Chandni Chowk, Delhi',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600'
      },
      {
        name: 'Dilli Haat Craft Cooperative',
        category: 'Artisans & Handicrafts',
        offer: '20% Off Sustainable Crafts',
        code: 'DILLIHAAT20',
        perk: 'Free Eco-Tote Bag with Artisan Purchases',
        address: 'INA Market, Sri Aurobindo Marg, Delhi',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=600'
      }
    ]
  },

  Jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    coords: [26.9124, 75.7873],
    tagline: 'UNESCO World Heritage royal landscape of Mughal & Rajput forts.',
    description: 'Famed for its pink sandstone palaces, hilltop fortresses, and vibrant traditional handicraft bazaars.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
    weather: '26°C · Ideal Sunlight',
    bestTime: 'Best Oct – Mar',
    monuments: [
      {
        name: 'Amber Fort',
        coords: [26.9855, 75.8513],
        load: 94,
        status: 'RED',
        queue: '~45m Long Queue',
        img: VERIFIED_MONUMENTS['Amber Fort'].image,
        operatingHours: '08:00 AM – 05:30 PM',
        ecoRules: 'Electric buggy transit mandatory · No disposable water bottles',
        sustainabilityRating: '4.6/5 (Heritage Gold)'
      },
      {
        name: 'Jaigarh Fort',
        coords: [26.9917, 75.8458],
        load: 35,
        status: 'GREEN',
        queue: '< 5m Instant Entry',
        img: VERIFIED_MONUMENTS['Jaigarh Fort'].image,
        operatingHours: '09:00 AM – 05:00 PM',
        ecoRules: 'Hilltop wind corridor · Solar-powered visitor hub',
        sustainabilityRating: '4.9/5 (Eco Fort Sanctuary)'
      },
      {
        name: 'Hawa Mahal',
        coords: [26.9239, 75.8267],
        load: 68,
        status: 'YELLOW',
        queue: '20m Queue',
        img: VERIFIED_MONUMENTS['Hawa Mahal'].image,
        operatingHours: '09:00 AM – 05:00 PM',
        ecoRules: 'Natural ventilation architecture · Pedestrian plaza entry',
        sustainabilityRating: '4.8/5 (Wind Architecture)'
      }
    ],
    reroutePair: {
      primary: "Amber Fort",
      alternate: "Jaigarh Fort",
      distance: "1.2 km",
      saturation: "94%",
      primaryQueue: "~45m Long Queue",
      altQueue: "< 5m Instant Entry",
      perk: "20% Entry Discount + Partner Hospitality Perk",
      primaryImg: VERIFIED_MONUMENTS["Amber Fort"].image,
      altImg: VERIFIED_MONUMENTS["Jaigarh Fort"].image
    },
    merchants: [
      {
        name: 'Rajputana Heritage Organic Café',
        category: 'Hospitality & Dining',
        offer: '20% Entry Discount + Free Refreshment',
        code: 'JAIGARH20',
        perk: 'Complimentary Herbal Tea & Sunset Terrace Pass',
        address: 'Jaigarh Fort Entrance Road, Amber, Jaipur',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600'
      },
      {
        name: 'Johari Bazaar Artisan Block Guild',
        category: 'Artisans & Handicrafts',
        offer: '15% Off Block Printed Textiles',
        code: 'JOHARI15',
        perk: 'Live Block Printing Workshop Voucher',
        address: 'Johari Bazaar, Pink City, Jaipur',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600'
      }
    ]
  },

  Agra: {
    name: 'Agra',
    state: 'Uttar Pradesh',
    coords: [27.1767, 78.0081],
    tagline: 'City of the immortal Taj Mahal and timeless Mughal grandeur.',
    description: 'Perched on the banks of Yamuna river, featuring world-famous marble mausoleums and riverside gardens.',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    weather: '27°C · Clear Sky',
    bestTime: 'Best Oct – Mar',
    monuments: [
      {
        name: 'Taj Mahal',
        coords: [27.1751, 78.0421],
        load: 96,
        status: 'RED',
        queue: '~65m Long Queue',
        img: VERIFIED_MONUMENTS['Taj Mahal'].image,
        operatingHours: 'Sunrise – Sunset (Closed Fridays)',
        ecoRules: 'Strict zero-emission zone · Battery bus transit only within 500m',
        sustainabilityRating: '4.9/5 (World Heritage Ecotone)'
      },
      {
        name: 'Mehtab Bagh',
        coords: [27.1826, 78.0361],
        load: 30,
        status: 'GREEN',
        queue: '< 10m Instant Entry',
        img: VERIFIED_MONUMENTS['Mehtab Bagh'].image,
        operatingHours: '06:00 AM – 06:00 PM',
        ecoRules: 'Riverside charbagh protection zone · Organic lawn policy',
        sustainabilityRating: '4.9/5 (River Sunset Corridor)'
      },
      {
        name: 'Agra Fort',
        coords: [27.1795, 78.0211],
        load: 62,
        status: 'YELLOW',
        queue: '15m Queue',
        img: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800&auto=format&fit=crop&q=80',
        operatingHours: '06:00 AM – 06:00 PM',
        ecoRules: 'Solar lit pathways · Heritage conservation perimeter',
        sustainabilityRating: '4.7/5 (Imperial Fortress)'
      }
    ],
    reroutePair: {
      primary: "Taj Mahal",
      alternate: "Mehtab Bagh & Itimad-ud-Daulah",
      distance: "2.1 km",
      saturation: "96%",
      primaryQueue: "~65m Long Queue",
      altQueue: "< 10m Instant Entry",
      perk: "Sunset View Point Access + 25% Souvenir Voucher",
      primaryImg: VERIFIED_MONUMENTS["Taj Mahal"].image,
      altImg: VERIFIED_MONUMENTS["Mehtab Bagh"].image
    },
    merchants: [
      {
        name: 'Yamuna Riverside Tea & Souvenirs',
        category: 'Hospitality & Dining',
        offer: '25% Off Sunset Photography Pass',
        code: 'MEHTAB25',
        perk: 'Free High-Resolution Photo Print & Herbal Refreshment',
        address: 'Mehtab Bagh Viewpoint Promenade, Agra',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600'
      },
      {
        name: 'Mughal Marble Inlay Eco-Artisans',
        category: 'Artisans & Handicrafts',
        offer: '20% Off Pietra Dura Crafts',
        code: 'MUGHALART20',
        perk: 'Live Inlay Art Demonstration & Gift Box',
        address: 'Fatehabad Road, Near Taj East Gate, Agra',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600'
      }
    ]
  },

  Varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    coords: [25.3176, 82.9739],
    tagline: 'Ancient living city on the sacred Ganges river with timeless ghats.',
    description: 'The spiritual capital of India, legendary for evening Ganga Aarti ceremonies, ancient riverfront ghats, and silk weaving.',
    heroImage: 'https://www.varanasiguru.com/wp-content/uploads/2021/03/Dashashwamedh-Ghat.jpg',
    weather: '25°C · Clear Sky',
    bestTime: 'Best Nov – Feb',
    monuments: [
      {
        name: 'Dashashwamedh Ghat',
        coords: [25.3075, 83.0107],
        load: 91,
        status: 'RED',
        queue: '~50m Crowd Congestion',
        img: VERIFIED_MONUMENTS['Dashashwamedh Ghat'].image,
        operatingHours: 'Open 24 Hours (Ganga Aarti at 06:30 PM)',
        ecoRules: 'Electric boat navigation zones · Zero plastic river disposal',
        sustainabilityRating: '4.5/5 (Ganga Heritage Zone)'
      },
      {
        name: 'Assi Ghat',
        coords: [25.2855, 83.0132],
        load: 32,
        status: 'GREEN',
        queue: '< 5m Peaceful Access',
        img: VERIFIED_MONUMENTS['Assi Ghat'].image,
        operatingHours: 'Open 24 Hours (Subah-e-Banaras at 05:00 AM)',
        ecoRules: 'Morning yoga eco-deck · Solar riverfront lighting',
        sustainabilityRating: '4.9/5 (Peaceful Sanctuary)'
      },
      {
        name: 'Sarnath Archaeological Site',
        coords: [25.3810, 83.0229],
        load: 42,
        status: 'GREEN',
        queue: '< 10m Queue',
        img: VERIFIED_MONUMENTS['Assi Ghat & Sarnath'].image,
        operatingHours: '08:00 AM – 05:00 PM (Closed Fridays)',
        ecoRules: 'UNESCO Silence Corridor · Plastic-free botanical lawns',
        sustainabilityRating: '4.9/5 (Buddhist Peace Park)'
      }
    ],
    reroutePair: {
      primary: "Dashashwamedh Ghat",
      alternate: "Assi Ghat & Sarnath Heritage Complex",
      distance: "4.2 km",
      saturation: "91%",
      primaryQueue: "~50m Crowd Congestion",
      altQueue: "< 5m Peaceful Access",
      perk: "Eco-Boat Ride Pass + Cultural Tea Voucher",
      primaryImg: VERIFIED_MONUMENTS["Dashashwamedh Ghat"].image,
      altImg: VERIFIED_MONUMENTS["Assi Ghat & Sarnath"].image
    },
    merchants: [
      {
        name: 'Kashi Eco-Boat Tours',
        category: 'Hospitality & Eco-Tours',
        offer: '15% Off Electric Boat Aarti Rides',
        code: 'ASSIGHAT15',
        perk: 'Complimentary Herbal Tea & Aarti Floral Basket',
        address: 'Assi Ghat Promenade, Varanasi',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600'
      },
      {
        name: 'Banarasi Handloom Weavers Cooperative',
        category: 'Artisans & Textiles',
        offer: '20% Off Organic Banarasi Sarees',
        code: 'BANARASISILK20',
        perk: 'Handloom Weaving Demonstration & Silk Scarf Gift',
        address: 'Madanpura Weavers Lane, Varanasi',
        rating: 4.8,
        image: 'https://www.varanasiguru.com/wp-content/uploads/2021/03/Dashashwamedh-Ghat.jpg'
      }
    ]
  },

  Goa: {
    name: 'Goa',
    state: 'Goa',
    coords: [15.2993, 74.1240],
    tagline: 'Portuguese colonial architecture meets pristine eco beaches & sanctuaries.',
    description: 'Tropical coastal haven blending Portuguese heritage churches, quiet coconut palm bays, and mangrove sanctuaries.',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
    weather: '29°C · Coastal Breeze',
    bestTime: 'Best Nov – Feb',
    monuments: [
      {
        name: 'Baga Beach',
        coords: [15.5522, 73.7519],
        load: 90,
        status: 'RED',
        queue: '~45m Peak Traffic',
        img: VERIFIED_MONUMENTS['Baga Beach'].image,
        operatingHours: 'Open 24 Hours',
        ecoRules: 'Beach litter monitoring · Electric water sports incentive',
        sustainabilityRating: '4.4/5 (Blue Flag Candidate)'
      },
      {
        name: 'Morjim Beach',
        coords: [15.6347, 73.7326],
        load: 28,
        status: 'GREEN',
        queue: '< 5m Quiet Zone Entry',
        img: VERIFIED_MONUMENTS['Morjim Beach'].image,
        operatingHours: 'Open 24 Hours',
        ecoRules: 'Protected Olive Ridley turtle sanctuary · No night loudspeakers',
        sustainabilityRating: '4.9/5 (Turtle Conservation Bay)'
      },
      {
        name: 'Aguada Fort',
        coords: [15.5012, 73.7727],
        load: 64,
        status: 'YELLOW',
        queue: '15m Queue',
        img: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&auto=format&fit=crop&q=80',
        operatingHours: '09:30 AM – 06:00 PM',
        ecoRules: 'Lighthouse heritage area · Renewable coastal lighting',
        sustainabilityRating: '4.7/5 (Coastal Sentinel)'
      }
    ],
    reroutePair: {
      primary: "Baga Beach",
      alternate: "Morjim Beach & Chorao Island",
      distance: "14.0 km",
      saturation: "90%",
      primaryQueue: "~45m Peak Traffic",
      altQueue: "< 5m Quiet Zone Entry",
      perk: "Complimentary Welcome Drink at Morjim Shack",
      primaryImg: VERIFIED_MONUMENTS["Baga Beach"].image,
      altImg: VERIFIED_MONUMENTS["Morjim Beach"].image
    },
    merchants: [
      {
        name: 'Morjim Eco-Shack & Bay Cafe',
        category: 'Hospitality & Dining',
        offer: 'Complimentary Welcome Drink & 10% Off',
        code: 'MORJIMPERK',
        perk: 'Free Sunbed Access & Turtle Eco-Guide Map',
        address: 'Morjim Beach North Road, Goa',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'
      },
      {
        name: 'Chorao Island Mangrove Kayaking',
        category: 'Nature & Eco-Tours',
        offer: '20% Off Guided Mangrove Trails',
        code: 'CHORAOKAYAK20',
        perk: 'Free Birdwatching Binoculars & Coconut Water',
        address: 'Chorao Island Ferry Jetty, Goa',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600'
      }
    ]
  },

  Mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    coords: [18.9220, 72.8347],
    tagline: 'Financial capital blending Victorian Gothic heritage with coastal energy.',
    description: 'Dynamic metropolis boasting colonial monuments along the Arabian Sea, green national parks, and vibrant art districts.',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
    weather: '30°C · Sea Breeze',
    bestTime: 'Best Nov – Feb',
    monuments: [
      {
        name: 'Gateway of India',
        coords: [18.9220, 72.8347],
        load: 93,
        status: 'RED',
        queue: '~50m Rush Hour Queue',
        img: VERIFIED_MONUMENTS['Gateway of India'].image,
        operatingHours: 'Open 24 Hours (Ferry 09:00 AM – 05:00 PM)',
        ecoRules: 'Pedestrianized waterfront plaza · Electric catamarans active',
        sustainabilityRating: '4.6/5 (Harbor Eco Zone)'
      },
      {
        name: 'Kanheri Caves',
        coords: [19.2061, 72.9060],
        load: 25,
        status: 'GREEN',
        queue: '< 10m Eco Trail Access',
        img: VERIFIED_MONUMENTS['Kanheri Caves'].image,
        operatingHours: '07:30 AM – 05:00 PM (Closed Mondays)',
        ecoRules: 'Located inside Sanjay Gandhi National Park · Bicycle rental corridor',
        sustainabilityRating: '4.9/5 (Forest Cave Sanctuary)'
      },
      {
        name: 'Elephanta Caves',
        coords: [18.9633, 72.9315],
        load: 58,
        status: 'YELLOW',
        queue: '15m Ferry Queue',
        img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
        operatingHours: '09:00 AM – 05:30 PM (Closed Mondays)',
        ecoRules: 'UNESCO Island preserve · Eco-toy train transit on pier',
        sustainabilityRating: '4.8/5 (Island Sculptures)'
      }
    ],
    reroutePair: {
      primary: "Gateway of India",
      alternate: "Kanheri Caves & Elephanta Heritage Walk",
      distance: "8.5 km",
      saturation: "93%",
      primaryQueue: "~50m Rush Hour Queue",
      altQueue: "< 10m Eco Trail Access",
      perk: "20% Heritage Ferry Discount + Audio Guide",
      primaryImg: VERIFIED_MONUMENTS["Gateway of India"].image,
      altImg: VERIFIED_MONUMENTS["Kanheri Caves"].image
    },
    merchants: [
      {
        name: 'Irani Heritage Chai Cafe',
        category: 'Culinary & Hospitality',
        offer: '15% Off Maska Bun & Irani Chai',
        code: 'IRANICHAI15',
        perk: 'Complimentary Vintage Postcard & Audio Guide',
        address: 'Colaba Causeway, Near Gateway, Mumbai',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600'
      },
      {
        name: 'Colaba Eco-Artisans Guild',
        category: 'Artisans & Handicrafts',
        offer: '20% Off Upcycled Leather Crafts',
        code: 'COLABA20',
        perk: 'Free Handmade Bookmark & Artisanal Workshop Ticket',
        address: 'Kala Ghoda Art Precinct, Mumbai',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600'
      }
    ]
  },

  Udaipur: {
    name: 'Udaipur',
    state: 'Rajasthan',
    coords: [24.5764, 73.6835],
    tagline: 'City of Lakes boasting royal Mewar palaces and romantic waters.',
    description: 'Enchanting desert oasis surrounded by the Aravalli hills, tranquil blue lakes, and ornate marble palaces.',
    heroImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&auto=format&fit=crop&q=80',
    weather: '25°C · Pleasant Sunshine',
    bestTime: 'Best Sep – Mar',
    monuments: [
      {
        name: 'City Palace Udaipur',
        coords: [24.5764, 73.6835],
        load: 89,
        status: 'RED',
        queue: '~40m Entrance Queue',
        img: VERIFIED_MONUMENTS['City Palace Udaipur'].image,
        operatingHours: '09:30 AM – 05:30 PM',
        ecoRules: 'Solar-powered boat transit on Lake Pichola · Plastic restricted',
        sustainabilityRating: '4.7/5 (Royal Mewar Heritage)'
      },
      {
        name: 'Sajjangarh Monsoon Palace',
        coords: [24.5900, 73.6360],
        load: 32,
        status: 'GREEN',
        queue: '< 5m Scenic Entry',
        img: VERIFIED_MONUMENTS['Sajjangarh Monsoon Palace'].image,
        operatingHours: '09:00 AM – 06:00 PM',
        ecoRules: 'Wildlife sanctuary hilltop zone · Electric shuttle vehicles',
        sustainabilityRating: '4.9/5 (Hilltop Eco Sanctuary)'
      },
      {
        name: 'Saheliyon Ki Bari',
        coords: [24.6008, 73.6853],
        load: 55,
        status: 'YELLOW',
        queue: '10m Queue',
        img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=800&auto=format&fit=crop&q=80',
        operatingHours: '09:00 AM – 07:00 PM',
        ecoRules: 'Natural gravity-fed fountains · Heritage botanical gardens',
        sustainabilityRating: '4.8/5 (Garden Fountains)'
      }
    ],
    reroutePair: {
      primary: "City Palace Udaipur",
      alternate: "Sajjangarh Monsoon Palace",
      distance: "5.1 km",
      saturation: "89%",
      primaryQueue: "~40m Entrance Queue",
      altQueue: "< 5m Scenic Entry",
      perk: "Rooftop Sunset Pass + Herbal Refreshment",
      primaryImg: VERIFIED_MONUMENTS["City Palace Udaipur"].image,
      altImg: VERIFIED_MONUMENTS["Sajjangarh Monsoon Palace"].image
    },
    merchants: [
      {
        name: 'Lakeview Organic Bakery & Cafe',
        category: 'Hospitality & Dining',
        offer: '20% Off Organic Pastries & Coffee',
        code: 'UDAIPURCAFE',
        perk: 'Complimentary Lake Terrace Seating & herbal tea',
        address: 'Lal Ghat, Lake Pichola, Udaipur',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600'
      },
      {
        name: 'Mewar Handicrafts Emporium',
        category: 'Artisans & Handicrafts',
        offer: '15% Off Miniature Paintings & Silver',
        code: 'MEWARHANDICRAFT',
        perk: 'Live Miniature Painting Demonstration & Souvenir',
        address: 'Palace Road, Jagdish Chowk, Udaipur',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600'
      }
    ]
  },

  Amritsar: {
    name: 'Amritsar',
    state: 'Punjab',
    coords: [31.6200, 74.8765],
    tagline: 'Sacred golden sanctuary of Harmandir Sahib and rich Punjabi heritage.',
    description: 'Heart of Sikh culture, world-famous for its shimmering Golden Temple, heritage streetscapes, and warm hospitality.',
    heroImage: 'https://images.unsplash.com/photo-1588096344356-9b5797f1f91b?w=1200&auto=format&fit=crop&q=80',
    weather: '24°C · Sunny & Crisp',
    bestTime: 'Best Oct – Mar',
    monuments: [
      {
        name: 'Golden Temple Main Gate',
        coords: [31.6200, 74.8765],
        load: 95,
        status: 'RED',
        queue: '~60m Queue',
        img: VERIFIED_MONUMENTS['Golden Temple Main Gate'].image,
        operatingHours: 'Open 24 Hours (World\'s largest free langar)',
        ecoRules: 'Strict zero-litter policy · Solar energy powered kitchens',
        sustainabilityRating: '5.0/5 (Spiritual Eco Excellence)'
      },
      {
        name: 'Gobindgarh Fort',
        coords: [31.6315, 74.8562],
        load: 34,
        status: 'GREEN',
        queue: '< 5m Instant Entry',
        img: VERIFIED_MONUMENTS['Gobindgarh Fort'].image,
        operatingHours: '10:00 AM – 10:00 PM',
        ecoRules: 'Pedestrian heritage fort campus · Solar evening light show',
        sustainabilityRating: '4.8/5 (Heritage Fort Sanctuary)'
      },
      {
        name: 'Jallianwala Bagh',
        coords: [31.6206, 74.8801],
        load: 70,
        status: 'YELLOW',
        queue: '20m Queue',
        img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=800&auto=format&fit=crop&q=80',
        operatingHours: '06:30 AM – 07:30 PM',
        ecoRules: 'Memorial silence zone · Zero plastic policy',
        sustainabilityRating: '4.8/5 (Memorial Park)'
      }
    ],
    reroutePair: {
      primary: "Golden Temple Main Gate",
      alternate: "Gobindgarh Fort & Ram Bagh",
      distance: "3.2 km",
      saturation: "95%",
      primaryQueue: "~60m Queue",
      altQueue: "< 5m Instant Entry",
      perk: "Cultural Show Ticket + Heritage Craft Discount",
      primaryImg: VERIFIED_MONUMENTS["Golden Temple Main Gate"].image,
      altImg: VERIFIED_MONUMENTS["Gobindgarh Fort"].image
    },
    merchants: [
      {
        name: 'Heritage Amritsari Kulcha Hub',
        category: 'Culinary & Dining',
        offer: '20% Off Authentic Clay-Oven Kulchas',
        code: 'KULCHAHUB20',
        perk: 'Complimentary Sweet Lassi with Meal',
        address: 'Heritage Street, Near Golden Temple Gate, Amritsar',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1588096344356-9b5797f1f91b?w=600'
      },
      {
        name: 'Phulkari Handloom Weavers Guild',
        category: 'Artisans & Textiles',
        offer: '15% Off Hand-Embroidered Phulkari Dupattas',
        code: 'PHULKARI15',
        perk: 'Live Phulkari Embroidery Workshop & Bookmark',
        address: 'Hall Bazaar, Amritsar',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=600'
      }
    ]
  },

  Kolkata: {
    name: 'Kolkata',
    state: 'West Bengal',
    coords: [22.5448, 88.3426],
    tagline: 'City of Joy famous for colonial architecture, literature, and art.',
    description: 'Cultural heartbeat of East India, renowned for grand Victorian marble monuments, tram networks, and literary heritage.',
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&auto=format&fit=crop&q=80',
    weather: '27°C · Pleasant Humidity',
    bestTime: 'Best Oct – Mar',
    monuments: [
      {
        name: 'Victoria Memorial',
        coords: [22.5448, 88.3426],
        load: 90,
        status: 'RED',
        queue: '~45m Entry Queue',
        img: VERIFIED_MONUMENTS['Victoria Memorial'].image,
        operatingHours: '10:00 AM – 05:00 PM (Closed Mondays)',
        ecoRules: 'Lush 57-acre botanical lawn zone · Solar powered gallery',
        sustainabilityRating: '4.8/5 (Green Park Heritage)'
      },
      {
        name: 'Indian Museum',
        coords: [22.5579, 88.3511],
        load: 30,
        status: 'GREEN',
        queue: '< 5m Quiet Garden Access',
        img: VERIFIED_MONUMENTS['Indian Museum'].image,
        operatingHours: '10:00 AM – 05:00 PM (Closed Mondays)',
        ecoRules: 'Ninth oldest museum in the world · Heritage eco-courtyard',
        sustainabilityRating: '4.9/5 (Cultural Repository)'
      },
      {
        name: 'Howrah Bridge',
        coords: [22.5851, 88.3468],
        load: 65,
        status: 'YELLOW',
        queue: '15m Pedestrian Flow',
        img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
        operatingHours: 'Open 24 Hours',
        ecoRules: 'Cantilever bridge pedestrian walkway · Ferry transit encouraged',
        sustainabilityRating: '4.6/5 (Iconic Landmark)'
      }
    ],
    reroutePair: {
      primary: "Victoria Memorial",
      alternate: "Indian Museum & Marble Palace",
      distance: "2.8 km",
      saturation: "90%",
      primaryQueue: "~45m Entry Queue",
      altQueue: "< 5m Quiet Garden Access",
      perk: "15% Tram Heritage Ride Voucher",
      primaryImg: VERIFIED_MONUMENTS["Victoria Memorial"].image,
      altImg: VERIFIED_MONUMENTS["Indian Museum"].image
    },
    merchants: [
      {
        name: 'College Street Book & Chai Guild',
        category: 'Culinary & Literature',
        offer: '15% Off Artisan Clay-Pot Tea & Snacks',
        code: 'BOOKGUILD15',
        perk: 'Complimentary Vintage Bengal Map & Literary Journal',
        address: 'College Street Boi Para, Kolkata',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600'
      },
      {
        name: 'Bengal Terracotta & Clay Craft House',
        category: 'Artisans & Handicrafts',
        offer: '20% Off Eco-Clay Sculptures & Bankura Horses',
        code: 'TERRACOTTA20',
        perk: 'Pottery Wheel Experience & Gift Souvenir',
        address: 'Kumartuli Artisan Village, Kolkata',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600'
      }
    ]
  },

  Bengaluru: {
    name: 'Bengaluru',
    state: 'Karnataka',
    coords: [12.9716, 77.5946],
    tagline: 'Silicon Valley of India famed for lush botanical gardens and royal palaces.',
    description: 'Garden City boasting year-round pleasant climate, expansive public parks, historic glasshouses, and tech innovation hubs.',
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop&q=80',
    weather: '23°C · Cool & Breeze',
    bestTime: 'Best Year-Round',
    monuments: [
      {
        name: 'Lalbagh Botanical Garden Glass House',
        coords: [12.9507, 77.5848],
        load: 88,
        status: 'RED',
        queue: '~35m Gate Queue',
        img: VERIFIED_MONUMENTS['Lalbagh Botanical Garden Glass House'].image,
        operatingHours: '06:00 AM – 07:00 PM',
        ecoRules: '240-acre plastic-free botanical preserve · Battery vehicle transit',
        sustainabilityRating: '4.9/5 (Botanical Eco Benchmark)'
      },
      {
        name: 'Cubbon Park',
        coords: [12.9763, 77.5929],
        load: 26,
        status: 'GREEN',
        queue: '< 5m Eco Canopy Walk',
        img: VERIFIED_MONUMENTS['Cubbon Park'].image,
        operatingHours: '06:00 AM – 06:00 PM (Vehicle-free Sundays)',
        ecoRules: '300-acre green lung sanctuary · Strict anti-litter canopy walk',
        sustainabilityRating: '5.0/5 (Green Sanctuary)'
      },
      {
        name: 'Bangalore Palace',
        coords: [12.9988, 77.5921],
        load: 54,
        status: 'YELLOW',
        queue: '15m Queue',
        img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        operatingHours: '10:00 AM – 05:30 PM',
        ecoRules: 'Tudor architecture heritage grounds · Solar garden lighting',
        sustainabilityRating: '4.7/5 (Royal Grounds)'
      }
    ],
    reroutePair: {
      primary: "Lalbagh Botanical Garden Glass House",
      alternate: "Cubbon Park & Bangalore Palace",
      distance: "4.0 km",
      saturation: "88%",
      primaryQueue: "~35m Gate Queue",
      altQueue: "< 5m Eco Canopy Walk",
      perk: "Organic Garden Refreshment + Audio Map",
      primaryImg: VERIFIED_MONUMENTS["Lalbagh Botanical Garden Glass House"].image,
      altImg: VERIFIED_MONUMENTS["Cubbon Park"].image
    },
    merchants: [
      {
        name: 'Cubbon Park Organic Eco-Cafe',
        category: 'Hospitality & Dining',
        offer: '15% Off Farm-to-Table Fresh Juices',
        code: 'CUBBONCAFE15',
        perk: 'Free Organic Herbal Tea & Eco Canopy Trail Map',
        address: 'Cubbon Park Pavilion, Kasturba Road, Bengaluru',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600'
      },
      {
        name: 'Mysore Silk & Sandalwood Craft Guild',
        category: 'Artisans & Handicrafts',
        offer: '20% Off Certified Mysore Silk Scarves',
        code: 'MYSORESILK20',
        perk: 'Free Sandalwood Eco-Pouch with Silk Purchases',
        address: 'MG Road Heritage Arcade, Bengaluru',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600'
      }
    ]
  }
};
