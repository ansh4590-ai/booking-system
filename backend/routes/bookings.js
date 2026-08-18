const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const generateBookingId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${date}-${random}`;
};

const ROOM_CAPACITIES = {
    'Standard': 5,
    'Suite': 2,
    'Family': 2
};

const checkAvailability = async (roomType, checkIn, checkOut, excludeBookingId = null) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const query = {
        roomType,
        status: { $ne: 'Cancelled' },
        $or: [
            { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
        ]
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBookings = await Booking.find(query);
    const bookedCount = overlappingBookings.length;
    
    return bookedCount < ROOM_CAPACITIES[roomType];
};

router.get('/availability', async (req,res) => {
    try {
        const { roomType, checkIn, checkOut } = req.query;
        if (!roomType || !checkIn || !checkOut) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        const isAvailable = await checkAvailability(roomType, checkIn, checkOut);
        res.json({ available: isAvailable });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/bookings/search', async (req,res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Search query required' });

        const bookings = await Booking.find({
            $or: [
                { bookingId: query },
                { email: query.toLowerCase() },
                { phone: query }
            ]
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/bookings', async (req, res) => {
    try {
        const { fullName, email, phone, roomType, checkInDate, checkOutDate, guests } = req.body;

        const isAvailable = await checkAvailability(roomType, checkInDate, checkOutDate);
        if (!isAvailable) {
            return res.status(400).json({ message: 'Room not available for the selected dates' });
        }

        const newBooking = new Booking({
            bookingId: generateBookingId(),
            fullName,
            email,
            phone,
            roomType,
            checkInDate,
            checkOutDate,
            guests
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/bookings/:id', async (req, res) => {
    try {
        const { roomType, checkInDate, checkOutDate, status } = req.body;
        
        if (roomType || checkInDate || checkOutDate) {
            const currentBooking = await Booking.findById(req.params.id);
            const isAvailable = await checkAvailability(
                roomType || currentBooking.roomType,
                checkInDate || currentBooking.checkInDate,
                checkOutDate || currentBooking.checkOutDate,
                req.params.id
            );
            if (!isAvailable) {
                return res.status(400).json({ message: 'Room not available for the updated dates' });
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/bookings/:id', async (req, res) => {

    try {
        const result = await Booking.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;