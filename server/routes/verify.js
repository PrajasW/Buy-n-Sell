const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../Schema/User');
const verifyToken = require('./verifyToken');

const router = express.Router();

router.get('/', verifyToken,async (req, res) => {
    try{
        res.status(200).send({message: "valid token"});
    }
    catch (error) {
        console.error(error);
    }
});

module.exports = router;
