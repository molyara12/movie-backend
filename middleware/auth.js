const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Header থেকে token নেওয়া
  const authHeader = req.header('Authorization');

  // Header নাই
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // "Bearer TOKEN" → TOKEN আলাদা করা
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded data req.user এ ঢোকানো
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
