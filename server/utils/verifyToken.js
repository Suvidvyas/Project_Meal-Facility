const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(403).json({ error: 'No token provided' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
      });
}

module.exports.verifyToken = verifyToken;