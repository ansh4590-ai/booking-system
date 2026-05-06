const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bookingRoutes = require('./routes/bookings');
app.use('/api', bookingRoutes); // Changed to mount at /api so /api/bookings and /api/availability both work


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_booking')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
