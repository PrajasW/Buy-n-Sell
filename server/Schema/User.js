const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|research\.iiit\.ac\.in|student\.iiit\.ac\.in)$/,
    },
    dateOfBirth: { type: Date, required: true },
    contactNumber: { 
        type: String, 
        required: true, 
        // match: /^[6-9]\d{9}$/, // Validate Indian mobile numbers
    },
    password: { type: String, required: true },
    cart: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        },
    ],
    sellerReviews: [
        {
            reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String },
        },
    ],
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
    return token;
}   


const validateRegister= (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('firstName'),
        lastName: Joi.string().required().label('lastName'),
        email: Joi.string().email().regex(/^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|research\.iiit\.ac\.in|student\.iiit\.ac\.in)$/).required().label('email'),
        contactNumber: Joi.string().required().label('contactNumber'),
        dateOfBirth: Joi.date().required().label('dateOfBirth'),
        password: Joi.string().required().label('password'),
    });
    return schema.validate(data);
}

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label('email'),
        password: Joi.string().required().label('password'),
        captchaToken: Joi.string().required().label('captchaToken')
    });
    return schema.validate(data);
}

const User = mongoose.model('User', userSchema);

module.exports = { User, validateRegister, validateLogin };

