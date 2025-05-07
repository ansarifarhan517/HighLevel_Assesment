const jwt = require('jsonwebtoken');
const secret = 'your-secret-key';
const User = require('../model/Users.model.js');
const authenticate = async (req, res, next) => {
    try {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, secret);
    const user
    = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}
module.exports = authenticate;