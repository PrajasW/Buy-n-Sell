const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Order = require('../Schema/Order'); // Assuming you have an Order model
const Item = require('../Schema/Item')

const router = express.Router();

// Route to get all orders
router.get('/', async (req, res) => {
    // require token
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }
    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(403).send({ message: 'Invalid token' });
    }
    const email = decoded.email;
    // find orders
    try {
        const sellerOrders = await Order.find({ sellerID: email, processed: false }).select("-hashedOTP -__v");
        const sellerOrdersWithItemNames = await Promise.all(
        sellerOrders.map(async (order) => {
            const item = await Item.findById(order.itemID).select("name");
            return {
            ...order.toObject(),
            itemName: item ? item.name : "Item not found",
            };
        })
        );

        // note orderes processed will have NULL as hashedOTP
        res.status(200).json(sellerOrdersWithItemNames);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

module.exports = router;