const express = require('express');
const {User} = require('../Schema/User'); // Assuming you have a User model
const Item = require('../Schema/Item'); // Assuming you have an Item model
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route to update user profile
router.get('/', async (req, res) => { 
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
    const cart = user.cart;
    var items = [];
    for (let i = 0; i < cart.length; i++) {
        const item = await Item.findById(cart[i]);
        if(item.sold){
            continue;
        }
        // send only the id, name , price , vendor
        const data = {
            _id: item._id,
            name: item.name,
            price: item.price,
            sellerID: item.sellerID
        }
        items.push(data);
    }
    return res.status(200).send(items);
});

module.exports = router;