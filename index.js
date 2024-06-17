const express = require('express');
const mongoose = require('mongoose');
const Bank = require('./Models/Bank');

const MONGO_URI = "mongodb://localhost:27017/test";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB successfully");

    // Define routes after successful MongoDB connection
    // Get all banks
    app.get('/banks', async (req, res) => {
        try {
            const banks = await Bank.find().exec();
            res.json(banks);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Get branches for a specific bank
    app.get('/banks/:name/branches', async (req, res) => {
        try {
            const bank = await Bank.findOne({ name: req.params.name }).exec();
            if (bank) {
                res.json(bank.branches);
            } else {
                res.status(404).send('Bank not found');
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });

}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});
