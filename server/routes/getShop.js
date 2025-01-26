const express = require('express');
const Item = require('../Schema/Item');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', async (req, res) => {
    // check if auth token exists
    const token = req.headers['authorization'];
    try {
        const items = await Item.find();
        if(!token) res.json(items);
        else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const sellerID = decoded.email;
            // console.log(sellerID);
            const send_items = items.filter(item => item.sellerID !== sellerID);
            res.json(send_items);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;