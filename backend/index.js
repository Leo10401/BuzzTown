// import express
const express = require('express');
const userrouter = require('./routers/userrouter');
const productrouter = require('./routers/productrouter')
const utilROuter = require('./routers/utils')
const reviewRouter = require('./routers/reviewRouter')
const orderRouter = require('./routers/orderRouter')
const previousRouter = require('./routers/previousRouter');
const Razorpay = require('razorpay');
const cors = require('cors')
// initialize express app
const crypto = require('crypto');
const app = express();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = 5000;
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
//middleware
app.use(cors({
    origin: ['https://buzz-town.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
    credentials: true
}));

// Add CORS headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://buzz-town.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

app.use('/user', userrouter);
app.use('/product', productrouter);
app.use('/previous', previousRouter);
app.use('/util', utilROuter);
app.use('/review', reviewRouter);
app.use('/order', orderRouter);

app.use(express.static('./static/uploads'));

app.get('/get-permission', (req, res) => {
    const token = req.header('x-auth-token');
    console.log(token);
    if(token === 'admin'){
        res.json({allowed: true});
    }else{
        res.json({allowed: false});
    }
})

app.post('/create-payment-order', async (req, res) => {
  try {
    const { amount, customerData } = req.body;

    console.log('Amount:', amount);
    console.log('Customer Data:', customerData);

    // Create a Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: customerData, // Optional: Add customer data as notes
    });

    console.log('Order Created:', order);

    res.json({
      orderId: order.id, // Razorpay Order ID
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

app.post('/retrieve-payment-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    // Retrieve Razorpay Order details
    const order = await razorpay.orders.fetch(orderId);

    console.log('Order Retrieved:', order);

    res.json(order);
  } catch (error) {
    console.error('Error retrieving Razorpay order:', error);
    res.status(500).json({ error: 'Failed to retrieve Razorpay order' });
  }
});
// app.post('/create-payment-intent', async (req, res) => {
//     const { amount, customerData } = req.body;
//     // const { name, address } = customerData;
//     console.log(amount);
//     const customer = await razorpay.customers.create(customerData);
//     console.log(customer.id);
//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await razorpay.paymentIntents.create({
//       amount: amount * 100,
//       currency: 'inr',
//       description: 'Payment Description',
//       customer : customer.id
//     });
//     res.json({
//       clientSecret: paymentIntent.client_secret
//     });
//   });
  
//   app.post('/retrieve-payment-intent', async (req, res) => {
//     const { paymentIntentId } = req.body;
//     const paymentIntent = await razorpay.paymentIntents.retrieve(paymentIntentId);
//     res.json(paymentIntent);
//   });

app.listen(port, () => { console.log('server started'); });
