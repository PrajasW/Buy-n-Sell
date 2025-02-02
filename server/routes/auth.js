require('dotenv').config();
const router = require('express').Router();
const {User, validateLogin} = require('../Schema/User');
const bcrypt = require('bcryptjs');
const axios = require('axios');

router.post('/', async (req, res) => {
    try{
        const {error} = validateLogin(req.body);
        if(error) 
            return res.status(400).send(error.details[0].message);
        
        const user = await User.findOne({email: req.body.email});
        if(!user)
            return res.status(404).send({message: "User not found."});

        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );
        const captchaToken = req.body.captchaToken;
        if(!captchaToken){
            return res.status(400).send({message: "Send Captcha Token."});
        }
        const verification_url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaToken}`;
        const response_cap = await axios.post(verification_url);
        if(!response_cap.data.success){
            return res.status(400).send({message: "Invalid Captcha."});
        }
        if(!validPassword) 
            return res.status(401).send({message: "Invalid email or password."});
        
        const token = user.generateAuthToken();
        res.status(200).send({
            data: {
                token: token,
                message: "Login successful."
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({message : "Server Error"});
    }
});

module.exports = router;