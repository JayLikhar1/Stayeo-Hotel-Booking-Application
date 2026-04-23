const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

dotenv.config();

const hotels = [
  {
    name: 'The Grand Oberoi Palace',
    description: 'Experience unparalleled luxury at The Grand Oberoi Palace, where timeless elegance meets modern sophistication. Nestled in the heart of Mumbai, this iconic property offers breathtaking views of the Arabian Sea and world-class amenities.',
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', address: 'Marine Drive, Nariman Point' },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    price: 12000,
    rating: 4.9,
    reviewCount: 342,
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking', 'Room Service', 'Business Center'],
    category: 'Ultra-Luxury',
    isFeatured: true,
    tags: ['Luxury', 'Sea View', 'Business', 'Honeymoon'],
    rooms: [
      { type: 'Deluxe', price: 12000, capacity: 2, amenities: ['King Bed', 'Sea View', 'Mini Bar'], count: 20 },
      { type: 'Suite', price: 25000, capacity: 3, amenities: ['Living Room', 'Jacuzzi', 'Butler Service'], count: 10 },
      { type: 'Presidential', price: 75000, capacity: 4, amenities: ['Private Pool', 'Personal Chef', 'Panoramic View'], count: 2 },
    ],
  },
  {
    name: 'Taj Lake Palace',
    description: 'Float on the serene waters of Lake Pichola at the legendary Taj Lake Palace. This 18th-century palace hotel is a masterpiece of Rajput architecture, offering an ethereal experience unlike any other in the world.',
    location: { city: 'Udaipur', state: 'Rajasthan', country: 'India', address: 'Lake Pichola' },
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
    price: 35000,
    rating: 4.8,
    reviewCount: 521,
    amenities: ['Lake View', 'Spa', 'Swimming Pool', 'Fine Dining', 'Boat Rides', 'Cultural Shows', 'Yoga', 'Free WiFi'],
    category: 'Ultra-Luxury',
    isFeatured: true,
    tags: ['Heritage', 'Lake View', 'Romantic', 'Palace'],
    rooms: [
      { type: 'Deluxe', price: 35000, capacity: 2, amenities: ['Lake View', 'King Bed', 'Marble Bathroom'], count: 15 },
      { type: 'Suite', price: 65000, capacity: 2, amenities: ['Private Terrace', 'Jacuzzi', 'Lake View'], count: 8 },
      { type: 'Presidential', price: 150000, capacity: 4, amenities: ['Royal Suite', 'Private Dining', 'Butler'], count: 1 },
    ],
  },
  {
    name: 'ITC Maurya New Delhi',
    description: 'A landmark of luxury in the capital, ITC Maurya combines the grandeur of ancient India with contemporary elegance. Home to the legendary Bukhara restaurant and offering impeccable service to world leaders and discerning travelers.',
    location: { city: 'New Delhi', state: 'Delhi', country: 'India', address: 'Sardar Patel Marg, Diplomatic Enclave' },
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600',
    price: 18000,
    rating: 4.7,
    reviewCount: 289,
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Bar', 'Business Center', 'Gym', 'Concierge'],
    category: 'Luxury',
    isFeatured: true,
    tags: ['Business', 'Luxury', 'Heritage', 'Diplomatic'],
    rooms: [
      { type: 'Standard', price: 18000, capacity: 2, amenities: ['City View', 'King Bed', 'Work Desk'], count: 30 },
      { type: 'Deluxe', price: 28000, capacity: 2, amenities: ['Club Access', 'Premium Minibar', 'Lounge Access'], count: 20 },
      { type: 'Suite', price: 55000, capacity: 3, amenities: ['Living Area', 'Dining Room', 'Butler Service'], count: 5 },
    ],
  },
  {
    name: 'The Leela Palace Bengaluru',
    description: 'An oasis of tranquility in the Silicon Valley of India, The Leela Palace Bengaluru offers a perfect blend of royal Mysore architecture and modern luxury. Ideal for both business and leisure travelers.',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', address: '23 Airport Road, Kodihalli' },
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600',
    price: 15000,
    rating: 4.6,
    reviewCount: 198,
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Business Center', 'Airport Transfer'],
    category: 'Luxury',
    isFeatured: true,
    tags: ['Business', 'Tech Hub', 'Luxury', 'Airport'],
    rooms: [
      { type: 'Deluxe', price: 15000, capacity: 2, amenities: ['Garden View', 'King Bed', 'Bathtub'], count: 25 },
      { type: 'Suite', price: 35000, capacity: 3, amenities: ['Pool View', 'Living Room', 'Kitchenette'], count: 10 },
    ],
  },
  {
    name: 'Wildflower Hall Shimla',
    description: 'Perched at 8,250 feet in the Himalayas, Wildflower Hall is a former residence of Lord Kitchener. Surrounded by cedar forests and offering panoramic mountain views, this is the ultimate mountain luxury retreat.',
    location: { city: 'Shimla', state: 'Himachal Pradesh', country: 'India', address: 'Chharabra, Mashobra' },
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    price: 22000,
    rating: 4.8,
    reviewCount: 156,
    amenities: ['Mountain View', 'Spa', 'Heated Pool', 'Trekking', 'Skiing', 'Fine Dining', 'Fireplace', 'Free WiFi'],
    category: 'Ultra-Luxury',
    isFeatured: true,
    tags: ['Mountain', 'Adventure', 'Romantic', 'Heritage'],
    rooms: [
      { type: 'Deluxe', price: 22000, capacity: 2, amenities: ['Mountain View', 'Fireplace', 'King Bed'], count: 15 },
      { type: 'Suite', price: 45000, capacity: 2, amenities: ['Private Balcony', 'Jacuzzi', 'Panoramic View'], count: 6 },
    ],
  },
  {
    name: 'Alila Fort Bishangarh',
    description: 'A 230-year-old fort transformed into a luxury hotel, Alila Fort Bishangarh rises dramatically from the Aravalli hills. Experience authentic Rajasthani culture with modern luxury in this architectural marvel.',
    location: { city: 'Jaipur', state: 'Rajasthan', country: 'India', address: 'Bishangarh Village, Jaipur-Sikar Highway' },
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
    price: 28000,
    rating: 4.9,
    reviewCount: 203,
    amenities: ['Fort View', 'Infinity Pool', 'Spa', 'Camel Safari', 'Cultural Programs', 'Fine Dining', 'Yoga', 'Free WiFi'],
    category: 'Ultra-Luxury',
    isFeatured: true,
    tags: ['Heritage', 'Fort', 'Rajasthan', 'Romantic'],
    rooms: [
      { type: 'Deluxe', price: 28000, capacity: 2, amenities: ['Fort View', 'King Bed', 'Stone Walls'], count: 20 },
      { type: 'Suite', price: 55000, capacity: 3, amenities: ['Private Terrace', 'Plunge Pool', 'Butler'], count: 8 },
    ],
  },
  {
    name: 'Vivanta Goa Panaji',
    description: 'Where the Arabian Sea meets Goan charm, Vivanta Goa offers a vibrant beachside experience. With stunning sea views, world-class dining, and the perfect blend of Portuguese heritage and modern luxury.',
    location: { city: 'Goa', state: 'Goa', country: 'India', address: 'Miramar Beach, Panaji' },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    price: 9500,
    rating: 4.5,
    reviewCount: 412,
    amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar', 'Free WiFi', 'Gym'],
    category: 'Premium',
    isFeatured: true,
    tags: ['Beach', 'Goa', 'Party', 'Relaxation'],
    rooms: [
      { type: 'Standard', price: 9500, capacity: 2, amenities: ['Garden View', 'Queen Bed', 'Balcony'], count: 30 },
      { type: 'Deluxe', price: 15000, capacity: 2, amenities: ['Sea View', 'King Bed', 'Private Balcony'], count: 20 },
      { type: 'Suite', price: 30000, capacity: 4, amenities: ['Ocean Suite', 'Living Room', 'Jacuzzi'], count: 5 },
    ],
  },
  {
    name: 'Rambagh Palace Jaipur',
    description: 'Once the residence of the Maharaja of Jaipur, Rambagh Palace is the jewel of Jaipur. This magnificent palace hotel offers royal Rajput architecture, lush gardens, and an experience fit for royalty.',
    location: { city: 'Jaipur', state: 'Rajasthan', country: 'India', address: 'Bhawani Singh Road' },
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
    price: 42000,
    rating: 4.9,
    reviewCount: 678,
    amenities: ['Palace Gardens', 'Spa', 'Pool', 'Polo Ground', 'Fine Dining', 'Cultural Shows', 'Elephant Rides', 'Free WiFi'],
    category: 'Ultra-Luxury',
    isFeatured: false,
    tags: ['Palace', 'Royal', 'Heritage', 'Rajasthan'],
    rooms: [
      { type: 'Deluxe', price: 42000, capacity: 2, amenities: ['Garden View', 'Royal Decor', 'King Bed'], count: 25 },
      { type: 'Suite', price: 85000, capacity: 3, amenities: ['Palace Suite', 'Private Garden', 'Butler'], count: 10 },
      { type: 'Presidential', price: 200000, capacity: 4, amenities: ['Maharaja Suite', 'Private Pool', 'Royal Treatment'], count: 1 },
    ],
  },
  {
    name: 'Hyatt Regency Chennai',
    description: 'A contemporary luxury hotel in the heart of Chennai, Hyatt Regency offers stunning views of the Bay of Bengal and the city skyline. Perfect for business travelers and leisure guests seeking modern comfort.',
    location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India', address: '365 Anna Salai, Teynampet' },
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
    price: 8500,
    rating: 4.4,
    reviewCount: 234,
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Business Center', 'Valet'],
    category: 'Premium',
    isFeatured: false,
    tags: ['Business', 'City', 'Modern', 'South India'],
    rooms: [
      { type: 'Standard', price: 8500, capacity: 2, amenities: ['City View', 'King Bed', 'Work Desk'], count: 40 },
      { type: 'Deluxe', price: 14000, capacity: 2, amenities: ['Sea View', 'Club Access', 'Lounge'], count: 20 },
    ],
  },
  {
    name: 'Zostel Rishikesh',
    description: 'The perfect base for adventure seekers and spiritual explorers, Zostel Rishikesh offers comfortable, affordable accommodation with stunning Ganges views. Connect with fellow travelers in a vibrant community atmosphere.',
    location: { city: 'Rishikesh', state: 'Uttarakhand', country: 'India', address: 'Laxman Jhula Road' },
    images: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
    price: 1500,
    rating: 4.3,
    reviewCount: 892,
    amenities: ['River View', 'Free WiFi', 'Common Kitchen', 'Yoga Classes', 'Rafting Packages', 'Cafe', 'Lockers'],
    category: 'Budget',
    isFeatured: false,
    tags: ['Budget', 'Adventure', 'Yoga', 'Backpacker'],
    rooms: [
      { type: 'Standard', price: 1500, capacity: 2, amenities: ['River View', 'AC', 'Private Bathroom'], count: 15 },
      { type: 'Studio', price: 800, capacity: 1, amenities: ['Dorm Bed', 'Locker', 'Shared Bathroom'], count: 20 },
    ],
  },
  {
    name: 'Marriott Kolkata',
    description: 'Experience the cultural richness of the City of Joy from the comfort of Marriott Kolkata. Located in the vibrant Salt Lake area, this hotel offers modern amenities and easy access to Kolkata\'s iconic landmarks.',
    location: { city: 'Kolkata', state: 'West Bengal', country: 'India', address: 'Plot No. 6, Block DJ, Sector II, Salt Lake' },
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
    price: 7500,
    rating: 4.3,
    reviewCount: 167,
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Business Center'],
    category: 'Standard',
    isFeatured: false,
    tags: ['Business', 'City', 'Cultural'],
    rooms: [
      { type: 'Standard', price: 7500, capacity: 2, amenities: ['City View', 'King Bed', 'Work Desk'], count: 35 },
      { type: 'Deluxe', price: 12000, capacity: 2, amenities: ['Premium View', 'Club Access'], count: 15 },
    ],
  },
  {
    name: 'Radisson Blu Pune',
    description: 'Modern luxury in the Oxford of the East, Radisson Blu Pune offers contemporary comfort in the heart of Pune\'s business district. Perfect for corporate travelers and weekend getaways from Mumbai.',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', address: 'Bund Garden Road, Koregaon Park' },
    images: [
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600',
    price: 6500,
    rating: 4.2,
    reviewCount: 143,
    amenities: ['Free WiFi', 'Pool', 'Restaurant', 'Bar', 'Gym', 'Business Center', 'Parking'],
    category: 'Standard',
    isFeatured: false,
    tags: ['Business', 'City', 'Weekend Getaway'],
    rooms: [
      { type: 'Standard', price: 6500, capacity: 2, amenities: ['City View', 'Queen Bed'], count: 40 },
      { type: 'Deluxe', price: 10000, capacity: 2, amenities: ['Pool View', 'King Bed', 'Bathtub'], count: 20 },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hotel.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'StayEo Admin',
      email: 'admin@stayeo.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@stayeo.com',
      password: 'User@123',
      role: 'user',
    });
    console.log('Test user created:', testUser.email);

    // Seed hotels
    await Hotel.insertMany(hotels);
    console.log(`${hotels.length} hotels seeded successfully`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin: admin@stayeo.com / Admin@123');
    console.log('User: user@stayeo.com / User@123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
