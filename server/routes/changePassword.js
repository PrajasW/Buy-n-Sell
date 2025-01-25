const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../Schema/User');
const verifyToken = require('./verifyToken');

const router = express.Router();

router.get('/', verifyToken,async (req, res) => {
    try{
        const token = req.headers['authorization'];
        const decoded = jwt.decode(token);
        const email = decoded.email;
        const user = await User.findOne({email: email}).select("-password -createdAt -updatedAt -__v -_id");
        if(!user){
            return res.status(404).send({message: "User not found."});
        }
        // console.log(user)
        res.status(200).send({message: "User found", data: user});
    }
    catch (error) {
        console.error(error);
    }
});

module.exports = router;
