const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../Schema/Order'); // Assuming you have an Order model
const bcrypt = require('bcrypt')
const router = express.Router();

// Route to get all orders
router.put('/', async (req, res) => {
    // require token
    const token = req.body.headers['authorization'];
    const data = req.body.data
    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }
    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(403).send({ message: 'Invalid token' });
    }
    const email = decoded.email;
    for (const item of data) {
        const { _id, newotp } = item;
        // console.log(item)
        // Find the document by ID and update the hashed otp field
        const foundItem = await Order.findOne({_id})
        if (foundItem) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedOTP = await bcrypt.hash(newotp.toString(), salt);
            foundItem.hashedOTP= hashedOTP;
            await foundItem.save();
    } else {
        console.log(`Item with _id ${_id} not found.`);
    }
    }

    try {
        res.status(200).json({message: "otp changed"});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

module.exports = router;