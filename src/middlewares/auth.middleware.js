const jwt = require('jsonwebtoken');
const prisma = require('./../config/db.config')

const protectAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        console.log('Decoded token:', decoded);

    

  


    req.user = decoded; 

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


module.exports = protectAccessToken;
