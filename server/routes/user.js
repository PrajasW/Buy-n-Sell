const router = require('express').Router();
const {User, validateRegister} = require('../Schema/User');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

router.post('/', async (req, res) => {
    try{
        const {error} = validateRegister(req.body);
        if(error) 
            return res.status(400).send(error.details[0].message);

        const user = await User.findOne({email: req.body.email});
        if(user) 
            return res.status(409).send({message : "Email is Already Taken."});

        const find = await User.findOne({contactNumber: req.body.contactNumber});
        if(find) 
            return res.status(409).send({message : "User with this Contact Number is Already Registered."});

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    

        await new User({...req.body, password: hashedPassword}).save();

        res.status(201).send({message: "User registered successfully."});
    }
    catch (error) {
        console.error(error);
        res.status(500).send({message : "Server Error"});
    }
});

module.exports = router;