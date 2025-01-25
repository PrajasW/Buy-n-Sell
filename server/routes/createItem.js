const express = require('express');
const mongoose = require('mongoose');
const Item = require('../Schema/Item'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, price, description, category } = req.body;
    // check if token is sent
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    
    if (!name || !price || !description || !category) {
        // return res.status(400).json({ message: 'Please enter all fields' }); write which is missing
        return res.status(400).json({ message: !name ? 'Name is missing' : !price ? 'Price is missing' : !description ? 'Description is missing' : !category ? 'Category is missing' : 'SellerID is missing' });
    }
    // decode email using jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerID = decoded.email;

    try {
        const newItem = new Item({
            name,
            price,
            description,
            category,
            sellerID
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
});

module.exports = router;