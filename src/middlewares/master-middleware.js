const jwt = require('jsonwebtoken');

const checkMaster = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Token missing');
    const token = authHeader.split(' ')[1];
    const response = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = response;

    if (req.user.role !== 'Master') {
      return res.status(403).send('Access denied: Admins only');
    }

    next();
  } catch (error) {
    return res.status(401).json(error);
  }
};

module.exports = {
  checkMaster,
};
