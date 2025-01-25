const router = require('express').Router();
const {User, validateLogin} = require('../Schema/User');
const bcrypt = require('bcryptjs');

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