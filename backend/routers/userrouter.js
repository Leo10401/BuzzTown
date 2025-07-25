const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const model = require('../models/usermodel');
const verifyToken = require('./verifyToken');

const router = express.Router();
router.post('/add', (req, res) => {
    console.log(req.body)
    new model(req.body).save()

        .then((result) => {
            console.log(result);
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.json(err);
        });
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

router.get('/getbyemail/:email', (req, res) => {
    model.findOne({ email: req.params.email })
        .then((result) => {
            if(result) res.json(result);
            else res.status(404).json({ message: 'Email not registered' });
        }).catch((err) => {
            console.log(err)
            res.json(err)
        });
})

router.get('/getprofile', verifyToken, (req, res) => {
    model.findById(req.user._id)
        .then((result) => {
            res.json(result);

        }).catch((err) => {
            console.log(err)
            res.json(err)
        });
});

router.put('/update/:id', (req, res) => {
    model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err)
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

router.post("/authenticate", (req, res) => {
    // console.log(req.body);
    model.findOne(req.body)
        .then((result) => {
            if (result) {
                console.log(result);
                const { _id, name, email, role, avatar } = result;
                const payload = { _id, name, email, role };
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '2 days' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: 'error creating token' })
                        } else {
                            res.status(200).json({ token, _id, name, email, role, avatar })
                        }
                    }
                )
            } else {
                res.status(401).json({ message: 'Invalid Credentials' })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get("/authorise", verifyToken, (req, res) => {
    console.log(req.user);
    
    res.status(200).json({ allowed: true, role : req.user.role });
});

module.exports = router;
//getall
//getbyid
// update
//delete
//product router

