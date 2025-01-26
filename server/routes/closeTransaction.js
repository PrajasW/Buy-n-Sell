const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../Schema/Order'); // Assuming you have an Order model
const bcrypt = require('bcrypt');
const { object } = require('joi');
const router = express.Router();

router.put('/', async (req, res) => {
    // require token
    const token = req.body.headers['authorization'];
    const data = req.body.data;
    const {_id,otp} = data;
    // console.log(otp);
    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }
    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(403).send({ message: 'Invalid token' });
    }

    const order = await Order.findById(_id);
    const valid_password = await bcrypt.compare(otp,order.hashedOTP)
    if(valid_password){
        order.processed = true;
        await order.save();
        res.status(200).json({message: "order succesfully closed"});
    }
    else{
        res.status(400).json({message: "Incorrect OTP"});
    }

});

module.exports = router;