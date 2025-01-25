const express = require('express');
const {User} = require('../Schema/User'); // Assuming you have a User model
const Item = require('../Schema/Item'); // Assuming you have an Item model
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

// Route to update user profile
router.put('/', async (req, res) => { 
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }
    const decoded = jwt.decode(token);
    const findmail = decoded.email;
    const user = await User.findOne({ email: findmail });
    if (!user) {
        return res.status(403).send({ message: 'Invalid token. User not found.' });
    }

    const {_id} = req.body;
    if(!_id){
        return res.status(400).send({message: "Item ID is required."});
    }
    // check if id is in shop
    // convert _id into item object id
    const item = await Item.findById(_id);
    if(!item){
        return res.status(404).send({message: "Item not found."});
    }
    // check if user is the owner of the item
    if(item.sellerID === user.email){
        return res.status(403).send({message: "You can't add your own items to cart."});
    }
    
    if (user.cart.some(cartItem => cartItem._id.toString() === _id)) {
        return res.status(400).send({ message: "Item is already in cart." });
    }
    
    // add item to user's cart
    user.cart.push(item);
    await user.save();
    res.status(200).send({message: "Item added to cart."});
});

module.exports = router;