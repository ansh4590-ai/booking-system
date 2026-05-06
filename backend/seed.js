const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

const sampleBookings = [
    {
        bookingId: 'BK-20260429-A1B2',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        roomType: 'Deluxe',
        checkInDate: new Date('2026-05-10'),
        checkOutDate: new Date('2026-05-15'),
        guests: 2,
        status: 'Confirmed'
    },
    {
        bookingId: 'BK-20260429-C3D4',
        fullName: 'Robert Brown',
        email: 'robert@example.com',
        phone: '8765432109',
        roomType: 'Standard',
        checkInDate: new Date('2026-05-20'),
        checkOutDate: new Date('2026-05-22'),
        guests: 1,
        status: 'Pending'
    },
    {
        bookingId: 'BK-20260429-E5F6',
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '7654321098',
        roomType: 'Suite',
        checkInDate: new Date('2026-06-01'),
        checkOutDate: new Date('2026-06-05'),
        guests: 4,
        status: 'Cancelled'
    }
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_booking');
        console.log('Connected to MongoDB for seeding...');
        
        await Booking.deleteMany({});
        await Booking.insertMany(sampleBookings);
        
        console.log('Sample data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedDB();
