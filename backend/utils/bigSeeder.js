const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Hotel = require('../models/Hotel');
const User = require('../models/User');

// ─── 50 Indian Cities (Tier-1, Tier-2, Tier-3) ───────────────────────────────
const cities = [
  // Tier-1
  { city: 'Mumbai',      state: 'Maharashtra',       tier: 1 },
  { city: 'Delhi',       state: 'Delhi',             tier: 1 },
  { city: 'Bengaluru',   state: 'Karnataka',         tier: 1 },
  { city: 'Hyderabad',   state: 'Telangana',         tier: 1 },
  { city: 'Chennai',     state: 'Tamil Nadu',        tier: 1 },
  { city: 'Kolkata',     state: 'West Bengal',       tier: 1 },
  { city: 'Pune',        state: 'Maharashtra',       tier: 1 },
  { city: 'Ahmedabad',   state: 'Gujarat',           tier: 1 },
  // Tier-2
  { city: 'Jaipur',      state: 'Rajasthan',         tier: 2 },
  { city: 'Lucknow',     state: 'Uttar Pradesh',     tier: 2 },
  { city: 'Surat',       state: 'Gujarat',           tier: 2 },
  { city: 'Kanpur',      state: 'Uttar Pradesh',     tier: 2 },
  { city: 'Nagpur',      state: 'Maharashtra',       tier: 2 },
  { city: 'Indore',      state: 'Madhya Pradesh',    tier: 2 },
  { city: 'Bhopal',      state: 'Madhya Pradesh',    tier: 2 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh',  tier: 2 },
  { city: 'Patna',       state: 'Bihar',             tier: 2 },
  { city: 'Vadodara',    state: 'Gujarat',           tier: 2 },
  { city: 'Ghaziabad',   state: 'Uttar Pradesh',     tier: 2 },
  { city: 'Ludhiana',    state: 'Punjab',            tier: 2 },
  { city: 'Agra',        state: 'Uttar Pradesh',     tier: 2 },
  { city: 'Nashik',      state: 'Maharashtra',       tier: 2 },
  { city: 'Faridabad',   state: 'Haryana',           tier: 2 },
  { city: 'Meerut',      state: 'Uttar Pradesh',     tier: 2 },
  { city: 'Rajkot',      state: 'Gujarat',           tier: 2 },
  { city: 'Varanasi',    state: 'Uttar Pradesh',     tier: 2 },
  { city: 'Srinagar',    state: 'Jammu & Kashmir',   tier: 2 },
  { city: 'Aurangabad',  state: 'Maharashtra',       tier: 2 },
  { city: 'Dhanbad',     state: 'Jharkhand',         tier: 2 },
  { city: 'Amritsar',    state: 'Punjab',            tier: 2 },
  // Tier-3
  { city: 'Udaipur',     state: 'Rajasthan',         tier: 3 },
  { city: 'Shimla',      state: 'Himachal Pradesh',  tier: 3 },
  { city: 'Rishikesh',   state: 'Uttarakhand',       tier: 3 },
  { city: 'Goa',         state: 'Goa',               tier: 3 },
  { city: 'Mysuru',      state: 'Karnataka',         tier: 3 },
  { city: 'Coimbatore',  state: 'Tamil Nadu',        tier: 3 },
  { city: 'Kochi',       state: 'Kerala',            tier: 3 },
  { city: 'Thiruvananthapuram', state: 'Kerala',     tier: 3 },
  { city: 'Guwahati',    state: 'Assam',             tier: 3 },
  { city: 'Bhubaneswar', state: 'Odisha',            tier: 3 },
  { city: 'Dehradun',    state: 'Uttarakhand',       tier: 3 },
  { city: 'Jodhpur',     state: 'Rajasthan',         tier: 3 },
  { city: 'Raipur',      state: 'Chhattisgarh',      tier: 3 },
  { city: 'Ranchi',      state: 'Jharkhand',         tier: 3 },
  { city: 'Chandigarh',  state: 'Punjab',            tier: 3 },
  { city: 'Mangaluru',   state: 'Karnataka',         tier: 3 },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu',    tier: 3 },
  { city: 'Madurai',     state: 'Tamil Nadu',        tier: 3 },
  { city: 'Jammu',       state: 'Jammu & Kashmir',   tier: 3 },
  { city: 'Puducherry',  state: 'Puducherry',        tier: 3 },
];

// ─── Hotel name templates per tier ───────────────────────────────────────────
const tier1Hotels = [
  { prefix: 'The Oberoi',        category: 'Ultra-Luxury', basePrice: 18000 },
  { prefix: 'Taj',               category: 'Ultra-Luxury', basePrice: 22000 },
  { prefix: 'ITC Grand',         category: 'Luxury',       basePrice: 14000 },
  { prefix: 'JW Marriott',       category: 'Luxury',       basePrice: 16000 },
  { prefix: 'Hyatt Regency',     category: 'Premium',      basePrice: 9000  },
];

const tier2Hotels = [
  { prefix: 'Radisson Blu',      category: 'Premium',      basePrice: 6500  },
  { prefix: 'Novotel',           category: 'Premium',      basePrice: 5500  },
  { prefix: 'Lemon Tree Premier',category: 'Standard',     basePrice: 3500  },
  { prefix: 'Fortune Park',      category: 'Standard',     basePrice: 3000  },
  { prefix: 'The Fern',          category: 'Standard',     basePrice: 2800  },
];

const tier3Hotels = [
  { prefix: 'Treebo Trend',      category: 'Standard',     basePrice: 2000  },
  { prefix: 'FabHotel',          category: 'Budget',       basePrice: 1200  },
  { prefix: 'OYO Townhouse',     category: 'Budget',       basePrice: 900   },
  { prefix: 'Zostel',            category: 'Budget',       basePrice: 700   },
  { prefix: 'The Heritage Inn',  category: 'Standard',     basePrice: 1800  },
];

// ─── Amenity sets ─────────────────────────────────────────────────────────────
const luxuryAmenities   = ['Free WiFi','Swimming Pool','Spa','Gym','Restaurant','Bar','Concierge','Valet Parking','Room Service','Business Center'];
const premiumAmenities  = ['Free WiFi','Swimming Pool','Gym','Restaurant','Bar','Room Service','Business Center','Parking'];
const standardAmenities = ['Free WiFi','Restaurant','Parking','Room Service','Gym'];
const budgetAmenities   = ['Free WiFi','Parking','Common Kitchen'];

const amenityMap = {
  'Ultra-Luxury': luxuryAmenities,
  'Luxury':       luxuryAmenities,
  'Premium':      premiumAmenities,
  'Standard':     standardAmenities,
  'Budget':       budgetAmenities,
};

// ─── Room templates ───────────────────────────────────────────────────────────
function getRooms(basePrice, category) {
  if (category === 'Ultra-Luxury' || category === 'Luxury') {
    return [
      { type: 'Deluxe',       price: basePrice,          capacity: 2, amenities: ['King Bed','City View','Mini Bar'],          count: 20, available: true },
      { type: 'Suite',        price: Math.round(basePrice * 2.2), capacity: 3, amenities: ['Living Room','Jacuzzi','Butler'], count: 8,  available: true },
      { type: 'Presidential', price: Math.round(basePrice * 5),   capacity: 4, amenities: ['Private Pool','Personal Chef'],   count: 2,  available: true },
    ];
  }
  if (category === 'Premium') {
    return [
      { type: 'Standard', price: Math.round(basePrice * 0.85), capacity: 2, amenities: ['Queen Bed','Work Desk'],          count: 30, available: true },
      { type: 'Deluxe',   price: basePrice,                    capacity: 2, amenities: ['King Bed','City View'],           count: 20, available: true },
      { type: 'Suite',    price: Math.round(basePrice * 1.8),  capacity: 3, amenities: ['Living Area','Kitchenette'],      count: 5,  available: true },
    ];
  }
  if (category === 'Standard') {
    return [
      { type: 'Standard', price: basePrice,                   capacity: 2, amenities: ['Double Bed','AC'],                count: 25, available: true },
      { type: 'Deluxe',   price: Math.round(basePrice * 1.4), capacity: 2, amenities: ['King Bed','TV','Mini Fridge'],    count: 10, available: true },
    ];
  }
  // Budget
  return [
    { type: 'Studio',   price: Math.round(basePrice * 0.7), capacity: 1, amenities: ['Single Bed','Fan'],               count: 15, available: true },
    { type: 'Standard', price: basePrice,                   capacity: 2, amenities: ['Double Bed','AC'],                count: 10, available: true },
  ];
}

// ─── Image pools ─────────────────────────────────────────────────────────────
const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
];

function pickImages(seed) {
  const idx = seed % hotelImages.length;
  return [
    hotelImages[idx],
    hotelImages[(idx + 1) % hotelImages.length],
    hotelImages[(idx + 2) % hotelImages.length],
  ];
}

// ─── Description generator ───────────────────────────────────────────────────
function makeDescription(name, city, state, category) {
  const intros = {
    'Ultra-Luxury': `Experience unparalleled opulence at ${name}, the crown jewel of ${city}. Nestled in the heart of ${state}, this iconic property redefines luxury with world-class amenities, impeccable service, and breathtaking design.`,
    'Luxury':       `${name} stands as a beacon of refined elegance in ${city}, ${state}. Offering a seamless blend of contemporary sophistication and warm hospitality, every stay is crafted to perfection.`,
    'Premium':      `Discover modern comfort and premium amenities at ${name} in ${city}. Strategically located in ${state}, this hotel is the ideal choice for both business and leisure travelers seeking quality and convenience.`,
    'Standard':     `${name} offers a comfortable and welcoming stay in the vibrant city of ${city}, ${state}. With well-appointed rooms and essential amenities, it is the perfect base for exploring the region.`,
    'Budget':       `Enjoy a clean, comfortable, and affordable stay at ${name} in ${city}, ${state}. Perfect for budget-conscious travelers who refuse to compromise on the essentials.`,
  };
  return intros[category] || `Welcome to ${name}, your home away from home in ${city}, ${state}.`;
}

// ─── Tags generator ───────────────────────────────────────────────────────────
function makeTags(city, category, tier) {
  const base = [category, `Tier-${tier}`];
  const cityTags = {
    'Goa': ['Beach','Party','Relaxation'],
    'Shimla': ['Mountain','Hill Station','Scenic'],
    'Rishikesh': ['Adventure','Yoga','Spiritual'],
    'Udaipur': ['Heritage','Romantic','Lake View'],
    'Jaipur': ['Heritage','Rajasthan','Royal'],
    'Varanasi': ['Spiritual','Heritage','Ghats'],
    'Agra': ['Heritage','Taj Mahal','Tourism'],
    'Amritsar': ['Spiritual','Heritage','Golden Temple'],
    'Mysuru': ['Heritage','Palace','Cultural'],
    'Kochi': ['Backwaters','Beach','Cultural'],
    'Guwahati': ['Northeast','Nature','Gateway'],
    'Srinagar': ['Kashmir','Houseboat','Scenic'],
  };
  return [...base, ...(cityTags[city] || ['Business','City'])];
}

// ─── Build all hotels ─────────────────────────────────────────────────────────
function buildHotels() {
  const hotels = [];
  let seed = 0;

  cities.forEach((cityObj) => {
    const { city, state, tier } = cityObj;
    const templates = tier === 1 ? tier1Hotels : tier === 2 ? tier2Hotels : tier3Hotels;

    templates.forEach((tpl, tplIdx) => {
      seed++;
      const name = `${tpl.prefix} ${city}`;
      // Add small price variation per city so prices feel real
      const priceVariation = 1 + ((seed % 5) * 0.08);
      const basePrice = Math.round(tpl.basePrice * priceVariation);
      const rating = parseFloat((3.8 + (seed % 12) * 0.1).toFixed(1));
      const reviewCount = 50 + (seed % 400);
      const imgs = pickImages(seed + tplIdx);
      const isFeatured = tier === 1 && tplIdx < 2;

      hotels.push({
        name,
        description: makeDescription(name, city, state, tpl.category),
        location: {
          city,
          state,
          country: 'India',
          address: `${10 + (seed % 90)} ${['MG Road','Station Road','Civil Lines','Nehru Nagar','Gandhi Chowk','Park Street','Mall Road','Ring Road'][seed % 8]}, ${city}`,
        },
        images: imgs,
        thumbnail: imgs[0],
        price: basePrice,
        rating,
        reviewCount,
        amenities: amenityMap[tpl.category],
        rooms: getRooms(basePrice, tpl.category),
        category: tpl.category,
        isFeatured,
        isActive: true,
        tags: makeTags(city, tpl.category, tier),
        checkInTime: '14:00',
        checkOutTime: '11:00',
        policies: {
          cancellation: 'Free cancellation up to 24 hours before check-in',
          pets: false,
          smoking: false,
        },
      });
    });
  });

  return hotels;
}

// ─── Seed function ────────────────────────────────────────────────────────────
async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Keep existing users, only replace hotels
    await Hotel.deleteMany({});
    console.log('Cleared existing hotels');

    const hotels = buildHotels();
    console.log(`Building ${hotels.length} hotels across ${cities.length} cities...`);

    // Insert in batches of 50 to avoid memory issues
    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < hotels.length; i += batchSize) {
      const batch = hotels.slice(i, i + batchSize);
      await Hotel.insertMany(batch);
      inserted += batch.length;
      process.stdout.write(`\r  Inserted ${inserted}/${hotels.length} hotels...`);
    }

    console.log(`\n\nSummary:`);
    console.log(`  Cities covered : ${cities.length}`);
    console.log(`  Total hotels   : ${hotels.length}`);
    console.log(`  Tier-1 cities  : ${cities.filter(c => c.tier === 1).length} x 5 = ${cities.filter(c => c.tier === 1).length * 5} hotels`);
    console.log(`  Tier-2 cities  : ${cities.filter(c => c.tier === 2).length} x 5 = ${cities.filter(c => c.tier === 2).length * 5} hotels`);
    console.log(`  Tier-3 cities  : ${cities.filter(c => c.tier === 3).length} x 5 = ${cities.filter(c => c.tier === 3).length * 5} hotels`);
    console.log('\nDone! Admin: admin@stayeo.com / Admin@123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seedDB();
