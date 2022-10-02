const jwt = require('jsonwebtoken');
const { SecretKey } = require('./config');

const generateToken = (payload) => {
    return jwt.sign(payload, SecretKey, { expiresIn: '1h' });
}

const verifyToken = (event) => {
    try {
        let token
        let { Authorization } = event.headers;
        if(!Authorization) throw('Token missing')
        if (Authorization && Authorization.split(' ')[0] === 'Bearer') {
            token = Authorization.split(' ')[1];
        } else {
            token = Authorization;
        }
        var decoded = jwt.verify(token, SecretKey);
        return decoded;
    } catch(error) {
        throw(`Invalid Token: ${token}`)
    }
}

module.exports = { generateToken, verifyToken }