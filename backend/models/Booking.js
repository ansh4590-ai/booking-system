const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    roomType: {
        type: String,
        required: true,
        enum: ['Standard', 'Suite', 'Family']
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

bookingSchema.pre('validate', function(next) {
    if (this.checkOutDate <= this.checkInDate) {
        this.invalidate('checkOutDate', 'Check-out date must be after check-in date');
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
