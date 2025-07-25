const express = require('express');

const model = require('../models/productmodel');
const previousModel = require('../models/previousmodel');
const orderModel = require('../models/orderModel');

const router = express.Router();
router.post('/add', (req, res) => {
    console.log(req.body)
    new model(req.body).save()

        .then((result) => {
            console.log(result);
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

    // res.send("add response from user ")
});



router.get('/getall', (req, res) => {
    model.find()
        .then((result) => {
            res.json(result);

        }).catch((err) => {
            console.log(err)
            res.json(err)
        });
});
router.get('/getbyid/:id', (req, res) => {
    model.findById(req.params.id)
        .then((result) => {
            res.json(result);

        }).catch((err) => {
            console.log(err)
            res.json(err)
        });
});

router.get('/update/:id', (req, res) => {
    model.findByIdAndUpdate(req.params.id, req.body, {new : true})
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json(err)
        });
});

router.delete('/delete/:id', (req, res) => {

    model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.json(result);

        }).catch((err) => {
            console.log(err);
            res.json(err)
        });
});

// Move expired products to previous events
router.post('/move-expired-to-previous', async (req, res) => {
    try {
        const now = new Date();
        // Find products with date in the past
        const expiredProducts = await model.find({ date: { $lt: now } });
        if (expiredProducts.length === 0) {
            return res.json({ message: 'No expired products found.' });
        }
        // Map to previousmodel fields
        const previousEvents = expiredProducts.map(prod => ({
            title: prod.title,
            image: prod.image,
            description: prod.description,
            location: prod.location,
            date: prod.date,
            category: prod.category
        }));
        // Insert into previous collection
        await previousModel.insertMany(previousEvents);
        // Delete from product collection
        const ids = expiredProducts.map(prod => prod._id);
        await model.deleteMany({ _id: { $in: ids } });
        res.json({
            message: 'Expired products moved to previous events.',
            movedCount: previousEvents.length,
            movedTitles: previousEvents.map(e => e.title)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to move expired products.' });
    }
});

// Get only upcoming events (date >= now)
router.get('/getupcoming', (req, res) => {
    const now = new Date();
    model.find({ date: { $gte: now } })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Trending events: most tickets sold today
router.get('/trending-today', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Aggregate orders for today, group by product, sum ticket quantities
        const trending = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $unwind: "$items" },
            { $group: { _id: "$product", ticketsSold: { $sum: "$items.quantity" } } },
            { $sort: { ticketsSold: -1 } },
            { $limit: 4 }
        ]);

        // Get event details
        const eventIds = trending.map(t => t._id);
        const events = await model.find({ _id: { $in: eventIds } });

        // Attach ticketsSold to event
        const eventsWithSales = events.map(event => {
            const sales = trending.find(t => t._id.equals(event._id));
            return { ...event.toObject(), ticketsSold: sales ? sales.ticketsSold : 0 };
        });

        res.json(eventsWithSales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch trending events.' });
    }
});
module.exports = router;
//getall
//getbyid
// update
//delete
//product router

