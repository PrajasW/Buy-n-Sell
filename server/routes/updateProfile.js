const express = require('express');
const {User} = require('../Schema/User'); // Assuming you have a User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const router = express.Router();

// Route to update user profile
router.put('/', async (req, res) => {
    const { firstName, lastName, contactNumber, dateOfBirth, password} = req.body;
    try {
        // check if request has all arguments
        if (!firstName || !lastName || !contactNumber || !dateOfBirth) {
            return res.status(400).send({ 
                message: !firstName ? 'First Name is required' : 
                         !lastName ? 'Last Name is required' : 
                         !contactNumber ? 'Contact Number is required' : 
                         'Date of Birth is required' 
            });
        }
        const token =  req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ message: 'Token is required' });
        }
        const decoded = jwt.decode(token);
        const findmail = decoded.email;
        const user = await User.findOne({ email: findmail });
        if (!user) {
            return res.status(403).send({ message: 'Invalid token. User not found.' });
        }

        if(!user){
            return res.status(403).send({message: "Invalid token."});
        }
        user.firstName = firstName;
        user.lastName = lastName;
        user.contactNumber = contactNumber;
        user.dateOfBirth = dateOfBirth;
        user.updatedAt = Date.now();
        
        if(password){
            if(!(password.length >= 8 && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password))) {
                res.status(400).send({ message: 'Password must be at least 8 characters long and contain at least one number and one special character' });
            }
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }
    
    
        await user.save();
        const data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNumber: user.contactNumber,
            dateOfBirth: user.dateOfBirth,
        };
        res.json({ msg: 'Profile updated successfully', data });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;