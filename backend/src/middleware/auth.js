const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'Missing access token' });
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

function requireRole(roles = []) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (allowed.length && !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
}

async function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const found = await prisma.refreshToken.findUnique({ where: { token } });
    if (!found) return null;
    if (new Date(found.expiresAt) < new Date()) return null;
    return { userId: payload.sub, tokenRecord: found, role: payload.role };
  } catch (e) {
    return null;
  }
}

module.exports = { authRequired, requireRole, verifyRefreshToken };