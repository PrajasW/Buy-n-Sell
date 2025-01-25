const express = require('express');
const mongoose = require('mongoose');
const Order = require('../Schema/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Schema/User');
const router = express.Router();

// this will create an order for all the items present in user's cart
// this will also generate an OTP for the order
router.post('/', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }
    const decoded = jwt.decode(token);
    const buyerID = decoded.email;
    if(!buyerID){
        return res.status(403).send({message: "Invalid token."});
    }
    // fetch user's cart
    const user = await User.findOne({ email: buyerID });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }
    const cart = user.cart;
    if (!cart || cart.length === 0) {
        return res.status(400).send({ message: 'Cart is empty' });
    }
    // create order for each item in cart
    const orders = [];
    for (let i = 0; i < cart.length; i++) {
        const itemID = cart[i].itemID;
        const sellerID = cart[i].sellerID;
        const amount = cart[i].price;
        // hashed otp will be hashed using buyer's id
        const otp = Math.floor(100000 + Math.random() * 899999);
        // use the buyer's _id as salt
        const order = new Order({
            itemID : mongoose.Types.ObjectId(itemID),
            buyerID : mongoose.Types.ObjectId(user._id),
            sellerID : mongoose.Types.ObjectId(sellerID),
            amount : amount,
            hashedOTP : otp,
        });
        orders.push(order);
    }
    // push to database
    try {
        await Order.insertMany(orders);
        user.cart = [];
        await user.save();
        return res.status(200).send({ message: 'Order created successfully' });
    } catch (err) {
        return res.status(500).send({ message: 'Internal server error' });
    }

});

module.exports = router;