const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    mealType: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    dates: {
        type: [Date],
        required: true
    },
    employees: [{
        empId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        }
    }],
    notes: {
        type: String,
        default: ''
    },
    bookingCount: {
        type: Number,
        required: false
    },
    bookingName: {
        type: String,
        required: false
    },
    isDelete: {
        type: String,
        default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
