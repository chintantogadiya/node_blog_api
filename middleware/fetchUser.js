const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret@code';

const fetchUser = (req, res, next) => {
    // get the userfrom the jwt token and add id to req object
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).json({ error: "invalid authentication token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ error: "invalid authentication token" })
    }
}

module.exports = fetchUser;