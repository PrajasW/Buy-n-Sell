const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../Schema/User');
const verifyToken = require('./verifyToken');

const router = express.Router();

router.get('/', verifyToken,async (req, res) => {
    try{
        // getUserById(req.userId, (err, user) => {
        //     if (err) return res.status(500).send('Internal server error');
        //     if (!user) return res.status(404).send('No user found');
        //     res.status(200).send(user);
        // });
        const token = req.headers['authorization'];
        if(!token){
            return res.status(401).send({message: "Token is required."});
        }
        const decoded = jwt.decode(token);
        const email = decoded.email;
        const user = await User.findOne({email: email}).select("-password -createdAt -updatedAt -__v -_id");
        if(!user){
            return res.status(404).send({message: "User not found."});
        }
        res.status(200).send({message: "User found", data: user});
    }
    catch (error) {
        console.error(error);
    }
});

module.exports = router;
