const {Schema, model, Types} = require('../connection');

const myschema = new Schema({
    user : {type : Types.ObjectId, ref : 'users'},
    product: { type: Types.ObjectId, ref: 'product', required: true }, // <-- Added event reference
    items: [{
        type: { type: String, required: true }, // Ticket type (e.g., VIP, Regular)
        quantity: { type: Number, required: true }, // Number of tickets of this type
        price: { type: Number, required: true } // Price per ticket
    }],
    intentId: {type : String, unique : true, required : true},
    entryPassKey: { type: String, unique: true, required: true }, // Unique key for entry pass
    details: {type : Object},
    shipping: {type : Object},
    status: {type : String, default : 'placed'},
    createdAt: {type : Date, default : Date.now}
});

module.exports = model('order', myschema);

