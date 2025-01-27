const express = require('express');
const mongoose = require('mongoose');
const Order = require('../Schema/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../Schema/User');
const Item = require('../Schema/Item');
const router = express.Router();


// this will create an order for all the items present in user's cart
// this will also generate an OTP for the order
router.put('/', async (req, res) => {
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
        // fetch the item details
        const item = await Item.findById(cart[i]);

        const itemID = item._id;
        const sellerID = item.sellerID;
        const amount = item.price;
        const otp = Math.floor(100000 + Math.random() * 899999);
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedOTP = await bcrypt.hash(otp.toString(), salt);

        // check if itemId exists in database
        // const item = await Item.findById(itemID);
        if (item.sold == true) {
            continue;
        }
        item.sold = true;
        await item.save();
        
        // use the buyer's _id as salt
        const order = new Order({
            itemID : itemID,
            buyerID : buyerID,
            sellerID : sellerID,
            amount : amount,
            hashedOTP : hashedOTP,
        });
        orders.push(order);
    }
    // push to database
    try {
        await Order.insertMany(orders);
        // empty the cart
        
        user.cart = [];
        await user.save();
        return res.status(200).send({ message: 'Order created successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }

});

module.exports = router;