const express = require('express');
const {User} = require('../Schema/User'); // Assuming you have a User model
const Item = require('../Schema/Item'); // Assuming you have an Item model
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

router.delete('/:id', async (req, res) => {
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
    const {id} = req.params;
    const _id = new mongoose.Types.ObjectId(id);
    if(!id) {
        return res.status(400).send({message: "Item id is required."});
    }

    // remove id from cart
    const itemIndex = user.cart.findIndex(item => item.equals(_id));
    if (itemIndex === -1) {
        return res.status(404).send({ message: 'Item not found in cart.' });
    }
    user.cart.splice(itemIndex, 1);
    
    await user.save();

    return res.status(200).send({message: "Item removed from cart."});
});

module.exports = router;