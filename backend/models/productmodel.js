const { Schema, model } = require('../connection');

// Event Schema
const myschema = new Schema({
    title: { type: String, required: true, unique: true }, // Event title
    image: [{ type: String, required: true }], // Array of image URLs
    description: { type: String, required: true }, // Event description
    location: { type: String, required: true }, // Event location
    date: { type: Date, required: true }, // Event date
    startTime: { type: String, required: true }, // Event start time (e.g., '18:00' or '6:00 PM')
    category: { type: String, required: true }, // Event category (e.g., Music, Sports)
    tickets: [
        {
            type: { type: String, required: true }, // Ticket type (e.g., VIP, Regular, Fanpit)
            price: { type: Number, required: true }, // Price for the ticket type
            availability: { type: Number, required: true }, // Number of tickets available
        },
    ],
    discount: { type: Number, default: 0 }, // Discount percentage
    offer: { type: Number, default: 0 }, // Offer percentage
    createdAt: {type : Date, default : Date.now()}
});

module.exports = model('product', myschema);