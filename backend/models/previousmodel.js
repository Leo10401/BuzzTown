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
});

module.exports = model('previous', myschema);