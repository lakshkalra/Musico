const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    const token = req.header('auth-token')

    if (!token) {
        return res.status(401).json({ msg: "no token, authorisation denied" })
    }

    try {
        const decoded = jwt.verify(token, config.get("JWTtoken"))
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "invalid token" })
    }
}