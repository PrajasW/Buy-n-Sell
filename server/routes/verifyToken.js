const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const verifyToken = (req, res, next) => {
    // console.log(req.headers);
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token');
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;